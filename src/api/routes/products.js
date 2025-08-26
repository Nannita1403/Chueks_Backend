const { isAdmin } = require("../../middelwares/isAdmin");
const { isAuth } = require("../../middelwares/isAuth");
const { uploadProducts } = require("../../middelwares/upload");
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  deleteProduct, 
  updateProduct, 
  toggleLike 
} = require("../controllers/products");

const productsRouter = require("express").Router();

productsRouter.post(
  "/", 
  isAuth, 
  isAdmin, 
  uploadProducts.fields([
    { name: "imgPrimary", maxCount: 1 },
    { name: "imgSecondary", maxCount: 1 }
  ]),
  createProduct
);

productsRouter.get("/", isAuth, getProducts);
productsRouter.get("/:id", isAuth, getProduct);
productsRouter.put(
  "/:id",
  isAuth, 
  isAdmin, 
  uploadProducts.fields([
    { name: "imgPrimary", maxCount: 1 },
    { name: "imgSecondary", maxCount: 1 }
  ]),
  updateProduct
);

// ✅ Toggle like
productsRouter.put("/toggleLike/:id/:addLike", isAuth, toggleLike);

productsRouter.delete("/:id", isAuth, isAdmin, deleteProduct);

module.exports = productsRouter;
