const { 
    getElements, 
    getElement, 
    createElement, 
    deleteElement 
} = require("../controllers/elements");

const elementsRouter = require ("express").Router();

elementsRouter.get("/", getElements);
elementsRouter.get("/:id", getElement);
elementsRouter.post("/", createElement);
elementsRouter.delete("/:id", deleteElement);



module.exports = elementsRouter;