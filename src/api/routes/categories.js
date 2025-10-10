const express = require("express");
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const categoryRouter = express.Router();

categoryRouter.get("/", isAuth, getCategories);
categoryRouter.post("/", isAuth, isAdmin, createCategory);
categoryRouter.put("/:id", isAuth, isAdmin, updateCategory);
categoryRouter.delete("/:id", isAuth, isAdmin, deleteCategory);

module.exports = categoryRouter;
