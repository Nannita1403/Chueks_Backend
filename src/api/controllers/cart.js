
const Cart = require("../models/cart");
const Product = require("../models/products");

/* ------------------------ Helpers ------------------------ */
const canonColor = (c) => {
  if (c === undefined || c === null || c === "") return undefined;
  return String(c).trim().toLowerCase();
};

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
}

function shapeCart(cart, min = 10) {
  const items = (cart.items || []).map((it) => {
    const p = it.product || {};
    const productId = p._id ? String(p._id) : String(it.product);
    const image =
      p?.imgPrimary?.url ||
      p?.imgPrimary ||
      p?.image ||
      (Array.isArray(p?.images) ? p.images[0] : "") ||
      "";
    const price = typeof it.price === "number" ? it.price : (p?.priceMin ?? 0);
    const name  = p?.name || it?.name || "Producto";
    const color = canonColor(it?.color); // 👈 canon siempre

    // 👇 id de línea CONSISTENTE con el front (guion). NO encodees acá.
    const id = color ? `${productId}-${color}` : `${productId}`;

    return {
      id,               // 👈 AHORA es productId[-color]
      productId,
      name,
      price,
      image,
      color,
      quantity: Math.max(1, Number(it.quantity) || 1),
    };
  });

const itemCount = items.reduce((a, it) => a + (it.quantity || 0), 0);
  const subtotal  = items.reduce((a, it) => a + (it.price || 0) * (it.quantity || 0), 0);
  const shipping  = 0;
  const total     = subtotal + shipping;
  const minItems  = Number(min) || 0;
  const missing   = Math.max(0, minItems - itemCount);

  return { items, subtotal, shipping, total, minItems, itemCount, missing };
}


function findMatches(cart, productId, color) {
  const pid = String(productId);
  const c   = canonColor(color);
  const items = cart.items.filter((it) => String(it.product) === pid);
  if (c === undefined) return items; // todas variantes del producto
  return items.filter((it) => canonColor(it.color) === c);
}

// lineId puede venir "pid-color con espacios" (URL-encoded en la ruta)
function parseLineId(lineId) {
  const raw = String(lineId || "");
  // Acepta 24 hex + opcional (-|:) + resto como color
  const m = /^([a-f0-9]{24})(?:[-:](.+))?$/i.exec(raw);
  if (!m) return { productId: null, color: undefined };
  const productId = m[1];
  // OJO: Express ya decodifica %20 => espacio en req.params
  const color = canonColor(m[2]);
  return { productId, color };
}

/* ------------------------ Controllers ------------------------ */
async function getCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  res.json(shapeCart(cart));
}

// POST /cart/add  { productId, quantity=1, color? }
async function addItem(req, res) {
  const { productId, quantity = 1 } = req.body || {};
  const color = canonColor(req.body?.color);

  const product = await Product.findById(productId).lean();
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  const cart = await getOrCreateCart(req.user._id);

  const existing = cart.items.find(
    (it) => String(it.product) === String(productId) && canonColor(it.color) === color
  );

  if (existing) {
    existing.quantity = Math.max(1, (existing.quantity || 0) + Number(quantity));
  } else {
    cart.items.push({
      product: product._id,
      color,
      price: Number(product.priceMin) || 0, // snapshot
      quantity: Math.max(1, Number(quantity) || 1),
    });
  }

  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
}

// PATCH /cart/:productId  { delta, color? }  (modo viejo por productId+color)
async function patchQty(req, res) {
  const { productId } = req.params;
  const { delta = 0 } = req.body || {};
  const color = canonColor(req.body?.color);

  const cart = await getOrCreateCart(req.user._id);
  const matches = findMatches(cart, productId, color);

  if (color === undefined) {
    if (matches.length === 0) return res.status(404).json({ message: "Item no encontrado" });
    if (matches.length > 1)  return res.status(400).json({ message: "Hay varias variantes; envía color." });
    matches[0].quantity = Math.max(1, (matches[0].quantity || 0) + Number(delta));
  } else {
    if (matches.length === 0) return res.status(404).json({ message: "Item no encontrado" });
    matches[0].quantity = Math.max(1, (matches[0].quantity || 0) + Number(delta));
  }

  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
}

// ✅ PATCH /cart/line/:lineId  { delta }
async function patchQtyByLine(req, res) {
  const { productId, color } = parseLineId(req.params.lineId);
  const { delta = 0 } = req.body || {};

  const cart = await getOrCreateCart(req.user._id);
  const matches = findMatches(cart, productId, color);
  if (matches.length === 0) return res.status(404).json({ message: "Item no encontrado" });

  matches[0].quantity = Math.max(1, (matches[0].quantity || 0) + Number(delta));
  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
}

// DELETE /cart/:productId?color=...
async function removeItem(req, res) {
  const { productId } = req.params;
  const color = canonColor(req.query?.color);

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((it) => {
    const sameProduct = String(it.product) === String(productId);
    const sameColor   = color === undefined ? true : canonColor(it.color) === color;
    return !(sameProduct && sameColor);
  });

  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
}

// ✅ DELETE /cart/line/:lineId
async function removeItemByLine(req, res) {
  const { productId, color } = parseLineId(req.params.lineId);

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((it) => {
    const sameProduct = String(it.product) === String(productId);
    const sameColor   = color === undefined ? true : canonColor(it.color) === color;
    return !(sameProduct && sameColor);
  });

  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
}

// POST /cart/checkout (dummy)
async function checkout(_req, res) {
  return res.json({ ok: true, redirectUrl: "/order/confirm" });
}

module.exports = {
  // helpers
  canonColor, getOrCreateCart, shapeCart,

  // controllers
  getCart, addItem,
  patchQty, patchQtyByLine,
  removeItem, removeItemByLine,
  checkout,
};
