const express = require("express");
const { isAuth } = require("../../middelwares/isAuth");
const { isAdmin } = require("../../middelwares/isAdmin");

const {
  getUserOrders,
  createFromCart,
  listOrders,
  getOrder,
  updateStatus,
  updateItemPicked,
} = require("../controllers/orders");

const Cart = require("../models/cart");

const ordersRouter = express.Router();

/* ------------------------ Rutas de Usuario ------------------------ */

// Mis pedidos
ordersRouter.get("/my-orders", isAuth, getUserOrders);

// Checkout desde carrito
ordersRouter.post("/checkout", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Carrito vacío" });
    }

    // Crear pedido desde helper
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

/* ------------------------ Rutas de Admin ------------------------ */
ordersRouter.use(isAuth, isAdmin);

// Listar pedidos
ordersRouter.get("/", listOrders);

// Obtener pedido por id o código
ordersRouter.get("/:idOrCode", getOrder);

// Actualizar estado del pedido
ordersRouter.patch("/:idOrCode/status", updateStatus);

// Marcar ítem como armado (picked)
ordersRouter.patch("/:orderId/items/:idx/picked", updateItemPicked);

module.exports = ordersRouter;
