const { verifyEmail } = require("../../utils/validations/email");
const User = require("../models/users");

const register = async (req, res, next) => {
    try {

       const { name, password, telephone, email } = req.body;

       const userDuplicated = await User.findOne({email});
       if (userDuplicated) {
        return res.status(400).json("Usuario ya registrado");
       }

       if (!verifyEmail(email)) {
        return res.status(400).json("Introduce un email válido");
       };
       
       const newUser = new User ({name, password, telephone, email});
       
       await newUser.save();
       return res.status(201).json("Cuenta de Usuario creada");

    } catch (error) {
        return res.status(400).json("Error");
        
    }
};

module.exports = {register}

