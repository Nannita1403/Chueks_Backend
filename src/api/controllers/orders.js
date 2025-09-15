const Order = require("../models/order");
const Product = require("../models/products");
const Cart = require("../models/cart");

// ------------------------ Helpers ------------------------
const canonColor = (c) => (c ? String(c).trim().toLowerCase() : undefined);

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

// ------------------------ Controllers USER ------------------------

// 🔹 Listar pedidos del usuario logueado
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: orders.map(shapeOrder) });
  } catch (err) {
    console.error("Error en getUserOrders:", err);
    res.status(500).json({ message: "Error obteniendo tus pedidos" });
  }
};

// 🔹 Crear pedido desde carrito (checkout)
const createFromCart = async (userId, cart) => {
  // Validar stock antes de crear orden
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Producto ${item.name} no encontrado`);
    if (product.stock < item.quantity) {
      throw new Error(`No hay suficiente stock para ${item.name}`);
    }
  }

  // Crear pedido
  const order = await Order.create({
    code: `ORD-${Date.now()}`,
    user: userId,
    items: cart.items.map((it) => ({
      product: it.product,
      name: it.name || it.product?.name,
      color: canonColor(it.color),
      price: it.price,
      quantity: it.quantity,
      picked: false,
    })),
    subtotal: cart.subtotal || 0,
    shipping: cart.shipping || 0,
    total: cart.total || 0,
    status: "pending",
  });

  // Descontar stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order.populate("items.product user");
};

// ------------------------ Controllers ADMIN ------------------------

// 🔹 Listar pedidos (con filtro opcional por estado y búsqueda)
const listOrders = async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    let orders = await Order.find(filter)
      .populate("user")
      .sort({ createdAt: -1 });

    if (q) {
      const qLower = q.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.code.toLowerCase().includes(qLower) ||
          (o.user?.name || "").toLowerCase().includes(qLower)
      );
    }

    res.status(200).json({ orders: orders.map(shapeOrder) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo pedidos" });
  }
};

// 🔹 Obtener detalle de un pedido
const getOrder = async (req, res) => {
  try {
    const { idOrCode } = req.params;

    let order = await Order.findOne({ code: idOrCode }).populate(
      "items.product user"
    );
    if (!order) {
      order = await Order.findById(idOrCode).populate("items.product user");
    }

    if (!order)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.status(200).json({ order: shapeOrder(order) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo pedido" });
  }
};

// 🔹 Actualizar estado del pedido
const updateStatus = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const { status } = req.body;

    let order = await Order.findOne({ code: idOrCode });
    if (!order) {
      order = await Order.findById(idOrCode);
    }
    if (!order)
      return res.status(404).json({ message: "Pedido no encontrado" });

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

// 🔹 Marcar ítem como armado (picked)
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

// ------------------------ EXPORT ------------------------
module.exports = {
  getUserOrders,
  createFromCart,
  listOrders,
  getOrder,
  updateStatus,
  updateItemPicked,
};
