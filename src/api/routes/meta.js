const express = require("express");
const Product = require("../models/Product");
const Element = require("../models/Element");

const metaRouter = express.Router();

// Obtener enums de Productos
metaRouter.get("/products/options", (req, res) => {
  try {
    const schema = Product.schema;

    const styleOptions = schema.path("style").enumValues;
    const categoryOptions = schema.path("category").enumValues;
    const materialOptions = schema.path("material").enumValues;
    const colorOptions = schema.path("colors").caster?.path("name")?.enumValues || [];

    res.json({
      styleOptions,
      categoryOptions,
      materialOptions,
      colorOptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener opciones de producto" });
  }
});

// Obtener enums de Elements
metaRouter.get("/elements/options", (req, res) => {
  try {
    const schema = Element.schema;

    const styleOptions = schema.path("style").enumValues;
    const materialOptions = schema.path("material").enumValues;
    const colorOptions = schema.path("color").enumValues;
    const typeOptions = schema.path("type").enumValues;
    const extIntOptions = schema.path("extInt").enumValues;

    res.json({
      styleOptions,
      materialOptions,
      colorOptions,
      typeOptions,
      extIntOptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener opciones de elementos" });
  }
});

module.exports = metaRouter;
