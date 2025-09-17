const Cart = require("../models/cart");
const Product = require("../models/products");
const shapeCart = require("../utils/shapeCart");
const canonColor = require("../utils/canonColor");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
}

// 🔹 GET carrito
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(shapeCart(cart));
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo carrito" });
  }
};

// 🔹 POST añadir producto al carrito
const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const color = canonColor(req.body?.color);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    if (product.stock < quantity)
      return res.status(400).json({ message: `Solo quedan ${product.stock} unidades disponibles.` });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (it) => String(it.product) === String(productId) && canonColor(it.color) === color
    );

    if (existing) {
      if (existing.quantity + Number(quantity) > product.stock)
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
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
    res.status(500).json({ message: "Error añadiendo producto al carrito" });
  }
};

module.exports = { getCart, addItem };
