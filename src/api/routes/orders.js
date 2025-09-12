const { isAuth } = require("../../middelwares/isAuth");
const { isAdmin } = require("../../middelwares/isAdmin");
const {
  listOrders,
  getOrder,
  updateStatus,
  getUserOrders,
  createFromCart,
} = require("../controllers/orders");
const Cart = require("../models/cart.js");

const ordersRouter = require("express").Router();

// 🔹 Usuario normal: mis pedidos
ordersRouter.get("/my-orders", isAuth, getUserOrders);

// 🔹 Checkout desde carrito
ordersRouter.post("/checkout", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || !cart.items.length)
      return res.status(400).json({ message: "Carrito vacío" });

    // Crear pedido usando el helper
    const order = await createFromCart(userId, cart);

    // Vaciar carrito
    cart.items = [];
    cart.subtotal = 0;
    cart.shipping = 0;
    cart.total = 0;
    await cart.save();

    return res.status(201).json({ message: "Pedido creado", order });
  } catch (err) {
    console.error("Error en checkout:", err);
    return res.status(500).json({ message: "Error al crear pedido" });
  }
});

// 🔹 Rutas de admin
ordersRouter.use(isAuth, isAdmin);
ordersRouter.get("/", listOrders);                   // listar pedidos
ordersRouter.get("/:idOrCode", getOrder);           // ver detalle de pedido
ordersRouter.patch("/:idOrCode/status", updateStatus); // actualizar estado

module.exports = ordersRouter;
