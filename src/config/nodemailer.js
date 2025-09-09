const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});


const sendEmail = async (name, email, id) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verifica tu email",
      html: `
        <h1>Verifica tu cuenta</h1>
        <p>Hola ${name}, por favor verifica tu cuenta haciendo click en el siguiente enlace:</p>
        <a href="${process.env.BACKEND_URL}/api/v1/users/verifyaccount/${id}">
          Verificar cuenta
        </a>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error.message);
    return false;
  }
};
module.exports = { sendEmail };
