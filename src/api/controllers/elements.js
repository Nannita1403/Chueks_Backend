const mongoose = require("mongoose");
const Element = require("../models/elements");


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

const createElement = async (req, res, next) => {
    try {
        const newElement = new Element (req.body);

        const elementDuplicated = await Element.findOne({
            name: req.body.name,
        });

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


const deleteElement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const element = await Element.findByIdAndDelete(id);
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
    createElement,
    deleteElement
}