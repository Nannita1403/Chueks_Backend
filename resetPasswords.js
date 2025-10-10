const mongoose = require("mongoose");
const User = require("./src/api/models/users.js"); 
require("dotenv").config(); 

const MONGO_URI = "mongodb+srv://root:root@cluster0.n0lrwms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const admin = await User.findOne({ email: "natalia@galleryproperties.es" });
    if (admin) {
      admin.password = "admin1234"; 
      await admin.save(); 
      console.log("🔑 Admin actualizado:", admin.email, "→ admin1234");
    } else {
      console.log("⚠️ Admin no encontrado");
    }

    const user = await User.findOne({ email: "nannimagi@gmail.com" });
    if (user) {
      user.password = "user1234"; 
      await user.save(); 
      console.log("🔑 User actualizado:", user.email, "→ user1234");
    } else {
      console.log("⚠️ Usuario no encontrado");
    }

    console.log("🎉 Contraseñas reseteadas con éxito");
  } catch (err) {
    console.error("❌ Error reseteando contraseñas:", err);
  } finally {
    await mongoose.disconnect();
    console.log("📴 Conexión cerrada");
  }
}

resetPasswords();