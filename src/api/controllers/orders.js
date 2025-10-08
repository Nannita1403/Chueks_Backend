const Order = require("../models/order");
const Product = require("../models/products");
const Cart = require("../models/cart");

const shapeCart = require("../../utils/shapeCart.js");
const shapeOrder = require("../../utils/shapeOrder.js");
const canonColor = require("../../utils/canonColor.js");

// 🔹 Agrupa items (para checkout)
function groupItemsByCodeAndColor(items) {
  const grouped = {};
  for (const it of items) {
    const code = it.code ?? "—";
    const color = canonColor(it.color ?? "—");
    const key = `${code}_${color}`;

    if (!grouped[key]) {
      grouped[key] = {
        product: it.productId,
        code,
        name: it.name,
        color,
        price: it.price ?? 0,
        quantity: 0,
        picked: false,
      };
    }
    grouped[key].quantity += it.quantity;
  }
  return Object.values(grouped);
}

// 🔹 POST /checkout
const checkout = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(400).json({ message: "Carrito vacío" });

   const missingFields = [];
    if (!user.addresses || user.addresses.length === 0) missingFields.push("dirección");
    if (!user.phones || user.phones.length === 0) missingFields.push("teléfono");
    if (missingFields.length) {
      return res.status(400).json({
        message: `Debes agregar ${missingFields.join(" y ")} antes de realizar un pedido.`,
      });
    }

    const shapedCart = shapeCart(cart);

    if (shapedCart.itemCount < shapedCart.minItems) {
      return res.status(400).json({
        message: `Debes agregar al menos ${shapedCart.minItems} productos.`,
      });
    }

    // Validar stock
    const groupedItems = groupItemsByCodeAndColor(shapedCart.items);
    for (const item of groupedItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Producto ${item.name} no encontrado.` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `No hay suficiente stock para ${item.name}.` });
    }

    // Crear orden
    const order = await Order.create({
      code: `ORD-${Date.now()}`,
      user: userId,
      items: groupedItems,
      subtotal: shapedCart.subtotal,
      shipping: shapedCart.shipping,
      total: shapedCart.total,
      status: "pending",
    });

    // Descontar stock
    for (const item of groupedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    res.status(200).json({ ok: true, order: shapeOrder(order) });
  } catch (err) {
    res.status(500).json({ message: "Error procesando el pedido" });
  }
};

// 🔹 GET /orders/mine
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product");
    res.status(200).json({ orders: orders.map((o) => shapeOrder(o)) });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo pedidos" });
  }
};

// 🔹 GET /orders/:idOrCode
const getOrder = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const order = /^[0-9a-fA-F]{24}$/.test(idOrCode)
      ? await Order.findById(idOrCode).populate("user").populate("items.product")
      : await Order.findOne({ code: idOrCode }).populate("user").populate("items.product");

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    res.status(200).json(shapeOrder(order));
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo pedido" });
  }
};

// 🔹 GET /orders?status=
const listOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error al listar pedidos" });
  }
};

// 🔹 PATCH /orders/:idOrCode/status
const updateOrderStatus = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const { status } = req.body;
    const allowed = ["pending", "processing", "paid", "shipped", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Estado inválido" });

    const order = /^[0-9a-fA-F]{24}$/.test(idOrCode)
      ? await Order.findById(idOrCode)
      : await Order.findOne({ code: idOrCode });

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    // Devolver stock si se cancela
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    order.status = status;
    await order.save();
    res.status(200).json({ ok: true, order: shapeOrder(order) });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando estado" });
  }
};

// 🔹 PATCH /orders/:orderId/items/:idx/picked
const updateItemPicked = async (req, res) => {
  try {
    const { orderId, idx } = req.params;
    const { picked } = req.body;

    const order = /^[0-9a-fA-F]{24}$/.test(orderId)
      ? await Order.findById(orderId)
      : await Order.findOne({ code: orderId });

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (!order.items[idx]) return res.status(404).json({ message: "Ítem no encontrado" });

    order.items[idx].picked = picked;
    await order.save();
    res.status(200).json({ ok: true, item: order.items[idx] });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando ítem" });
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getOrder,
  listOrders,
  updateOrderStatus,
  updateItemPicked,
};
