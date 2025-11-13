const { isAdmin } = require("../../middlewares/isAdmin");
const { isAuth } = require("../../middlewares/isAuth");
const { uploadElements } = require("../../middlewares/upload");
const { 
    getElements, 
    getElement, 
    createElement,
    updateElement,
    deleteElement, 
    getElementOptions
} = require("../controllers/elements");

const elementsRouter = require ("express").Router();

elementsRouter.get("/", getElements);
elementsRouter.get("/options", getElementOptions);
elementsRouter.get("/:id", getElement);
elementsRouter.post(
    "/",
    isAuth,
    isAdmin,
    uploadElements.single("logo"),
    createElement);
    
elementsRouter.put(
    "/:id",
    isAuth, 
    isAdmin, 
    uploadElements.single("logo"),
    updateElement);

elementsRouter.delete("/:id", isAuth, isAdmin, deleteElement);



module.exports = elementsRouter;