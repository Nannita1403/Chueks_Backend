const express = require("express");
const ordersRouter = express.Router();
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");

const {
  checkout,
  getUserOrders,
  listOrders,
  getOrder,
  updateOrderStatus,
  updateItemPicked,
} = require("../controllers/orders");

/* ------------------------ Rutas de Usuario ------------------------ */

// Mis pedidos
ordersRouter.get("/my-orders", isAuth, getUserOrders);

// Checkout desde carrito
ordersRouter.post("/checkout", isAuth, checkout);

/* ------------------------ Rutas de Admin ------------------------ */
ordersRouter.use(isAuth, isAdmin);

// Listar pedidos
ordersRouter.get("/", listOrders);

// Obtener pedido por id o código
ordersRouter.get("/:idOrCode", getOrder);

// Actualizar estado del pedido
ordersRouter.patch("/:idOrCode/status", updateOrderStatus);

// Marcar ítem como armado (picked)
ordersRouter.patch("/:orderId/items/:idx/picked", updateItemPicked);

module.exports = ordersRouter;
