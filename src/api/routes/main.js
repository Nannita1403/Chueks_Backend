const elementsRouter = require("./elements");

const mainRouter = require ("express").Router();


mainRouter.use("/elements", elementsRouter);



module.exports = mainRouter;