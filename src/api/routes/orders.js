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

ordersRouter.get("/my-orders", isAuth, getUserOrders);
ordersRouter.post("/checkout", isAuth, checkout);
ordersRouter.use(isAuth, isAdmin);
ordersRouter.get("/", listOrders);
ordersRouter.get("/:idOrCode", getOrder);
ordersRouter.patch("/:idOrCode/status", updateOrderStatus);
ordersRouter.patch("/:orderId/items/:idx/picked", updateItemPicked);

module.exports = ordersRouter;
