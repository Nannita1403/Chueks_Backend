const Order = require("../models/order");
const Product = require("../models/products");
const Cart = require("../models/cart");

// ------------------------ Helpers ------------------------
const canonColor = (c) => (c ? String(c).trim().toLowerCase() : undefined);

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
}

function shapeCart(cart, minItems = 10) {
  const items = (cart.items || []).map((it) => {
    const p = it.product || {};
    return {
      id: it._id,
      productId: p._id || it.product,
      name: p.name || it.name || "Producto",
      price: it.price ?? p.priceMin ?? 0,
      image:
        p?.imgPrimary?.url ||
        p?.image ||
        (Array.isArray(p?.images) ? p.images[0] : ""),
      color: canonColor(it.color),
      quantity: Math.max(1, Number(it.quantity) || 1),
    };
  });

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;
  const missing = Math.max(0, minItems - itemCount);

  return { items, subtotal, shipping, total, minItems, itemCount, missing };
}

function shapeOrder(order) {
  if (!order) return null;
  const plain = order.toObject ? order.toObject() : order;

  return {
    ...plain,
    items: (plain.items || []).map((it) => ({
      _id: it._id,
      product: it.product,
      name: it.name,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
      picked: it.picked || false,
    })),
  };
}

// ------------------------ Controllers User ------------------------

// GET carrito
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(shapeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo carrito" });
  }
};

// POST añadir item
const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const color = canonColor(req.body?.color);

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    if (product.stock < quantity)
      return res
        .status(400)
        .json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (it) =>
        String(it.product) === String(productId) &&
        canonColor(it.color) === color
    );

    if (existing) {
      if (existing.quantity + Number(quantity) > product.stock)
        return res.status(400).json({
          message: `Solo quedan ${
            product.stock - existing.quantity
          } unidades disponibles.`,
        });
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        color,
        price: product.priceMin ?? 0,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error añadiendo producto al carrito" });
  }
};

// ⚡ Checkout (desde carrito directo)
const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await getOrCreateCart(userId);
    const shapedCart = shapeCart(cart);

    if (shapedCart.itemCount < shapedCart.minItems)
      return res.status(400).json({
        message: `Debes agregar al menos ${shapedCart.minItems} productos.`,
      });

    // Validar stock
    for (const item of shapedCart.items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Producto ${item.name} no encontrado.` });
      if (product.stock < item.quantity)
        return res.status(400).json({
          message: `No hay suficiente stock para ${item.name}.`,
        });
    }

    // Crear la orden
    const order = await Order.create({
      code: `ORD-${Date.now()}`,
      user: userId,
      items: shapedCart.items.map((it) => ({
        product: it.productId,
        name: it.name,
        color: it.color,
        price: it.price,
        quantity: it.quantity,
        picked: false,
      })),
      subtotal: shapedCart.subtotal,
      shipping: shapedCart.shipping,
      total: shapedCart.total,
      status: "pending",
    });

    // Reservar stock
    for (const item of shapedCart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ ok: true, order: shapeOrder(order) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error procesando el pedido" });
  }
};

// ------------------------ Controllers Admin ------------------------

// GET /orders?status=pending|processing|completed
const listOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email") // Para que admin vea nombre/email
      .sort({ createdAt: -1 });

    res.status(200).json({ orders }); // 👈 IMPORTANTE devolver con clave "orders"
  } catch (err) {
    console.error("Error listOrders:", err);
    res.status(500).json({ message: "Error al listar pedidos" });
  }
};

// PATCH /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    // Si se cancela, devolver stock
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();
    res.status(200).json({ ok: true, order: shapeOrder(order) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando estado" });
  }
};

// PATCH /orders/:orderId/items/:idx/picked
const updateItemPicked = async (req, res) => {
  try {
    const { orderId, idx } = req.params;
    const { picked } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (!order.items[idx])
      return res.status(404).json({ message: "Ítem no encontrado" });

    order.items[idx].picked = picked;
    await order.save();
    res.status(200).json({ ok: true, item: order.items[idx] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando ítem" });
  }
};

// ------------------------ Extras que faltaban ------------------------

// Mis pedidos (usuario logueado)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ orders: orders.map(shapeOrder) });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error obteniendo pedidos del usuario" });
  }
};

// Obtener pedido por ID o código
const getOrder = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const order = await Order.findOne({
      $or: [{ _id: idOrCode }, { code: idOrCode }],
    }).populate("user", "name email");

    if (!order) 
      {return res.status(404).json({ message: "Pedido no encontrado" });
      }
    res.status(200).json(order);
  } catch (err) {
    console.error("Error getOrder:",err);
    res.status(500).json({ message: "Error obteniendo pedido" });
  }
};

// Crear pedido desde carrito (usado en /checkout del router orders)
const createFromCart = async (userId, cart) => {
  const shapedCart = shapeCart(cart);

  const order = await Order.create({
    code: `ORD-${Date.now()}`,
    user: userId,
    items: shapedCart.items.map((it) => ({
      product: it.productId,
      name: it.name,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
      picked: false,
    })),
    subtotal: shapedCart.subtotal,
    shipping: shapedCart.shipping,
    total: shapedCart.total,
    status: "pending",
  });

  // descontar stock
  for (const item of shapedCart.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  return shapeOrder(order);
};

// ------------------------ Exports ------------------------
module.exports = {
  getCart,
  addItem,
  checkout,
  listOrders,
  updateOrderStatus,
  updateItemPicked,
  getUserOrders,
  getOrder,
  updateStatus: updateOrderStatus, // alias
  createFromCart,
};
