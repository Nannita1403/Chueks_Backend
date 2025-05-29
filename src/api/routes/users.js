const { register } = require("../controllers/users");

const usersRouter = require ("express").Router();

usersRouter.post("/register", register);




module.exports = usersRouter;