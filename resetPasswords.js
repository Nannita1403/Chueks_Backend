const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 🔑 Conexión a tu MongoDB Atlas (ajusta con tu URI real)
const MONGO_URI = "mongodb+srv://root:root@cluster0.n0lrwms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// 📌 Modelo mínimo User (ajústalo si tu schema es diferente)
const User = require("./src/api/models/users.js"); 

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Generar hashes nuevos
    const adminHash = bcrypt.hashSync("admin1234", 10);
    const userHash = bcrypt.hashSync("user1234", 10);

    // Actualizar admin
    const admin = await User.findOneAndUpdate(
      { email: "natalia@galleryproperties.es" },
      { password: adminHash },
      { new: true }
    );

    // Actualizar user
    const user = await User.findOneAndUpdate(
      { email: "nannimagi@gmail.com" },
      { password: userHash },
      { new: true }
    );

    console.log("🔑 Admin actualizado:", admin?.email);
    console.log("🔑 User actualizado:", user?.email);

    console.log("🎉 Contraseñas reseteadas con éxito:");
    console.log("   ➤ Admin → admin1234");
    console.log("   ➤ User  → user1234");
  } catch (err) {
    console.error("❌ Error reseteando contraseñas:", err);
  } finally {
    await mongoose.disconnect();
    console.log("📴 Conexión cerrada");
  }
}

resetPasswords();
