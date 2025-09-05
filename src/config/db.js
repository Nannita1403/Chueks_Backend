const mongoose = require("mongoose");

let isConnected = null; // Cache de conexión

const connectDB = async () => {
  if (isConnected) {
    console.log("🔄 Usando conexión existente a MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ Conectado a MongoDB:", db.connection.host);
  } catch (error) {
    console.error("❌ No se puede conectar con la BBDD", error);
    throw error;
  }
};

module.exports = { connectDB };
