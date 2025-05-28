const mongoose = require("mongoose");

const ElementSchema = new mongoose.Schema({
    name: { type:String, require: true},
    img: {type:img, require:false},
    
})