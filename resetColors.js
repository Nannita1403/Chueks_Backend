// resetColors.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/api/models/products.js");

const COLOR_NAME_MAP = Object.entries({
  "lila": "#C8A2C8",
  "verde": "#008000",
  "animal print": "#A0522D",
  "suela": "#8B4513",
  "nude": "#E3B7A0",
  "blanca": "#FFFFFF",
  "beige": "#F5F5DC",
  "gris": "#808080",
  "negro tramado": "#2F2F2F",
  "rose gold": "#B76E79",
  "negro": "#000000",
  "glitter dorada": "#FFD700",
  "dorada": "#FFD700",
  "borgoña": "#800020",
  "naranja": "#FFA500",
  "amarillo": "#FFFF00",
  "habano": "#A0522D",
  "cobre": "#B87333",
  "peltre": "#769DA6",
  "crema": "#FFFDD0",
  "celeste": "#87CEEB",
  "plateada": "#C0C0C0",
  "rosa": "#FFC0CB",
  "rojo": "#FF0000",
  "burdeos": "#800000",
  "vison": "#C4A69F",
  "verde oliva": "#808000",
  "cristal": "#E0FFFF",
  "negro opaco": "#1C1C1C",
  "negro croco": "#1A1A1A",
  "negro con crudo": "#2E2E2E",
  "turquesa": "#40E0D0",
});

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:root@cluster0.n0lrwms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function fixMissingColorNames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      if (!Array.isArray(product.colors) || product.colors.length === 0) {
        console.log(`⚠️  Producto sin colores: ${product.name}`);
        continue;
      }

      let updated = false;
      let colorFixes = 0;

      const newColors = product.colors.map(color => {
        if (!color.hex) return color;

        const found = COLOR_NAME_MAP.find(
          ([name, hex]) => hex.toLowerCase() === color.hex.toLowerCase()
        );

        // Si encontró una coincidencia y el name no es igual → actualizar
        if (found && color.name !== found[0]) {
          updated = true;
          colorFixes++;
          return { ...color, name: found[0] };
        }

        return color;
      });

      if (updated) {
        product.colors = newColors;
        await product.save();
        console.log(`🔧 ${product.name}: ${colorFixes} color(es) corregido(s)`)
        updatedCount++;
      }
    }

    console.log(`\n✅ Total productos actualizados: ${updatedCount}`);
  } catch (err) {
    console.error("❌ Error actualizando productos:", err);
  } finally {
    await mongoose.disconnect();
    console.log("📴 Conexión cerrada");
  }
}

fixMissingColorNames();
