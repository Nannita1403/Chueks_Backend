const elementsRouter = require("./elements");
const productsRouter = require("./products");
const usersRouter = require("./users");

const mainRouter = require ("express").Router();


mainRouter.use("/elements", elementsRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/users", usersRouter);



module.exports = mainRouter;