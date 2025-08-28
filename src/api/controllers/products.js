const { deleteFile } = require("../../utils/deleteImg");
const Product = require("../models/products");
const mongoose = require ("mongoose");

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
const slugToEnum = {
  mochilas:  "Mochila",
  carteras:  "Cartera",
  "riñoneras":"Riñonera",
  rinoneras: "Riñonera",
  bolsos:    "Bolso",
  accesorios:"Accesorios",
  neceseres: "Neceser",
};

const getProducts = async (req, res, next) => {
    try {
    const { category, style, colors, sort } = req.query;
    const filter = {};

    // category es array en el modelo
    if (category) {
      const raw = Array.isArray(category) ? category[0] : category;
      const mapped = slugToEnum[String(raw).toLowerCase()] || raw;
      filter.category = { $in: [mapped] };
    }

    // style es array en el modelo
    if (style) {
      const arr = String(style).split(",").map(s => s.trim()).filter(Boolean);
      filter.style = { $in: arr };
    }

    // colors.name es array de strings en subdoc
    if (colors) {
      const arr = String(colors).split(",").map(s => s.trim()).filter(Boolean);
      filter["colors.name"] = { $in: arr };
    }

    const sortMap = { price_asc: { priceMin: 1 }, price_desc: { priceMin: -1 } };
    const sortStage = sortMap[sort] || { _id: -1 };

    const products = await Product
      .find(filter)
      .collation({ locale: "es", strength: 1 }) // ignora mayúsculas/acentos
      .sort(sortStage)
      .lean();

    res.json({ message: "Los productos son: ", products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error obteniendo productos" });
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

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            priceMin: req.body.priceMin,
            priceMay: req.body.priceMay,
            category: req.body.category,
            height: req.body.height,
            width: req.body.width,
            depth: req.body.depth,
            weith: req.body.weith,
            $addToSet: {
                likes: req.body.likes,
                style: toArray(req.body.style),
                elements: toArray(req.body.elements),
                material: toArray(req.body.material),
                colors: toArray(req.body.colors),
                },
            };
        
        if (req.file) {
            updateData.imgPrimary = req.file.path;
            updateData.imgSecondary = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ message: "Producto modificado correctamente", product});
    } catch (error) {
        console.log(error);
        
        return res.status(400).json("Error para localizar el producto")
    }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id, addLike } = req.params;
    const userId = req.user._id; // asumimos que isAuth agrega req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    let update;
    if (addLike === "true") {
      update = { $addToSet: { likes: userId } }; // agrega si no existe
    } else {
      update = { $pull: { likes: userId } }; // quita si existe
    }

    // ✅ Actualizar el producto y devolverlo
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      update,
      { new: true } // devuelve el documento actualizado
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ product: updatedProduct });
  } catch (err) {
    next(err);
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

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, toggleLike};