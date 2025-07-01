const { isAuth } = require("../../middelwares/isAuth");
const { register, verifyAccount, login, checkSession } = require("../controllers/users");

const usersRouter = require ("express").Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login)
usersRouter.get("/verifyaccount/:id", verifyAccount, login);
usersRouter.get("/checksession", isAuth, checkSession);

module.exports = usersRouter;