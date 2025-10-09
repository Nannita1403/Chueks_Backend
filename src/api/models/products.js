const mongoose = require("mongoose");

// 🟡 Mapa de colores HEX
const COLOR_HEX_MAP = {
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
};

const productSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  style: [{
    type: String,
    required: true,
    enum: [
      "Urbana", "Fiesta", "Noche", "Casual", "Diario", "Ejecutivo", "Trabajo", "Viaje", "Playa", "Deporte"
    ]
  }],
  description: { type: String, required: true },
  priceMin: { type: Number, required: true },
  priceMay: { type: Number, required: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  elements: [{
    quantity: { type: String },
    element: { type: mongoose.Types.ObjectId, ref: "elements" },
  }],
  category: [{
    type: String,
    enum: [
      "Tarjetero", "Cartera", "Tote", "Clutch", "Mochila", "Bolso", "ShoulderBag/Hombro",
      "Mini Bag", "Crossbody/Bandolera", "Clutch/Sobre", "Riñonera", "Matera", "Billetera",
      "Accesorios", "Neceser", "Viaje", "Aros", "Joyeria", "Collares", "Anteojos", "Pulseras",
      "Pañuelos", "Dijes", "Anillos", "LLaveros"
    ]
  }],
  material: [{
    type: String,
    enum: [
      "cuero", "tela Andorra", "simil cuero", "símil cuero", "sublimado CHUEKS", "tela puffer",
      "cinta sublimada", "metálico", "resina", "plastico", "tela", "iman", "tafeta negra",
      "grabado laser", "simil cuero rigido", "neoprene", "nylon", "sublimda", "tela impermeable"
    ]
  }],
  colors: [{
    name: {
      type: String,
      required: true,
      enum: Object.keys(COLOR_HEX_MAP)
    },
    stock: { type: Number, default: 0 },
    hex: { type: String, default: "#cccccc" }
  }],
  height: { type: Number },
  width: { type: Number },
  depth: { type: Number },
  imgPrimary: { type: String },
  imgSecondary: { type: String },
});

// Middleware para asignar hex automáticamente según el name
productSchema.pre("save", function (next) {
  if (Array.isArray(this.colors)) {
    this.colors = this.colors.map(color => {
      const hexValue = COLOR_HEX_MAP[color.name?.toLowerCase()] || "#cccccc";
      return { ...color, hex: hexValue };
    });
  }
  next();
});

const Product = mongoose.model("products", productSchema, "products");
module.exports = Product;
