const User = require("../api/models/users");
const { verifyKey } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("No estás autorizado");
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = verifyKey(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json("Token inválido");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json("Usuario no encontrado");

    user.password = undefined; // nunca enviar contraseña
    req.user = user;

    next();
  } catch (error) {
    console.error("Error en isAuth:", error.message);
    return res.status(401).json("No estás autorizado");
  }
};

module.exports = { isAuth };
