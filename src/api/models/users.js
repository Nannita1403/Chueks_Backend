const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type:String, required: true },
  rol: { type:String, enum: ["admin", "user"], default: "user" },
  password: { type: String, required: true },
  email: { type: String, required: true },
  verified: { type: Boolean, default:false },
  favorites: [{ type: mongoose.Types.ObjectId, ref: "products" }],

  phones: [{
    number: { type: String, required: true },
    label: { type: String, default: "personal" } // ej: personal, trabajo
  }],

  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    default: { type: Boolean, default: false }
  }]
});


userSchema.pre("save", function () {
    this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model("users", userSchema, "users");
module.exports = User;

