const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// 📩 función limpia sin res
const sendEmail = async (name, email, id) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verifica tu email",
      text: `Hola ${name}, por favor verifica tu cuenta de Chueks Mayorista haciendo click en el siguiente enlace.`,
      html: `
        <h1>Verifica tu cuenta</h1>
        <p>Hola ${name}, por favor verifica tu cuenta haciendo click en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/verify/${id}">
          Verificar cuenta
        </a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    return false;
  }
};

module.exports = { sendEmail };
