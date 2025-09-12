const mongoose = require("mongoose");
const { Schema } = mongoose;

const PRODUCT_MODEL = "products";
const USER_MODEL = "users";

// Cada línea de carrito ahora tiene su propio _id
const CartItemSchema = new Schema({
  product:  { type: Schema.Types.ObjectId, ref: PRODUCT_MODEL, required: true },
  color:    { type: String },
  price:    { type: Number, required: true },
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: true });

const CartSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: USER_MODEL, unique: true, required: true },
  items:    { type: [CartItemSchema], default: [] },
  shipping: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema, "Cart");
