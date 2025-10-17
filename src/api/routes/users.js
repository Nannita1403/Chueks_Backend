const { isAuth } = require("../../middlewares/isAuth");
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
  deletePhone,
  addFavorite,
  removeFavorite,
  getFavorites,
  clearFavorites,
  toggleFavorite
} = require("../controllers/users");

const usersRouter = require("express").Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/verifyaccount/:id", verifyAccount);
usersRouter.get("/checksession", isAuth, checkSession);
usersRouter.patch("/update", isAuth, updateProfile);
usersRouter.patch("/password", isAuth, changePassword);

usersRouter.post("/addresses", isAuth, addAddress);
usersRouter.put("/addresses/:id", isAuth, updateAddress);
usersRouter.delete("/addresses/:id", isAuth, deleteAddress);

usersRouter.post("/telephones", isAuth, addPhone);
usersRouter.put("/telephones/:id", isAuth, updatePhone);
usersRouter.delete("/telephones/:id", isAuth, deletePhone);

usersRouter.get("/favorites", isAuth, getFavorites);
usersRouter.post("/favorites/:productId", isAuth, addFavorite);
usersRouter.put("/favorites/:productId/toggle", isAuth, toggleFavorite);
usersRouter.delete("/favorites/:productId", isAuth, removeFavorite);
usersRouter.delete("/favorites", isAuth, clearFavorites);

module.exports = usersRouter;
