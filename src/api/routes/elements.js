const { isAdmin } = require("../../middelwares/isAdmin");
const { isAuth } = require("../../middelwares/isAuth");
const { uploadElements } = require("../../middelwares/upload");
const { 
    getElements, 
    getElement, 
    createElement, 
    deleteElement 
} = require("../controllers/elements");

const elementsRouter = require ("express").Router();

elementsRouter.get("/", getElements);
elementsRouter.get("/:id", getElement);
elementsRouter.post(
    "/",
    isAuth,
    isAdmin,
    uploadElements.single("logo"),
    createElement);
elementsRouter.delete("/:id", isAuth, isAdmin, deleteElement);



module.exports = elementsRouter;