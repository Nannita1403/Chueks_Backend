const Order = require("../models/order");

// genera un código simple incremental (puedes mejorarlo con un contador)
async function nextCode() {
  const last = await Order.findOne().sort({ createdAt: -1 }).select("code").lean();
  const n = last?.code ? parseInt(last.code.split("-")[1], 10) + 1 : 1;
  return `ORD-${String(n).padStart(3, "0")}`;
}

exports.listOrders = async (req, res) => {
  const { status, q } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;

  // búsqueda simple por code o nombre de cliente (si populás user)
  let query = Order.find(filter).populate("user").sort({ createdAt: -1 });
  const orders = await query.lean();

  // filtrar por q en memoria si querés (o usar $regex en Mongo)
  const filtered = q
    ? orders.filter(o => o.code.includes(q) || (o.user?.name || "").toLowerCase().includes(q.toLowerCase()))
    : orders;

  res.json({ orders: filtered });
};

exports.getOrder = async (req, res) => {
  const { idOrCode } = req.params;
  const byCode = await Order.findOne({ code: idOrCode }).populate("items.product user");
  if (byCode) return res.json({ order: byCode });
  const byId = await Order.findById(idOrCode).populate("items.product user");
  if (!byId) return res.status(404).json({ message: "Orden no encontrada" });
  res.json({ order: byId });
};

exports.updateStatus = async (req, res) => {
  const { idOrCode } = req.params;
  const { status } = req.body;
  const order = (await Order.findOneAndUpdate(
    { $or: [{ code: idOrCode }, { _id: idOrCode }] },
    { $set: { status } },
    { new: true }
  ).populate("items.product user"));
  if (!order) return res.status(404).json({ message: "Orden no encontrada" });
  res.json({ order });
};

// utilidad para crear la orden desde un carrito
exports.createFromCart = async (userId, shapedCart) => {
  const code = await nextCode();
  const order = await Order.create({
    code,
    user: userId,
    items: shapedCart.items.map(it => ({
      product: it.productId,
      name: it.name,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
    })),
    subtotal: shapedCart.subtotal,
    shipping: shapedCart.shipping,
    total: shapedCart.total,
    status: "pending",
  });
  return order;
};
