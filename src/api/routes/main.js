const cartRouter = require("./cart");
const elementsRouter = require("./elements");
const metaRouter = require("./meta");
const productsRouter = require("./products");
const usersRouter = require("./users");


const mainRouter = require ("express").Router();


mainRouter.use("/elements", elementsRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/meta", metaRouter);
mainRouter.use("/cart", cartRouter); 



module.exports = mainRouter;