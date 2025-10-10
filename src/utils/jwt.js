const jwt = require("jsonwebtoken")

const generateKey = (id, expiresIn = "1y") => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:expiresIn});
};

const verifyKey = (token) => {
  try {
    console.log("token recibido:", token);
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("❌ Token inválido:", err.message);
    return null;
  }
};

module.exports = {generateKey, verifyKey}; 