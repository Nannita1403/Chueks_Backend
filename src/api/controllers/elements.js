const mongoose = require("mongoose");
const Element = require("../models/elements");
const { deleteFile } = require("../../utils/deleteImg");


const getElements = async (req, res, next) => {
    try {
        const elements = await Element.find();
        return res.status(200).json(elements);
    } catch (error) {
        return res.status(400).json("Error al encontrar todos los Elementos");
    }
};

const getElement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const element = await Element.findById(id);
        return res.status(200).json(element);
    } catch (error) {
        return res.status(400).json("Error al encontrar el Elemento buscado por Id");
    }
};

const getElementOptions = async (req, res) => {
  try {
    const enums = {
      type: ["cierre","correa", "manija", "forro", "bolsillo", "confección", "chapa"],
      color: ["lila", "verde", "animal print", "suela", "nude", "blanca", "rose gold", "negro", "glitter dorada", "dorada", "borgoña", "habano", "cobre", "peltre", "crema", "celeste", "plateada", "Vison", "verde oliva", "cristal", "metal"],
      material: ["cuero", "tela Andorra", "símil cuero", "sublimado", "sublimado CHUEKS", "metal", "metálico", "resina", "plástico", "tela", "hebilla", "puffer","bajo relieve", "imán","tafeta negra", "grabado laser", "símil cuero rígido", "neoprene", "nylon", "tela sublimada", "acolchado"],
      style: ["impermiable", "puffer", "glitter", "opaca", "croco", "plástico", "liso", "flexible","símil cuero", "diente de perro", "puffer metalizado", "corta", "solapa", "fija", "grabado laser", "larga", "regulable", "desmontable","intercambiable", "metálico", "sublimado", "plástica frontal", "resina frontal", "rígido", "neoprene"],
      extInt: ["interno", "externo"]
    };
    res.status(200).json(enums);
  } catch (err) {
    res.status(400).json("Error al cargar opciones");
  }
};

const createElement = async (req, res, next) => {
    try {
        const newElement = new Element (req.body);

        const elementDuplicated = await Element.findOne({ name: req.body.name });
        if (elementDuplicated) {
            return res.status(400).json("Este elemento ya lo has creado");
        }

        if(req.file){
            newElement.logo = req.file.path;
        }
        const element = await newElement.save();
        return res
        .status(201)
        .json({ message: "Elemento subido correctamente", element});
    } catch (error) {
        console.log(error);
        
        return res.status(400).json("Error al subir el Elemento");
    }
};

    const updateElement = async (req, res) => {
    try {
        const { id } = req.params;

        const elementDuplicated = await Element.findOne({
        name: req.body.name,
        _id: { $ne: id }
        });

        if (elementDuplicated) {
        return res.status(400).json("Este elemento ya lo has creado");
        }

        if (req.file) req.body.logo = req.file.path;

        const toArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [value];
        }
        };

        const updateData = {
        name: req.body.name,
        logo: req.body.logo,
        type: toArray(req.body.type),
        style: toArray(req.body.style),
        material: toArray(req.body.material),
        color: toArray(req.body.color),
        extInt: toArray(req.body.extInt),
        };

        const element = await Element.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ message: "Elemento modificado correctamente", element });
    } catch (error) {
        console.error(error);
        return res.status(400).json("Error al actualizar el elemento");
    }
    };


    const deleteElement = async (req, res, next) => {
        try {
            const { id } = req.params;
            const element = await Element.findByIdAndDelete(id);
            deleteFile(element.logo);
            return res
            .status(200)
            .json({ message: "Elemento eliminado correctamente", element});        
        } catch (error) {
            return res.status(400).json("error");
        }
    };

    module.exports = {
        getElement,
        getElements,
        getElementOptions,
        createElement,
        updateElement,
        deleteElement
    }