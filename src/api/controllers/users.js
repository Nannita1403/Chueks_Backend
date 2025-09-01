
const { sendEmail } = require("../../config/nodemailer");
const { generateKey } = require("../../utils/jwt");
const { verifyEmail } = require("../../utils/validations/email");
const User = require("../models/users");
const bcrypt = require("bcrypt")

const register = async (req, res, next) => {
    try {

       const { name, password, telephone, email } = req.body;
       if (!verifyEmail(email)) {
        return res.status(400).json("Introduce un email válido");
       };
       
       const newUser = new User ({name, password, telephone, email});
       
       await newUser.save();

       sendEmail(name, email, newUser._id.toString(), password, telephone);

       return res.status(201).json("Cuenta de Usuario creada");
    } catch (error) {
      console.log(error);
        return res.status(400).json("Error");
    }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔍 Buscando usuario con email:", email);
    const user = await User.findOne({ email });
    console.log("👤 Usuario encontrado:", user ? "SÍ" : "NO");
    
    if (!user) {
      return res.status(400).json("El usuario o la contraseña son incorrectos");
    }

    console.log("📧 Email en BD:", user.email);
    console.log("🔒 Password hasheado en BD:", user.password);
    console.log("✅ Verificado:", user.verified);

    const isValidPassword = bcrypt.compareSync(password, user.password);
    console.log("🔑 Password válido:", isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json("El usuario o la contraseña son incorrectos");
    }

    // Generar token JWT
    const token = generateKey(user._id.toString());

    return res.status(200).json({
  message: "Login exitoso",
  token,
  user: {
    id: user._id,
    email: user.email,
    name: user.name,
    rol: user.rol,  
  },
});
  } catch (error) {
    console.log("❌ Error en login:", error);
    return res.status(500).json("Error en realizar el Login");
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    req.body = user;

    const token = generateKey(id, "1h");
    return res.status(200).json({message:"Verified", user, token });
  } catch (error) {
    return res.status(400).json("Error al verificar la cuenta");
  }
};

const checkSession = async (req, res, next) => {
  return res
    .status(200)
    .json({ user: req.user, token: req.headers.authorization });
};

/** PATCH /api/users/update */
const updateProfile = async (req, res) => {
  try {
    const { name, telephone, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, telephone, address },
      { new: true }
    ).select("-password"); // no devolvemos password

    return res.status(200).json({ message: "Perfil actualizado", user: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar perfil");
  }
};

/** PATCH /api/users/password */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Usuario no encontrado");

    const valid = bcrypt.compareSync(oldPassword, user.password);
    if (!valid) return res.status(400).json("La contraseña actual no es correcta");

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al cambiar contraseña");
  }
};

module.exports = {register, verifyAccount, login, checkSession, updateProfile, changePassword};

