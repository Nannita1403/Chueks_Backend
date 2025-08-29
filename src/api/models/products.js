const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    code: { type:String, require: true},
    name: { type:String, require: true},
    style: [{
        type:String, require:true, 
        enum: [
            "Urbana", "Fiesta", "Noche", "Casual", "Diario", "Ejecutivo", "Trabajo", "Viaje", "Playa",
            "Deporte"],
        }],
    description: {type: String, require:true},
    priceMin: {type: Number, require:true},
    priceMay:{type: Number, require:true},
    likes: [{type: mongoose.Types.ObjectId, ref: "users"}],
    elements: [
        {
            quantity:{ type: String},
            element:{ type: mongoose.Types.ObjectId, ref: "elements"},
            },
        ],
    category: [{
       type: String,
       enum: [
        "Tarjetero","Cartera", "Tote", "Clutch", "Mochila", "Bolso", "ShoulderBag/Hombro", "Mini Bag", "Crossbody/Bandolera",
        "Clutch/Sobre", "Riñonera", "Matera", "Billetera", "Accesorios", "Neceser"
       ] 
    }],
    material: [{
        type: String, 
        enum: [
            "cuero", "tela Andorra", "símil cuero", "sublimado CHUEKS", "tela puffer",
            "metálico", "resina", "plastico", "tela","iman","tafeta negra", "grabado laser", 
            "símil cuero rígido", "neoprene", "nylon", "sublimda", ""]
        }],
    colors: [{
            name: [{ type: String, required: true, enum: [ 
            "lila", "verde", "animal print", "suela", "nude", "blanca","beige",
            "rose gold", "negro", "glitter dorada", "dorada", "borgoña",
            "habano", "cobre", "peltre", "crema", "celeste", "plateada",
            "vison", "verde oliva", "cristal", "negro opaco", "negro croco", "negro con crudo"]
            }],
            stock: {type: Number, default: 0},
        }],
    height:{type: Number},
    width: {type: Number},
    depth: {type: Number},
    imgPrimary: {type: String},
    imgSecondary: {type: String}
});

const Product = mongoose.model("products", productSchema, "products");

module.exports = Product;

