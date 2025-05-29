const { verifyEmail } = require("../../utils/validations/email");
const User = require("../models/users");

const register = async (req, res, next) => {
    try {

       const { name, password, telephone, email } = req.body;

       const userDuplicated = await User.findOne({email});
       if (userDuplicated) {
        return res.status(400).json("Usuario ya registrado");
       }

       verifyEmail(email);

       const newUser = new User ({name, password, telephone, email});
       
       await newUser.save();
       
       return res.status(201).json("Cuenta de Usuario creada");

    } catch (error) {
        console.log(error);
        return res.status(400).json("error");
        
    }
};

module.exports = {register}

