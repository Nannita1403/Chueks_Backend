const Cart = require("../models/cart");
const Product = require("../models/products");

/* ------------------------ Helpers ------------------------ */
const canonColor = (c) => {
  if (!c) return undefined;
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
    const color = canonColor(it?.color);

    const id = color ? `${productId}-${color}` : `${productId}`;

    return {
      id,
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
  return cart.items.filter((it) => {
    if (String(it.product) !== pid) return false;
    const itColor = canonColor(it.color);
    if (c === undefined || c === null) return !itColor; // si no hay color, matchea solo items sin color
    return itColor === c;
  });
}

function parseLineId(lineId) {
  const raw = String(lineId || "");
  const m = /^([a-f0-9]{24})(?:[-:](.+))?$/i.exec(raw);
  if (!m) return { productId: null, color: undefined };
  const productId = m[1];
  const colorRaw = m[2];
  const color = colorRaw ? String(colorRaw).trim().toLowerCase() : undefined;
  return { productId, color };
}

/* ------------------------ Controllers ------------------------ */
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error obteniendo carrito" });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body || {};
    const color = canonColor(req.body?.color);

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existing = cart.items.find(
      (it) =>
        String(it.product) === String(productId) &&
        canonColor(it.color) === color
    );

    if (existing) {
      existing.quantity = Math.max(
        1,
        (existing.quantity || 0) + Number(quantity)
      );
    } else {
      cart.items.push({
        product: product._id,
        color,
        price: Number(product.priceMin) || 0,
        quantity: Math.max(1, Number(quantity) || 1),
      });
    }

    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error añadiendo producto al carrito" });
  }
};

const patchQty = async (req, res) => {
  try {
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
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error actualizando cantidad" });
  }
};

const patchQtyByLine = async (req, res) => {
  try {
    const { productId, color } = parseLineId(req.params.lineId);
    const { delta = 0 } = req.body || {};

    const cart = await getOrCreateCart(req.user._id);
    const matches = findMatches(cart, productId, color);
    if (matches.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    matches[0].quantity = Math.max(1, (matches[0].quantity || 0) + Number(delta));
    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error actualizando cantidad por línea" });
  }
};

// DELETE por producto (opcional color por query)
const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const color = canonColor(req.query?.color);

    const cart = await getOrCreateCart(req.user._id);

    // Encontramos los items que coinciden usando findMatches
    const matches = findMatches(cart, productId, color);
    if (matches.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    // Eliminamos los matches
    cart.items = cart.items.filter(it => !matches.includes(it));

    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error eliminando producto" });
  }
};

// DELETE por línea
const removeItemByLine = async (req, res) => {
  try {
    const { productId, color } = parseLineId(req.params.lineId);

    const cart = await getOrCreateCart(req.user._id);

    // Encontramos los items que coinciden usando findMatches
    const matches = findMatches(cart, productId, color);
    if (matches.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    // Eliminamos los matches del carrito
    cart.items = cart.items.filter(it => !matches.includes(it));

    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json(shapeCart(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error eliminando producto por línea" });
  }
};


const checkout = async (_req, res) => {
  try {
    return res.status(200).json({ ok: true, redirectUrl: "/order/confirm" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en checkout" });
  }
};

module.exports = {
  // helpers
  canonColor, getOrCreateCart, shapeCart,

  // controllers
  getCart, addItem,
  patchQty, patchQtyByLine,
  removeItem, removeItemByLine,
  checkout,
};
