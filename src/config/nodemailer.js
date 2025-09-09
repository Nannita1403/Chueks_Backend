const nodemailer = require("nodemailer");

// Configura el transporter con Gmail y App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,      // tu correo completo
    pass: process.env.NODEMAILER_PASS,       // App Password de 16 caracteres
  },
});

/**
 * Enviar correo de verificación
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} id - ID del usuario en Mongo
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendEmail = async (name, email, id) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verifica tu email",
      text: `Hola ${name}, por favor verifica tu cuenta de Chueks Mayorista haciendo click en el siguiente enlace: ${process.env.BACKEND_URL}/api/v1/users/verifyaccount/${id}`,
      html: `
        <h1>Verifica tu cuenta</h1>
        <p>Hola ${name}, por favor verifica tu cuenta haciendo click en el siguiente enlace:</p>
        <a href="${process.env.BACKEND_URL}/api/v1/users/verifyaccount/${id}">Verificar cuenta</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado:", info.response);
    return { success: true, message: "Correo enviado correctamente" };
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error.message);
    return {
      success: false,
      message: "No se pudo enviar el correo de verificación. Contacta al soporte.",
    };
  }
};

module.exports = { sendEmail };