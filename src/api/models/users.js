const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type:String, require: true},
    rol: {type:String, enum: ["admin", "user"], default: "user"},
    password: {type: String, require: true},
    telephone: {type: String, require: true},
    email: {type: String, require: true},
    verified: {type: Boolean, default:false},
    favorites: [{type: mongoose.Types.ObjectId, ref: "products"}]
});

const User = mongoose.model("users", userSchema, 
    "users");
module.exports = User;

