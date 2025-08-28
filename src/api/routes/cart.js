const { isAuth } = require("../../middelwares/isAuth");
const { getCart, addItem, patchQty, removeItem, checkout, attachCart } = require("../controllers/cart");
const checkMinItems = require("../../middelwares/checkMinItems");

const cartRouter = require("express").Router();

cartRouter.use(isAuth);

// Obtener carrito
cartRouter.get("/", getCart);

// Agregar item
cartRouter.post("/add", addItem);

// Cambiar cantidad (+/-)
cartRouter.patch("/:id", patchQty); // body: { delta, color? }

// Eliminar item
cartRouter.delete("/:id", removeItem); // optional ?color=...

// Checkout (valida mínimo 10)
cartRouter.post("/checkout", attachCart, checkMinItems(10), checkout);

module.exports = cartRouter;
