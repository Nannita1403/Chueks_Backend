const Category = require("../models/category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo categorías", err });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    res.status(400).json({ message: "Error creando categoría", err });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ category: updated });
  } catch (err) {
    res.status(400).json({ message: "Error actualizando categoría", err });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ category: deleted });
  } catch (err) {
    res.status(400).json({ message: "Error eliminando categoría", err });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
