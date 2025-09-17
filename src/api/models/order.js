const mongoose = require("mongoose");
const { Schema } = mongoose;

const PRODUCT_MODEL = "products";
const USER_MODEL = "users";

// 🔹 Item de la orden
const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: PRODUCT_MODEL, required: true },
    name: { type: String, required: true },
    color: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    picked: { type: Boolean, default: false },
  },
  { _id: true } //
);

// 🔹 Esquema de Orden
const OrderSchema = new Schema(
  {
    code: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: USER_MODEL, required: true },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing","paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema, "Order");
