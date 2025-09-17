const canonColor = require("./canonColor.js");

function shapeCart(cart, minItems = 10) {
  const items = (cart.items || []).map((it) => {
    const p = it.product || {};
    return {
      id: it._id,
      productId: p._id || it.product,
      code: p.code ?? "",
      name: p.name || "Producto",
      price: it.price ?? p.priceMin ?? 0,
      image: p?.imgPrimary?.url || p?.image || (p?.images?.[0] ?? ""),
      color: canonColor(it.color),
      quantity: Math.max(1, Number(it.quantity) || 1),
    };
  });

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shipping = 0;

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    minItems,
    itemCount,
    missing: Math.max(0, minItems - itemCount),
  };
}

module.exports = shapeCart;
