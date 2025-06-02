const multer = require("multer");
const { CloudinaryStorage } = require ("multer-storage-cloudinary");
const cloudinary = require ("cloudinary").v2;

const storage = (subDirectory) => new CloudinaryStorage ({
    cloudinary: cloudinary,
    params: {
        folder: `Chueks/${subDirectory}`,
        allowedFormats: ["avif", "png", "jpeg", "jpg","webp"],
        transformation: [{ fetch_format: "webp", quality: "auto:good" }],
    },
});

const uploadElements = multer({storage: storage("Elementos")});
const uploadProducts = multer({storage: storage("Productos")});

module.exports = {uploadElements, uploadProducts}