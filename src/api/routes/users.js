const { register } = require("../controllers/users");

const usersRouter = require ("express").Router();

usersRouter.get("/", register);




module.exports = usersRouter;