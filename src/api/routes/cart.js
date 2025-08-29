// routes/cart.js
const { isAuth } = require("../../middelwares/isAuth");
const {
  getCart,
  addItem,
  patchQty,
  removeItem,
  checkout,
  attachCart,
} = require("../controllers/cart");
const checkMinItems = require("../../middelwares/checkMinItems");

const cartRouter = require("express").Router();

cartRouter.use(isAuth, attachCart);
cartRouter.get("/", getCart);
cartRouter.post("/add", addItem);
cartRouter.patch("/:productId", patchQty);      
cartRouter.delete("/:productId", removeItem);  
cartRouter.post("/checkout", checkMinItems(10), checkout);

module.exports = cartRouter;
