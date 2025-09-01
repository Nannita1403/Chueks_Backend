// src/api/routes/cart.js
const express = require("express");
const cartRouter = express.Router();

const { isAuth } = require("../../middelwares/isAuth");
const {
  getCart,
  addItem,
  patchQty,
  removeItem,
  checkout,
  patchQtyByLine,
  removeItemByLine,
} = require("../controllers/cart");

// 🔹 Middleware de log
cartRouter.use((req, _res, next) => {
  console.log("[CART]", req.method, req.originalUrl);
  next();
});

// 🔹 Todas las rutas requieren auth
cartRouter.use(isAuth);

// ⚠️ PRIMERO: acciones sobre líneas de carrito
cartRouter.patch("/line/:lineId", patchQtyByLine);
cartRouter.delete("/line/:lineId", removeItemByLine);

// 🔹 Resto de acciones
cartRouter.get("/", getCart);
cartRouter.post("/add", addItem);
cartRouter.patch("/:productId", patchQty);
cartRouter.delete("/:productId", removeItem);
cartRouter.post("/checkout", checkout);

module.exports = cartRouter;
