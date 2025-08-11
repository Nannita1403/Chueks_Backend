
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    },
});

const sendEmail = (email, name, id, token) => {
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email ,
        subject: "Verifica tu email",
        text: `Hola ${name}, por favor verifica tu cuenta de Chueks Mayorista haciendo click en el 
        siguiente enlace.`,
        html: `<h1>Verifica tu cuenta <h1><p>Hola ${name}, por favor verifica tu cuenta haciendo
        click en el siguiente enlace: </p><a href="http://localhost:3000/api/v1/users/verify/${id}">
        Verificar cuenta </a>`, 
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error) {
            console.log("Error eal enviar el correo", error);
            res.status(500).send("Error al enviar el correo");
        } else {
            console.log("Correo enviado:", info.response);
            res.status(200).send("Correo enviado exitosamente.");
        }
    });
};

module.exports = {sendEmail};





