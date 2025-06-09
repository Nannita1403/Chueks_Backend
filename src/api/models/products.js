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
    priceMin: {type: String, require:true},
    priceMay:{type: String, require:true},
    imgPrimary: {type: String, require:true},
    imgSecondary: {type: String},
    likes: [{type: mongoose.Types.ObjectId, ref: "users"}],
    elements: [
        {
            quantity:{ type: String, require:true},
            element:{ type: mongoose.Types.ObjectId, ref: "elements"},
            },
        ],
    category: [{
       type: String,
       enum: [
        "Cartera", "Tote", "Clutch", "Mochila", "Bolso", "ShoulderBag/Hombro", "Mini Bag", "Crossbody/Bandolera",
        "Clutch/Sobre", "Riñonera", "Matera", "Billetera", "Accesorios"
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
            name: [{enum: [ 
            "lila", "verde", "animal print", "suela", "nude", "blanca",
            "rose gold", "negro", "glitter dorada", "dorada", "borgoña",
            "habano", "cobre", "peltre", "crema", "celeste", "plateada",
            "Vison", "verde oliva", "cristal"]
            }],
            stock: {type: String, require: true},
        }],
    height:{type: String, require: true},
    width: {type: String, requiere: true},
    depth: {type: String, require: true},
    weith: {type: String}
});

const Product = mongoose.model("products", productSchema, 
    "products");

module.exports = Product;

