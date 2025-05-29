const elementsRouter = require("./elements");
const usersRouter = require("./users");

const mainRouter = require ("express").Router();


mainRouter.use("/elements", elementsRouter);
mainRouter.use("/users", usersRouter);



module.exports = mainRouter;