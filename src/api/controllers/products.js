const { deleteFile } = require("../../utils/deleteImg");
const Product = require("../models/products");

const createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);

        const productDuplicated = await Product.findOne({
            name: req.body.name,
        });

        if (productDuplicated) {
            return res.status(400).json("Este producto ya lo has creado");
        }

        if(req.file){
            newProduct.imgPrimary = req.file.path;
            newProduct.imgSecondary = req.file.path;

        }
        const product = await newProduct.save();
        return res
        .status(201)
        .json({ message: "Producto subido correctamente", product});
    } catch (error) {
        console.log(error);
        return res.status(400).json("Error al subir el Producto");
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate("elements.element");
        return res.status(200).json({ message: "Los productos son: ", products});
    } catch (error) {
        return res.status(400).json("Error para localizar los productos")
    }
};

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("elements.element");
        return res.status(200).json({ message: "El producto es:", product});
    } catch (error) {
        return res.status(400).json("Error para localizar el producto")
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const productDuplicated = await Product.findOne({
            name: req.body.name,
        });

        if (productDuplicated) {
            return res.status(400).json("Este producto ya lo has creado");
        }

        if(req.file){
            req.body.imgPrimary = req.file.path;
            req.body.imgSecondary = req.file.path;
        }

        const product =  await Product.findByIdAndUpdate(id, req.body);

        if (req.file) {
            if (product.imgPrimary) deleteFile(product.imgPrimary);
            if (product.imgSecondary) deleteFile(product.imgSecondary);
        }

        return res.status(200).json({ message: "Producto modificado correctamente", product});
    } catch (error) {
        return res.status(400).json("Error para localizar el producto")
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    };

        if (product.imgPrimary) deleteFile(product.imgPrimary);
        if (product.imgSecondary) deleteFile(product.imgSecondary);

        return res
        .status(200)
        .json({ message: "Producto eliminado correctamente", product});        
    } catch (error) {
        return res.status(400).json({ message: "Error eliminando producto", error});
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct};