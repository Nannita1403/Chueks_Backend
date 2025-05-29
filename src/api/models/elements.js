const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
    name: { type:String, require: true},
    type: [{
        type:String, require:true, 
        enum: [
            "correa", "forro", "bolsillo", "confección", "chapa", "cierre"],
        }],
    logo: {type:String, require:true},
    color: [{
        type: String, 
        enum: [
            "lila", "verde", "animal print", "suela", "nude", "blanca",
            "rose gold", "negro", "glitter dorada", "dorada", "borgoña",
            "habano", "cobre", "peltre", "crema", "celeste", "plateada",
            "Vison", "verde oliva", "cristal" ],
        }],
    material: [{
        type: String, 
        enum: [
            "cuero", "tela Andorra", "símil cuero", "sublimado CHUEKS", 
            "metálico", "resina", "plastico", "tela",
            "iman","tafeta negra", "grabado laser", "simil cuero rígido", 
            "neoprene", "nylon", "sublimda"],
        }],
    style: [{
        type: String, 
        enum: [
            "impermiable", "puffer", "glitter", "opaca", "croco",
            "diente de perro", "puffer metalizado", "corta",
            "larga", "regulable", "desmontable"],
        }],
    amount: { type:String, require: true},
    extInt: [{
        type: String,
         enum: ["interno", "externo" ],
        }],
});

const Element = mongoose.model("elements", elementSchema, 
    "elements");

module.exports = Element;

