const { isAdmin } = require("../../middelwares/isAdmin");
const { isAuth } = require("../../middelwares/isAuth");
const { uploadProducts } = require("../../middelwares/upload");
const { createProduct } = require("../controllers/products");

const productsRouter = require ("express").Router();

productsRouter.post("/", isAuth, isAdmin, uploadProducts.single(["imgPrimary", "imgSecondary"]), createProduct);

module.exports = productsRouter;