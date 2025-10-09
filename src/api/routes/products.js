const { isAdmin } = require("../../middelwares/isAdmin");
const { isAuth } = require("../../middelwares/isAuth");
const { uploadProducts } = require("../../middelwares/upload");
const { getAdminDashboard } = require("../controllers/adminDashboard"); 
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  toggleLike,
  getCategories,
} = require("../controllers/products");

const productsRouter = require("express").Router();

productsRouter.post(
  "/",
  isAuth,
  isAdmin,
  uploadProducts.fields([
    { name: "imgPrimary", maxCount: 1 },
    { name: "imgSecondary", maxCount: 1 },
  ]),
  createProduct
);

productsRouter.get("/", isAuth, getProducts);
productsRouter.get("/categories", isAuth, getCategories);
productsRouter.get("/dashboard", isAdmin, getAdminDashboard); 
productsRouter.get("/:id", isAuth, getProduct);

productsRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  uploadProducts.fields([
    { name: "imgPrimary", maxCount: 1 },
    { name: "imgSecondary", maxCount: 1 },
  ]),
  updateProduct
);

productsRouter.put("/toggleLike/:id/:addLike", isAuth, toggleLike);
productsRouter.delete("/:id", isAuth, isAdmin, deleteProduct);

module.exports = productsRouter;
