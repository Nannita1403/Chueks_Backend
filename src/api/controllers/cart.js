const Cart = require("../models/cart");
const Product = require("../models/products");
const Order = require("../models/order");

// ------------------------ Helpers ------------------------
const canonColor = (c) => c ? String(c).trim().toLowerCase() : undefined;

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
}

function shapeCart(cart, minItems = 10) {
  const items = (cart.items || []).map(it => {
    const p = it.product || {};
    return {
      id: it._id,
      productId: p._id || it.product,
      name: p.name || it.name || "Producto",
      price: it.price ?? p.priceMin ?? 0,
      image: p?.imgPrimary?.url || p?.image || (Array.isArray(p?.images) ? p.images[0] : ""),
      color: canonColor(it.color),
      quantity: Math.max(1, Number(it.quantity) || 1),
    };
  });

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal  = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shipping  = 0;
  const total     = subtotal + shipping;
  const missing   = Math.max(0, minItems - itemCount);

  return { items, subtotal, shipping, total, minItems, itemCount, missing };
}

// ------------------------ Controllers ------------------------

// GET carrito
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo carrito" });
  }
};

// POST añadir item
const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const color = canonColor(req.body?.color);

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (product.stock < quantity)
      return res.status(400).json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(it => String(it.product) === String(productId) && canonColor(it.color) === color);

    if (existing) {
      if ((existing.quantity + Number(quantity)) > product.stock)
        return res.status(400).json({ message: `Solo quedan ${product.stock - existing.quantity} unidades disponibles.` });
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        color,
        price: product.priceMin ?? 0,
        quantity: Math.max(1, Number(quantity)),
      });
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error añadiendo producto al carrito" });
  }
};

// PATCH cantidad por línea
const patchQtyByLine = async (req, res) => {
  try {
    const { lineId } = req.params;
    const { delta = 0 } = req.body;

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(lineId);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const newQty = Math.max(1, item.quantity + Number(delta));
    if (newQty > product.stock) return res.status(400).json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    item.quantity = newQty;
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando cantidad por línea" });
  }
};

// DELETE item por línea
const removeItemByLine = async (req, res) => {
  try {
    const { lineId } = req.params;
    const cart = await getOrCreateCart(req.user._id);

    const index = cart.items.findIndex(it => String(it._id) === lineId);
    if (index === -1) return res.status(404).json({ message: "Item no encontrado" });

    cart.items.splice(index, 1);
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto por línea" });
  }
};

// PATCH y DELETE por productId y color
const patchQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { delta = 0, color } = req.body;
    const c = canonColor(color);

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(it => String(it.product) === productId && canonColor(it.color) === c);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const newQty = Math.max(1, item.quantity + Number(delta));
    if (newQty > product.stock) return res.status(400).json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    item.quantity = newQty;
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando cantidad" });
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const color = canonColor(req.query?.color);

    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(it => !(String(it.product) === productId && canonColor(it.color) === color));

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
};

// ⚡ Checkout funcional con validación de stock y reserva
const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await getOrCreateCart(userId);
    const shapedCart = shapeCart(cart);

    if (shapedCart.itemCount < shapedCart.minItems)
      return res.status(400).json({ message: `Debes agregar al menos ${shapedCart.minItems} productos.` });

    // Validar stock
    for (const item of shapedCart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Producto ${item.name} no encontrado.` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `No hay suficiente stock para ${item.name}.` });
    }

    // Crear orden
    const order = await Order.create({
      code: `ORD-${Date.now()}`,
      user: userId,
      items: shapedCart.items.map(it => ({
        product: it.productId,
        name: it.name,
        color: it.color,
        price: it.price,
        quantity: it.quantity,
        picked: false
      })),
      subtotal: shapedCart.subtotal,
      shipping: shapedCart.shipping,
      total: shapedCart.total,
      status: "pending"
    });

    // Descontar stock
    for (const item of shapedCart.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    res.status(200).json({ ok: true, redirectUrl: `/order/confirm?orderId=${order._id}` });
  } catch (err) {
    console.error("Error en checkout:", err);
    res.status(500).json({ message: "Error procesando el pedido" });
  }
};

module.exports = {
  getCart,
  addItem,
  patchQtyByLine,
  removeItemByLine,
  patchQty,
  removeItem,
  checkout
};
