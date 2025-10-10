
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/api/models/products.js");

const COLOR_NAME_MAP = {
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
  "gris claro": "#cccccc",
};

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:root@cluster0.n0lrwms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function updateHexColorsFromNames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const products = await Product.find({});
    let updatedCount = 0;
    for (const product of products) {
      if (!Array.isArray(product.colors) || product.colors.length === 0) continue;

      let updated = false;

      const newColors = product.colors.map(color => {
      const colorName = color.name?.toLowerCase().trim();
      const correctHex = COLOR_NAME_MAP[colorName];
        if (correctHex && color.hex !== correctHex) {
          updated = true;
          return {
            ...color,
            hex: correctHex,
          };
        }

        return color;
      });

      if (updated) {
        product.colors = newColors;
        await product.save();
        updatedCount++;
        console.log(`🔧 Actualizado: ${product.name}`);
      }
    }

    console.log(`\n✅ Total de productos actualizados: ${updatedCount}`);
  } catch (err) {
    console.error("❌ Error actualizando productos:", err);
  } finally {
    await mongoose.disconnect();
    console.log("📴 Conexión cerrada");
  }
}

updateHexColorsFromNames();