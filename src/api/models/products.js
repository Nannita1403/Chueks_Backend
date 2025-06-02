const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type:String, require: true},
    style: [{
        type:String, require:true, 
        enum: [
            "Urbana", "Fiesta/Noche", "Casual/Diario", "Ejecutivo/Trabajo", "Viaje", "Playa/Verano",
            "Deportivo"],
        }],
    description: {type: String, require:true},
    priceMin: {type: String, require:true},
    PriceMay:{type: String, require:true},
    imgPrimary: {type: String, require:true},
    imgSecondary: {type: String, require:true},
    likes: {type: Number},
    elements: [{type: mongoose.Types.ObjectId, ref: "elements"}],
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
            "cuero", "tela Andorra", "símil cuero", "sublimado CHUEKS", 
            "metálico", "resina", "plastico", "tela","iman","tafeta negra", "grabado laser", 
            "simil cuero rígido", "neoprene", "nylon", "sublimda"]
        }],
    colors: [{
            name: [{enum: [ 
            "lila", "verde", "animal print", "suela", "nude", "blanca",
            "rose gold", "negro", "glitter dorada", "dorada", "borgoña",
            "habano", "cobre", "peltre", "crema", "celeste", "plateada",
            "Vison", "verde oliva", "cristal"]
            }],
            stock: {type: Number, require: true},
        }],
    height:{type: Number, require: true},
    width: {type: Number, requiere: true},
    depth: {type: Number, require: true},
    weith: {type: Number},
    stock: { type: Number},
});

const Product = mongoose.model("products", productSchema, 
    "products");

module.exports = Product;

