const { isAdmin } = require("../../middelwares/isAdmin");
const { isAuth } = require("../../middelwares/isAuth");
const { uploadProducts } = require("../../middelwares/upload");
const { createProduct, getProducts } = require("../controllers/products");

const productsRouter = require ("express").Router();

productsRouter.post(
    "/", 
    isAuth, 
    isAdmin, 
    uploadProducts.fields([
        { name: "imgPrimary", maxCount: 1 },
        { name: "imgSecondary", maxCount: 1 }
        ]),
    createProduct);

productsRouter.get(
    "/",
    isAuth,
    getProducts);

module.exports = productsRouter;