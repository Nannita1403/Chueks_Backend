const mongoose = require("mongoose");
const PRODUCT_MODEL = "products"; // así registraste Product en products.js
const USER_MODEL    = "users";


const CartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: PRODUCT_MODEL, required: true },
  color:    { type: String },
  price:    { type: Number, required: true }, // snapshot del precio al momento de agregar
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: false });

const CartSchema = new mongoose.Schema(
  {
     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    items:    { type: [CartItemSchema], default: [] },
    shipping: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
