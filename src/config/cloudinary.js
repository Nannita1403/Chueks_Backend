const cloudinary = require("cloudinary").v2;


const connectCloudinary = () => {
    try {
     cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret: process.env.API_KEY
     });
     console.log("Conectados a Cloudinary");
    } catch (error) {
        console.log("Error en la conexion con Cloudinary");   
    }
};

module.exports = {connectCloudinary};