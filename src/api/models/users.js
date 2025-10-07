const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rol: { type: String, enum: ["admin", "user"], default: "user" },
  password: { type: String, required: true, select: false }, 
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Types.ObjectId, ref: "products" }],

  phones: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    number: { type: String, required: true },
    label: { type: String, default: "personal" }
  }],

  addresses: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    default: { type: Boolean, default: false }
  }]
});

// 🔒 Hash de contraseña solo si es nueva o modificada
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model("users", userSchema, "users");
module.exports = User;
