const { sendEmail } = require("../../config/nodemailer.js");
const { generateKey } = require("../../utils/jwt");
const { verifyEmail } = require("../../utils/validations/email.js");
const Product = require("../models/products");
const User = require("../models/users");
const bcrypt = require("bcrypt");

  const register = async (req, res) => {
    try {
      const { name, password, telephone, email } = req.body;
      const errors = {};

      if (!name?.trim()) {
        errors.name = "El nombre es obligatorio";
      }

      if (!verifyEmail(email)) {
        errors.email = "Correo incorrecto. No tiene @";
      }

      const existing = await User.findOne({ email });
      if (existing) {
        errors.email = "El correo ya está registrado";
      }

      if (!/^\d+$/.test(telephone)) {
      errors.telephone = "Teléfono inválido. Debe tener entre 9 y 15 dígitos sin símbolos ni espacios";
      }

      if (!password || password.length < 6) {
        errors.password = "Contraseña incorrecta. Mínimo 6 caracteres";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const newUser = new User({
        name,
        password,
        email,
        telephones: telephone ? [{ number: telephone, label: "personal" }] : [],
      });

      await newUser.save();

      const emailResult = await sendEmail(name, email, newUser._id.toString());

      return res.status(201).json({
        message: emailResult.success
          ? "Cuenta creada. Por favor verifica tu correo antes de iniciar sesión."
          : "Cuenta creada, pero no se pudo enviar el correo de verificación. Contacta al soporte.",
      });
    } catch (error) {
      console.error("❌ Error en register:", error.message);
      return res.status(500).json({ message: "Error en el registro" });
    }
  };
  const login = async (req, res) => {
    try {
      console.log("📡 Body recibido en login:", req.body);
      const { email, password } = req.body;
      const errors = {};

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        errors.email = "Usuario incorrecto";
      }

      const isValidPassword = user && bcrypt.compareSync(password, user.password);
      if (user && !isValidPassword) {
        errors.password = "Contraseña incorrecta";
      }

      if (user && !user.verified) {
        return res.status(403).json({ 
          message: "Debes verificar tu correo antes de ingresar", 
          email: user.email 
        });
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
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
          verified: user.verified,
          addresses: user.addresses,
          telephones: user.telephones,
          favorites: user.favorites,
        },
      });
    } catch (error) {
      console.error("❌ Error en login:", error.message);
      return res.status(500).json({ message: "Error en realizar el Login", error: error.message });
    }
  };

const verifyAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { verified: true });
    return res.redirect("https://chueks-frontend.vercel.app/auth?verified=1");
  } catch (error) {
    console.error("❌ Error en verificación:", error);
    return res.redirect("https://chueks-frontend.vercel.app/auth?verified=0");
  }
};

const checkSession = async (req, res) => {
  return res.status(200).json({ user: req.user, token: req.headers.authorization });
};

const updateProfile = async (req, res) => {
  try {
    const { name, telephone  } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name }, 
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
    const user = await User.findById(req.user._id).select("+password");
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

const addAddress = async (req, res) => {
  console.log("req.body:", req.body)
  try {
    const { street, city, zip, country } = req.body;
        if (!street?.trim() || !city?.trim() || !zip?.trim()) {
      return res.status(400).json("Dirección incompleta");
    }
    const user = await User.findById(req.user._id).select("+password");

    const exists = user.addresses.some(a => 
      a.street === street && a.city === city && a.zip === zip
    );
    if (exists) {
      return res.status(400).json("La dirección ya existe");
    }

    user.addresses.push({ street, city, zip, country });
    await user.save();

    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(201).json({ message: "Dirección añadida", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al añadir dirección");
  }
};

const updateAddress = async (req, res) => {
  console.log("req.body:", req.body)
  try {
    const { id } = req.params;
    const { street, city, zip, country } = req.body;

    if (!street?.trim() || !city?.trim() || !zip?.trim()) {
      return res.status(400).json("Dirección incompleta");
    }

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(id);
    if (!address) return res.status(404).json("Dirección no encontrada");

    address.street = street;
    address.city = city;
    address.zip = zip;
    address.country = country;

    await user.save();
    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ message: "Dirección actualizada", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar dirección");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(id);
    if (!address) return res.status(404).json("Dirección no encontrada");

    address.remove(); 
    await user.save();

    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ message: "Dirección eliminada", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al eliminar dirección");
  }
};

const addPhone = async (req, res) => {
  console.log("req.body:", req.body)
  try {
    const { number, type } = req.body;
    if (!number?.trim()) {
    return res.status(400).json("Número de teléfono inválido");
    }

    const user = await User.findById(req.user._id);

    const exists = user.telephones.some(p => p.number === number);
    if (exists) {
      return res.status(400).json("El teléfono ya existe");
    }

    user.telephones.push({ number, type });
    await user.save();

    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(201).json({ message: "Teléfono añadido", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al añadir teléfono");
  }
};

const updatePhone = async (req, res) => {
    console.log("req.body:", req.body)
  try {
    const { id } = req.params;
    const { number, type } = req.body;

    if (!number?.trim()) {
      return res.status(400).json("Número de teléfono inválido");
    }

    const user = await User.findById(req.user._id);
    const telephone = user.telephones.id(id);
    if (!telephone) return res.status(404).json("Teléfono no encontrado");

    const exists = user.telephones.some(p => p.number === number && p._id.toString() !== id);
    if (exists) {
      return res.status(400).json("El teléfono ya existe");
    }

    telephone.number = number;
    telephone.type = type;

    await user.save();
    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ message: "Teléfono actualizado", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al actualizar teléfono");
  }
};

const deletePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const telephone = user.telephones.id(id);
    if (!telephone) return res.status(404).json("Teléfono no encontrado");

    telephone.remove();
    await user.save();

    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ message: "Teléfono eliminado", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al eliminar teléfono");
  }
};


const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (!user.favorites.map(fav => fav.toString()).includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    const safeUser = await User.findById(req.user._id).populate("favorites").select("-password");
    return res.status(200).json({ message: "Producto añadido a favoritos", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al añadir a favoritos" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();

    const safeUser = await User.findById(req.user._id).populate("favorites").select("-password");
    return res.status(200).json({ message: "Producto eliminado de favoritos", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar favorito" });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites").select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

const clearFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.favorites = [];
    await user.save();

    const safeUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ message: "Favoritos eliminados", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al limpiar favoritos" });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const favoritesStr = user.favorites.map(fav => fav.toString());

    if (favoritesStr.includes(productId)) {
      user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
      await user.save();
    } else {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      user.favorites.push(productId);
      await user.save();
    }

    const safeUser = await User.findById(req.user._id).populate("favorites").select("-password");
    return res.status(200).json({ message: "Favoritos actualizados", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar favoritos" });
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
  deletePhone,
  addFavorite,
  removeFavorite,
  getFavorites,
  clearFavorites,
  toggleFavorite 
};
