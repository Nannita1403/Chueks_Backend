// resetPasswordsCorrectly.js
const mongoose = require("mongoose");
const User = require("./src/api/models/users.js"); // Ajusta según tu ruta
require("dotenv").config(); // Si usas variables de entorno para tu URI

// 🔑 Conexión a MongoDB
const MONGO_URI = "mongodb+srv://root:root@cluster0.n0lrwms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // --- ADMIN ---
    const admin = await User.findOne({ email: "natalia@galleryproperties.es" });
    if (admin) {
      admin.password = "admin1234"; // texto plano
      await admin.save(); // pre-save hook hará bcrypt.hash automáticamente
      console.log("🔑 Admin actualizado:", admin.email, "→ admin1234");
    } else {
      console.log("⚠️ Admin no encontrado");
    }

    // --- USER ---
    const user = await User.findOne({ email: "nannimagi@gmail.com" });
    if (user) {
      user.password = "user1234"; // texto plano
      await user.save(); // pre-save hook hará bcrypt.hash automáticamente
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