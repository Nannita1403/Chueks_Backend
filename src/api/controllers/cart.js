const Cart = require("../models/cart");
const Product = require("../models/products");

/* ------------------------ Helpers ------------------------ */
const canonColor = (c) => (c ? String(c).trim().toLowerCase() : null);

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
      id: it._id.toString(),  // 🔹 Línea única para el frontend
      productId: p._id ? String(p._id) : String(it.product),
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

/* ------------------------ Controllers ------------------------ */

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
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    const cart = await getOrCreateCart(req.user._id);

    const existing = cart.items.find(
      (it) =>
        String(it.product) === String(productId) &&
        canonColor(it.color) === color
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        color: color || null,
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

    item.quantity = Math.max(1, item.quantity + Number(delta));
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

    // 🔹 Filtramos el item a eliminar
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(it => it._id.toString() !== lineId);

    if (cart.items.length === originalLength)
      return res.status(404).json({ message: "Item no encontrado" });

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto por línea" });
  }
};
// Opcional: PATCH por productId y color
const patchQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { delta = 0, color } = req.body;
    const c = canonColor(color);

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (it) =>
        String(it.product) === String(productId) && canonColor(it.color) === c
    );
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    item.quantity = Math.max(1, item.quantity + Number(delta));
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando cantidad" });
  }
};

// Opcional: DELETE por productId y color
const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const color = canonColor(req.query?.color);

    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (it) =>
        !(
          String(it.product) === String(productId) &&
          canonColor(it.color) === color
        )
    );

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
};

// Checkout simple
const checkout = async (_req, res) => {
  try {
    res.status(200).json({ ok: true, redirectUrl: "/order/confirm" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en checkout" });
  }
};

module.exports = {
  getCart,
  addItem,
  patchQtyByLine,
  removeItemByLine,
  patchQty,
  removeItem,
  checkout,
};
