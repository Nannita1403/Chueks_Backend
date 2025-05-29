//nodulos de commonJS
const mongoose = require ("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Conectados a la BBDD");
        
    } catch (error) {
        console.log("No se puede conectar con la BBDD", error);
        
    }
}

module.exports = { connectDB }