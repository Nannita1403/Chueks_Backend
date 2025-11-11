const { deleteFile } = require("../../utils/deleteImg");
const Product = require("../models/products");
const mongoose = require("mongoose");

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [value];
  }
};

const createProduct = async (req, res, next) => {
  try {
     const existing = await Product.findOne({ name: req.body.name });
    if (existing) {
      return res.status(400).json({ message: "Este producto ya existe" });
    }

    const newProduct = new Product({
      code: req.body.code, 
      name: req.body.name,
      description: req.body.description,
      priceMin: req.body.priceMin,
      priceMay: req.body.priceMay,
      category: toArray(req.body.category),
      height: req.body.height,
      width: req.body.width,
      depth: req.body.depth,
      weith: req.body.weith,
      style: toArray(req.body.style),
      elements: toArray(req.body.elements),
      material: toArray(req.body.material),
      colors: toArray(req.body.colors),
    });

    if (req.files?.imgPrimary?.[0]) {
      newProduct.imgPrimary = req.files.imgPrimary[0].path;
    }
    if (req.files?.imgSecondary?.[0]) {
      newProduct.imgSecondary = req.files.imgSecondary[0].path;
    }

    const product = await newProduct.save();
    return res.status(201).json({ message: "Producto creado", product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error al crear el producto", error });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, style, colors, sort } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $in: toArray(category) };
    }
    if (style) {
      filter.style = { $in: toArray(style) };
    }
    if (colors) {
      filter["colors.name"] = { $in: toArray(colors) };
    }

    const sortMap = { price_asc: { priceMin: 1 }, price_desc: { priceMin: -1 } };
    const sortStage = sortMap[sort] || { _id: -1 };

    const products = await Product.find(filter)
      .collation({ locale: "es", strength: 1 })
      .sort(sortStage)
      .lean();

    return res.json({ message: "Los productos son: ", products });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error obteniendo productos" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("elements.element");
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json({ message: "El producto es:", product });
  } catch {
    return res.status(400).json({ message: "Error para localizar el producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Evita duplicados excepto si es el mismo producto
    const existing = await Product.findOne({ name: req.body.name });
    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "Ya existe otro producto con este nombre" });
    }

    const updateData = {
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      priceMin: req.body.priceMin,
      priceMay: req.body.priceMay,
      category: toArray(req.body.category),
      height: req.body.height,
      width: req.body.width,
      depth: req.body.depth,
      weith: req.body.weith,
      style: toArray(req.body.style),
      elements: toArray(req.body.elements),
      material: toArray(req.body.material),
      colors: toArray(req.body.colors),
    };

    if (req.files?.imgPrimary?.[0]) {
      updateData.imgPrimary = req.files.imgPrimary[0].path;
    }
    if (req.files?.imgSecondary?.[0]) {
      updateData.imgSecondary = req.files.imgSecondary[0].path;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    return res.json({ message: "Producto modificado correctamente", product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error al actualizar producto", error });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = Product.schema.path("category.0").enumValues;
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo categorías" });
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id, addLike } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const update =
      addLike === "true" ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };

    const updatedProduct = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });

    return res.json({ product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (product.imgPrimary) deleteFile(product.imgPrimary);
    if (product.imgSecondary) deleteFile(product.imgSecondary);

    return res.json({ message: "Producto eliminado correctamente", product });
  } catch (error) {
    return res.status(400).json({ message: "Error eliminando producto", error });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  getCategories,
  deleteProduct,
  toggleLike,
};
