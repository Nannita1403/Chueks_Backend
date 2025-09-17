const express = require("express");
const cartRouter = express.Router();
const { isAuth } = require("../../middelwares/isAuth");
const {
  getCart,
  addItem,
  patchQtyByLine,
  removeItemByLine,
  patchQty,
  removeItem,
  checkout,
} = require("../controllers/cart");

// 🔹 Log simple
cartRouter.use((req, _res, next) => {
  console.log("[CART]", req.method, req.originalUrl);
  next();
});

// 🔹 Todas las rutas requieren auth
cartRouter.use(isAuth);

// ⚡ Acciones por línea de carrito
cartRouter.patch("/line/:lineId", patchQtyByLine);
cartRouter.delete("/line/:lineId", removeItemByLine);

// ⚡ Acciones generales
cartRouter.get("/", getCart);
cartRouter.post("/add", addItem);
cartRouter.patch("/:productId", patchQty);
cartRouter.delete("/:productId", removeItem);

// ⚡ Checkout
cartRouter.post("/checkout", checkout);

module.exports = cartRouter;
