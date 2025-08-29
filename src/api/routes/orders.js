const { isAuth } = require("../../middelwares/isAuth");
const { isAdmin } = require("../../middelwares/isAdmin");
const { listOrders, getOrder, updateStatus } = require("../controllers/orders");

const ordersRouter = require("express").Router();

// Admin
ordersRouter.use(isAuth, isAdmin);
ordersRouter.get("/", listOrders);                         // ?status=all|pending|processing|completed&q=...
ordersRouter.get("/:idOrCode", getOrder);
ordersRouter.patch("/:idOrCode/status", updateStatus);

module.exports = ordersRouter;
