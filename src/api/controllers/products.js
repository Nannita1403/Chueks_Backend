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
        return res.status(400).json("Error al subir el Producto");
    }
};

module.exports = { createProduct }