const { sendEmail } = require("../../config/nodemailer");
const { generateKey } = require("../../utils/jwt");
const { verifyEmail } = require("../../utils/validations/email");
const User = require("../models/users");
const bcrypt = require("bcrypt");

// ========== AUTENTICACIÓN ==========
const register = async (req, res) => {
  try {
    const { name, password, telephone, email } = req.body;
    if (!verifyEmail(email)) {
      return res.status(400).json("Introduce un email válido");
    }

    const newUser = new User({ name, password, telephone, email });
    await newUser.save();

    sendEmail(name, email, newUser._id.toString(), password, telephone);

    return res.status(201).json("Cuenta de Usuario creada");
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("El usuario o la contraseña son incorrectos");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("El usuario o la contraseña son incorrectos");
    }

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

const verifyAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    const token = generateKey(id, "1h");
    return res.status(200).json({ message: "Verified", user, token });
  } catch (error) {
    return res.status(400).json("Error al verificar la cuenta");
  }
};

const checkSession = async (req, res) => {
  return res.status(200).json({ user: req.user, token: req.headers.authorization });
};

// ========== PERFIL ==========
const updateProfile = async (req, res) => {
  try {
    const { name, telephone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, telephone },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Perfil actualizado", user: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar perfil");
  }
};

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

// ========== CRUD ADDRESSES ==========
const addAddress = async (req, res) => {
  try {
    const { street, city, zip, country } = req.body;
    const user = await User.findById(req.user._id);

    user.addresses.push({ street, city, zip, country });
    await user.save();

    return res.status(201).json({ message: "Dirección añadida", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al añadir dirección");
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, zip, country } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(id);
    if (!address) return res.status(404).json("Dirección no encontrada");

    address.street = street || address.street;
    address.city = city || address.city;
    address.zip = zip || address.zip;
    address.country = country || address.country;

    await user.save();
    return res.status(200).json({ message: "Dirección actualizada", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar dirección");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    user.addresses.id(id).remove();
    await user.save();

    return res.status(200).json({ message: "Dirección eliminada", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al eliminar dirección");
  }
};

// ========== CRUD PHONES ==========
const addPhone = async (req, res) => {
  try {
    const { number, type } = req.body;
    const user = await User.findById(req.user._id);

    user.phones.push({ number, type });
    await user.save();

    return res.status(201).json({ message: "Teléfono añadido", phones: user.phones });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al añadir teléfono");
  }
};

const updatePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, type } = req.body;

    const user = await User.findById(req.user._id);
    const phone = user.phones.id(id);
    if (!phone) return res.status(404).json("Teléfono no encontrado");

    phone.number = number || phone.number;
    phone.type = type || phone.type;

    await user.save();
    return res.status(200).json({ message: "Teléfono actualizado", phones: user.phones });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar teléfono");
  }
};

const deletePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    user.phones.id(id).remove();
    await user.save();

    return res.status(200).json({ message: "Teléfono eliminado", phones: user.phones });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al eliminar teléfono");
  }
};

module.exports = {
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
};
