// src/api/routes/categories.js
const express = require("express");
const { isAuth } = require("../../middelwares/isAuth");
const { isAdmin } = require("../../middelwares/isAdmin");
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
