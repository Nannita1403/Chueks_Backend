const cartRouter = require("./cart");
const elementsRouter = require("./elements");
const metaRouter = require("./meta");
const productsRouter = require("./products");
const usersRouter = require("./users");
const ordersRouter = require("./orders");


const mainRouter = require ("express").Router();

mainRouter.use("/cart", cartRouter); 
mainRouter.use("/elements", elementsRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/meta", metaRouter);
mainRouter.use("/orders", ordersRouter);

mainRouter.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

module.exports = mainRouter;