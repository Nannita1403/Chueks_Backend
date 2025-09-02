const { isAuth } = require("../../middelwares/isAuth");
const { isAdmin } = require("../../middelwares/isAdmin");
const {
  listOrders,
  getOrder,
  updateStatus,
  getUserOrders,
} = require("../controllers/orders");

const ordersRouter = require("express").Router();

// 🔹 Rutas para usuario normal
ordersRouter.get("/my-orders", isAuth, getUserOrders);

// 🔹 Rutas de admin
ordersRouter.use(isAuth, isAdmin);
ordersRouter.get("/", listOrders);
ordersRouter.get("/:idOrCode", getOrder);
ordersRouter.patch("/:idOrCode/status", updateStatus);

module.exports = ordersRouter;
