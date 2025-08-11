
const { sendEmail } = require("../../config/nodemailer");
const { generateKey } = require("../../utils/jwt");
const { verifyEmail } = require("../../utils/validations/email");
const User = require("../models/users");
const bcrypt = require("bcrypt")

const register = async (req, res, next) => {
    try {

       const { name, password, telephone, email } = req.body;

       //const userDuplicated = await User.findOne({email});
       //if (userDuplicated) {
       // return res.status(400).json("Usuario ya registrado");
      // }

       if (!verifyEmail(email)) {
        return res.status(400).json("Introduce un email válido");
       };
       
       const newUser = new User ({name, password, telephone, email});
       
       await newUser.save();

       sendEmail(email, name, newUser._id.toString(), password);

       return res.status(201).json("Cuenta de Usuario creada");

    } catch (error) {
      console.log(error);
      
        return res.status(400).json("Error");
        
    }
};

const login = async (req, res, next) => {
try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    if (!user) {
        return res.status(400).json("El usuario o la contraseña son incorrectos")
    }

    const id= user._id.toString();
    
    if (!user.verified){
        sendEmail(email, user.name, id);
        return res.status(400).json("Verifica tu correo, para continuar");
    }

    if (bcrypt.compareSync(password, user.password)) {
        const token = generateKey(id);
        return res.status(200).json({message:"Te has Logueado", token, user})
    } else {
        return res.status(400).json("El usuario o la contraseña son incorrectos")
    }
} catch (error) {
  console.log(error);
  
    return res.status(400).json("Error en realizar el Login")
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

module.exports = {register, verifyAccount, login, checkSession};

