const express = require("express");
const cartRouter = express.Router();
const { isAuth } = require("../../middlewares/isAuth");
const {
  getCart,
  addItem,
  patchQtyByLine,
  removeItemByLine,
  patchQty,
  removeItem,
  checkout,
} = require("../controllers/cart");

cartRouter.use((req, _res, next) => {
  console.log("[CART]", req.method, req.originalUrl);
  next();
});
cartRouter.use(isAuth);
cartRouter.patch("/line/:lineId", patchQtyByLine);
cartRouter.delete("/line/:lineId", removeItemByLine);
cartRouter.get("/", getCart);
cartRouter.post("/add", addItem);
cartRouter.patch("/:productId", patchQty);
cartRouter.delete("/:productId", removeItem);
cartRouter.post("/checkout", checkout);

module.exports = cartRouter;
