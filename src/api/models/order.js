const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
  name: String,
  color: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true }, // ej: ORD-0001
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    items: [OrderItemSchema],
    subtotal: Number,
    shipping: { type: Number, default: 0 },
    total: Number,
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema, "orders");
