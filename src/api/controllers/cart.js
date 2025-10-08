// controllers/cart.js
const Cart = require("../models/cart");
const Product = require("../models/products");
const Order = require("../models/order");

const { getCheckoutData } = require("../../utils/checkout.js");
const shapeCart = require("../../utils/shapeCart.js");
const canonColor = require("../../utils/canonColor.js");

// ------------------------ Helpers ------------------------
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
}

// ------------------------ Controllers ------------------------

// 🔹 GET carrito
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo carrito" });
  }
};

// 🔹 POST añadir item
const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const color = canonColor(req.body?.color);

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    if (product.stock < quantity)
      return res.status(400).json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (it) => String(it.product) === String(productId) && canonColor(it.color) === color
    );

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

// 🔹 PATCH cantidad por línea
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

// 🔹 DELETE item por línea
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

// 🔹 PATCH cantidad por productId y color
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

// 🔹 DELETE item por productId y color
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

// 🔹 POST checkout 
const checkout = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { addressId, phoneId } = req.body;

    // Validar carrito
    const cart = await getOrCreateCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrito vacío" });
    }

    // Validar dirección y teléfono del usuario
    const address = user.addresses.id(addressId);
    const phone = user.phones.id(phoneId);

    if (!address || !phone) {
      return res.status(400).json({ message: "Debes seleccionar una dirección y un teléfono válidos." });
    }

    // Validar stock
    const shapedCart = shapeCart(cart);
    if (shapedCart.itemCount < shapedCart.minItems) {
      return res.status(400).json({ message: `Debes agregar al menos ${shapedCart.minItems} productos.` });
    }

    for (const item of shapedCart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) return res.status(404).json({ message: `Producto ${item.name} no encontrado.` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `No hay suficiente stock para ${item.name}.` });
    }

    // Crear orden
    const order = await Order.create({
      code: `ORD-${Date.now()}`,
      user: userId,
      items: shapedCart.items.map(it => ({
        product: it.product._id,
        name: it.name,
        code: it.product?.code || "",
        category: it.product?.category || "",
        color: it.color,
        price: it.price,
        quantity: it.quantity,
        picked: false,
      })),
      subtotal: shapedCart.subtotal,
      shipping: shapedCart.shipping,
      total: shapedCart.total,
      status: "pending",
      address, // se guarda como subdocumento embebido
      phone,
    });

    // Descontar stock
    for (const item of shapedCart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    res.status(200).json({ ok: true, orderId: order._id });

  } catch (err) {
    console.error("❌ Error en checkout:", err);
    res.status(500).json({ message: "Error procesando el pedido" });
  }
};


// ------------------------ Exports ------------------------
module.exports = {
  getCart,
  addItem,
  patchQtyByLine,
  removeItemByLine,
  patchQty,
  removeItem,
  checkout,
};
