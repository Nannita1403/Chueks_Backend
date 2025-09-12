const Order = require("../models/order");

// genera un código simple incremental (puedes mejorarlo con un contador)
async function nextCode() {
  const last = await Order.findOne().sort({ createdAt: -1 }).select("code").lean();
  const n = last?.code ? parseInt(last.code.split("-")[1], 10) + 1 : 1;
  return `ORD-${String(n).padStart(3, "0")}`;
}

// 🔹 helper: asegura que todos los items tengan _id
function shapeOrder(order) {
  if (!order) return null;
  const plain = order.toObject ? order.toObject() : order;

  return {
    ...plain,
    items: (plain.items || []).map(it => ({
      _id: it._id || new Order()._id, // 👈 genera _id si no existe
      product: it.product,
      name: it.name,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
    })),
  };
}

// 🔹 Listado de órdenes (Admin)
exports.listOrders = async (req, res) => {
  const { status, q } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;

  const orders = await Order.find(filter).populate("user").sort({ createdAt: -1 });
  const shaped = orders.map(shapeOrder);

  const filtered = q
    ? shaped.filter(
        o =>
          o.code.includes(q) ||
          (o.user?.name || "").toLowerCase().includes(q.toLowerCase())
      )
    : shaped;

  res.json({ orders: filtered });
};

// 🔹 Obtener una orden (Admin)
exports.getOrder = async (req, res) => {
  const { idOrCode } = req.params;

  let order = await Order.findOne({ code: idOrCode }).populate("items.product user");
  if (!order) {
    order = await Order.findById(idOrCode).populate("items.product user");
  }

  if (!order) return res.status(404).json({ message: "Orden no encontrada" });

  res.json({ order: shapeOrder(order) });
};

// 🔹 Actualizar estado (Admin)
exports.updateStatus = async (req, res) => {
  const { idOrCode } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { $or: [{ code: idOrCode }, { _id: idOrCode }] },
    { $set: { status } },
    { new: true }
  ).populate("items.product user");

  if (!order) return res.status(404).json({ message: "Orden no encontrada" });

  res.json({ order: shapeOrder(order) });
};

// 🔹 Crear orden desde carrito (User)
exports.createFromCart = async (userId, shapedCart) => {
  const code = await nextCode();
  const order = await Order.create({
    code,
    user: userId,
    items: shapedCart.items.map(it => ({
      _id: it._id, // 👈 si el frontend ya manda _id lo respetamos
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

  const populated = await order.populate("items.product user");
  return shapeOrder(populated);
};

// 🔹 Listado de órdenes del usuario logueado
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders: orders.map(shapeOrder) });
  } catch (err) {
    console.error("Error en getUserOrders:", err);
    res.status(500).json({ message: "Error obteniendo tus pedidos" });
  }
};
