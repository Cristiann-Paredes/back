import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

// PLANTILLA BASE
const baseTemplate = (content) => `
  <div style="max-width:500px;margin:auto;background:#181818;color:#fff;font-family:sans-serif;border-radius:10px;overflow:hidden;border:1px solid #222;">
    <div style="background:#d32f2f;padding:20px 0;text-align:center;">
      <h1 style="margin:0;color:#fff;">Ox Gym</h1>
    </div>
    <div style="padding:30px 20px 20px 20px;background:#222;">
      ${content}
    </div>
    <div style="background:#181818;padding:15px;text-align:center;font-size:13px;color:#aaa;">
      © ${new Date().getFullYear()} Ox Gym. Todos los derechos reservados.
    </div>
  </div>
`;


// Correo de confirmación de cuenta
const sendMailToUser = (userMail, token) => {
  const link = `${process.env.URL_BACKEND}/api/auth/confirmar/${encodeURIComponent(token)}`; // corregido

  const html = baseTemplate(`
    <h2 style="color:#d32f2f;">¡Bienvenido!</h2>
    <p>Gracias por registrarte en <b>Ox Gym</b>.</p>
    <p>Confirma tu cuenta haciendo clic en el siguiente botón:</p>
    <a href="${link}" style="padding:12px 24px;background:#d32f2f;color:#fff;border-radius:5px;text-decoration:none;font-weight:bold;">
      Confirmar cuenta
    </a>
  `);

  const mailOptions = {
    from: `"Ox Gym" <${process.env.USER_MAILTRAP}>`,
    to: userMail,
    subject: "Verifica tu cuenta en Ox Gym",
    html
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error al enviar correo:", err);
    } else {
      console.log("✅ Correo enviado:", info.response);
    }
  });
};


// Correo de recuperación de contraseña
const sendMailToRecoveryPassword = async (userMail, token) => {
  const link = `${process.env.URL_FRONTEND}/api/auth/recuperar/${encodeURIComponent(token)}`;  // 👉 Cambiado a URL del frontend

  const html = baseTemplate(`
    <h2 style="color:#d32f2f;">Recupera tu contraseña</h2>
    <p>Recibimos una solicitud para restablecer tu contraseña en <b>Ox Gym</b>.</p>
    <p>Haz clic en el botón para crear una nueva contraseña:</p>
    <a href="${link}"
       style="display:inline-block;padding:12px 24px;background:#1976d2;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;margin:20px 0;">
      Reestablecer contraseña
    </a>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
  `);

  const info = await transporter.sendMail({
    from: `"Ox Gym" <${process.env.USER_MAILTRAP}>`,
    to: userMail,
    subject: "Recupera tu contraseña en Ox Gym",
    html
  });

  console.log("✅ Correo enviado satisfactoriamente:", info.messageId);
};


// Correo de bienvenida al cliente
const sendMailToCliente = async(userMail, password) => {
  const link = `${process.env.URL_FRONTEND}/auth/login`; 
  
  const html = baseTemplate(`
    <h2 style="color:#d32f2f;">¡Bienvenido a Ox Gym!</h2>
    <p>Tu cuenta ha sido creada exitosamente.</p>
    <p><b>Contraseña de acceso:</b> <span style="color:#1976d2;">${password}</span></p>
    <a href="${link}"
       style="display:inline-block;padding:12px 24px;background:#1976d2;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;margin:20px 0;">
      Iniciar sesión
    </a>
    <p>¡Te damos la bienvenida a la familia Ox Gym!</p>
  `);

  let info = await transporter.sendMail({
    from: `"Ox Gym" <${process.env.USER_MAILTRAP}>`,
    to: userMail,
    subject: "Bienvenido a Ox Gym",
    html
  });

  console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};


export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToCliente
}