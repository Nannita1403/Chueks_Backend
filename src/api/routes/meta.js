const express = require("express");
const Product = require("../models/products");
const Element = require("../models/elements");

const metaRouter = express.Router();


metaRouter.get("/products/options", (req, res) => {
  try {
    const schema = Product.schema;

    const styleOptions    = schema.path("style")?.caster?.enumValues || [];
    const categoryOptions = schema.path("category")?.caster?.enumValues || [];
    const materialOptions = schema.path("material")?.caster?.enumValues || [];
    const colorOptions    = schema.path("colors.name")?.caster?.enumValues || [];

    res.json({ styleOptions, categoryOptions, materialOptions, colorOptions });
  } catch (err) {
    console.error("Error en /meta/products/options:", err);
    res.status(500).json({ message: "Error al obtener opciones de producto" });
  }
});

metaRouter.get("/elements/options", (req, res) => {
  try {
    const schema = Element.schema;
    const styleOptions   = schema.path("style")?.enumValues || [];
    const materialOptions= schema.path("material")?.enumValues || [];
    const colorOptions   = schema.path("color")?.enumValues || [];
    const typeOptions    = schema.path("type")?.enumValues || [];
    const extIntOptions  = schema.path("extInt")?.enumValues || [];
    res.json({ styleOptions, materialOptions, colorOptions, typeOptions, extIntOptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener opciones de elementos" });
  }
});

module.exports = metaRouter;

