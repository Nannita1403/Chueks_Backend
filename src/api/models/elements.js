const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },

  type: {
    type: [String],
    enum: ["cierre", "correa", "manija", "forro", "bolsillo", "confección", "chapa"],
    default: []
  },

  logo: { type: String, required: true },

  color: {
    type: [String],
    enum: [
      "lila", "verde", "animal print", "suela", "nude", "blanca",
      "rose gold", "negro", "glitter dorada", "dorada", "borgoña",
      "habano", "cobre", "peltre", "crema", "celeste", "plateada",
      "Vison", "verde oliva", "cristal", "metal"
    ],
    default: []
  },

  material: {
    type: [String],
    enum: [
      "cuero", "tela Andorra", "símil cuero", "sublimado", "sublimado CHUEKS", "metal",
      "metálico", "resina", "plástico", "tela", "hebilla", "puffer", "bajo relieve",
      "imán", "tafeta negra", "grabado laser", "símil cuero rígido",
      "neoprene", "nylon", "tela sublimada", "acolchado"
    ],
    default: []
  },

  style: {
    type: [String],
    enum: [
      "impermiable", "puffer", "glitter", "opaca", "croco", "plástico", "liso", "flexible", "símil cuero",
      "diente de perro", "puffer metalizado", "corta", "solapa", "fija", "grabado laser",
      "larga", "regulable", "desmontable", "intercambiable", "metálico", "sublimado",
      "plástica frontal", "resina frontal", "rígido", "neoprene"
    ],
    default: []
  },

  extInt: {
    type: [String],
    enum: ["interno", "externo"],
    default: []
  }
});

const Element = mongoose.model("elements", elementSchema, "elements");

module.exports = Element;
