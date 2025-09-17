const shapeOrder = (orderDoc) => {
  if (!orderDoc) return null;
  const plain = orderDoc.toObject ? orderDoc.toObject() : orderDoc;

  const grouped = {};
  for (const it of plain.items || []) {
    const p = typeof it.product === "object" ? it.product : null;
    const key = `${p?._id || it.product}_${it.color || ""}`;

    if (!grouped[key]) {
      grouped[key] = {
        productId: p?._id || it.product,
        code: p?.code || "",
        name: p?.name || it.name || "Producto",
        description: p?.description || "",
        image: p?.imgPrimary || "",
        color: it.color,
        unitPrice: it.price,
        quantity: 0,
        totalPrice: 0,
        picked: it.picked || false,
        stock: p?.stock ?? 0,
        priceMay: p?.priceMay ?? null,
        category: p?.category || null,
      };
    }
    grouped[key].quantity += it.quantity;
    grouped[key].totalPrice += it.price * it.quantity;
  }

  return { ...plain, items: Object.values(grouped) };
};

module.exports = shapeOrder;
