
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

const Category = mongoose.model("categories", categorySchema, "categories");
module.exports = Category;
