const { isAuth } = require("../../middelwares/isAuth");
const { 
  register, 
  verifyAccount, 
  login, 
  checkSession, 
  updateProfile, 
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  addPhone,
  updatePhone,
  deletePhone
} = require("../controllers/users");

const usersRouter = require("express").Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/verifyaccount/:id", verifyAccount, login);
usersRouter.get("/checksession", isAuth, checkSession);
usersRouter.patch("/update", isAuth, updateProfile);
usersRouter.patch("/password", isAuth, changePassword);

// 📍 CRUD para Direcciones
usersRouter.post("/addresses", isAuth, addAddress);
usersRouter.put("/addresses/:id", isAuth, updateAddress);
usersRouter.delete("/addresses/:id", isAuth, deleteAddress);

// 📱 CRUD para Teléfonos
usersRouter.post("/phones", isAuth, addPhone);
usersRouter.put("/phones/:id", isAuth, updatePhone);
usersRouter.delete("/phones/:id", isAuth, deletePhone);

module.exports = usersRouter;
