const Cart = require("../models/cart");
const Product = require("../models/products");

// helper para obtener/crear carrito del usuario
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
};

// Agregar producto (o sumar unidades si ya existe)
exports.addItem = async (req, res) => {
  const { productId, quantity = 1, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    it => String(it.product) === String(productId) && it.color === color
  );

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      color,
      price: product.price, // snapshot
      quantity: Number(quantity),
    });
  }

  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
};

// Cambiar cantidad (+1 o -1)
exports.patchQty = async (req, res) => {
  const { id } = req.params; // id del item o productId (usamos productId para simplicidad)
  const { delta = 0, color } = req.body;

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find(
    it => String(it.product) === String(id) && (color ? it.color === color : true)
  );
  if (!item) return res.status(404).json({ message: "Item no encontrado" });

  item.quantity = Math.max(1, item.quantity + Number(delta));
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
};

// Eliminar un item
exports.removeItem = async (req, res) => {
  const { id } = req.params; // productId
  const { color } = req.query;

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter(
    it => !(String(it.product) === String(id) && (color ? it.color === color : true))
  );

  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
};

// Inyecta req.cart (útil para middlewares como checkMinItems)
exports.attachCart = async (req, _res, next) => {
  req.cart = await getOrCreateCart(req.user._id);
  next();
};

// Checkout dummy (solo valida mínimo)
exports.checkout = async (req, res) => {
  // aquí crearías la orden, integras pago, etc.
  res.json({ ok: true, redirectUrl: "/order/confirm" });
};
