const { isAuth } = require("../../middelwares/isAuth");
const { register, verifyAccount, login, checkSession, updateProfile, changePassword } = require("../controllers/users");

const usersRouter = require ("express").Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login)
usersRouter.get("/verifyaccount/:id", verifyAccount, login);
usersRouter.get("/checksession", isAuth, checkSession);
usersRouter.patch("/update", isAuth, updateProfile);
usersRouter.patch("/password", isAuth, changePassword);

module.exports = usersRouter;