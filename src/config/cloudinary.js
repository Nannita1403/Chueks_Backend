const cloudinary = require("cloudinary").v2;


const connectCloudinary = () => {
    try {
     cloudinary.config({});
     console.log("Conectados a Cloudinary");
    } catch (error) {
        console.log("Error en la conexion con Cloudinary");   
    }
};

module.exports = {connectCloudinary};