// controllers/cart.js
const Cart = require("../models/cart");
const Product = require("../models/products");

const MIN_ITEMS = 10;

/* ---------------- utils ---------------- */
const normColor = (c) => {
  if (c === undefined || c === null) return null;
  const s = String(c).trim();
  return s.length ? s : null;
};
const colorKey = (c) => {
  const n = normColor(c);
  return n ? n.toLowerCase() : "__no_color__";
};

// Une duplicados (mismo productId + color) sumando cantidades
function dedupeCart(cart) {
  const map = new Map();
  for (const it of cart.items || []) {
    const k = `${String(it.product)}::${colorKey(it.color)}`;
    if (!map.has(k)) {
      map.set(k, { ...it.toObject?.() ?? it });
    } else {
      const prev = map.get(k);
      prev.quantity = Math.max(1, (prev.quantity || 0) + (it.quantity || 0));
      // conservamos el price snapshot del primero
      map.set(k, prev);
    }
  }
  cart.items = Array.from(map.values());
  return cart;
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  dedupeCart(cart);
  await cart.save(); // por si unimos duplicados
  await cart.populate("items.product");
  return cart;
}

// formateo para el front (igual al que venías usando)
function shapeCart(cart, min = MIN_ITEMS) {
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
    const name = p?.name || it?.name || "Producto";
    const color = normColor(it?.color);

    return {
      id: `${productId}${color ? `:${color}` : ""}`, // (no lo usa el front ahora, pero queda)
      productId,
      name,
      price,
      image,
      color,
      quantity: Math.max(1, Number(it.quantity) || 1),
    };
  });

  const itemCount = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const subtotal = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const minItems = Number(min) || 0;
  const missing = Math.max(0, minItems - itemCount);

  return { items, subtotal, shipping, total, minItems, itemCount, missing };
}

// Garantiza que exista UNA sola línea para productId+color.
// Si hay más de una, las fusiona. Devuelve la línea (obj de mongoose).
function ensureSingleLine(cart, productId, colorRaw) {
  const pid = String(productId);
  const ck = colorKey(colorRaw);
  let matches = cart.items.filter(
    (it) => String(it.product) === pid && colorKey(it.color) === ck
  );
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    // fusionar y devolver la única
    dedupeCart(cart);
    matches = cart.items.filter(
      (it) => String(it.product) === pid && colorKey(it.color) === ck
    );
  }
  return matches[0] || null;
}

/* --------------- middlewares/controllers --------------- */

// Inyecta req.cart dedupeado
exports.attachCart = async (req, _res, next) => {
  try {
    req.cart = await getOrCreateCart(req.user._id);
    next();
  } catch (e) {
    next(e);
  }
};

// GET /cart
exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(shapeCart(cart));
};

// POST /cart/add  body: { productId, quantity=1, color? }
exports.addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  const color = normColor(req.body?.color);

  const product = await Product.findById(productId).lean();
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  const cart = await getOrCreateCart(req.user._id);

  // buscar misma combinación
  let line = ensureSingleLine(cart, productId, color);

  if (line) {
    line.quantity = Math.max(1, (line.quantity || 0) + Number(quantity));
  } else {
    cart.items.push({
      product: product._id,
      color,                               // guardamos tal cual (trimmed)
      price: Number(product.priceMin) || 0, // snapshot
      quantity: Math.max(1, Number(quantity) || 1),
    });
  }

  dedupeCart(cart);
  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
};

// PATCH /cart/:productId   body: { delta, color? }
exports.patchQty = async (req, res) => {
  const { productId } = req.params;
  const { delta = 0 } = req.body || {};
  const color = normColor(req.body?.color);

  const cart = await getOrCreateCart(req.user._id);

  let line = ensureSingleLine(cart, productId, color);
  if (!line) return res.status(404).json({ message: "Item no encontrado" });

  line.quantity = Math.max(1, (line.quantity || 0) + Number(delta));
  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
};

// DELETE /cart/:productId?color=...
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  const color = normColor(req.query?.color);

  const cart = await getOrCreateCart(req.user._id);

  if (color === null) {
    // sin color → borrar TODAS las variantes de ese producto
    cart.items = cart.items.filter((it) => String(it.product) !== String(productId));
  } else {
    const ck = colorKey(color);
    cart.items = cart.items.filter(
      (it) => !(String(it.product) === String(productId) && colorKey(it.color) === ck)
    );
  }

  dedupeCart(cart);
  await cart.save();
  await cart.populate("items.product");
  res.json(shapeCart(cart));
};

// POST /cart/checkout (usa checkMinItems antes)
exports.checkout = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const shaped = shapeCart(cart);
  if (shaped.missing > 0) {
    return res.status(400).json({
      ok: false,
      code: "MIN_ITEMS_NOT_MET",
      message: `La compra mínima es de ${shaped.minItems} productos. Te faltan ${shaped.missing}.`,
      ...shaped,
    });
  }
  // aquí crearías la orden…
  return res.json({ ok: true, redirectUrl: "/order/confirm" });
};
