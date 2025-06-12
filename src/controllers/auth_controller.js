// src/controllers/auth_controller.js
import Usuario from '../models/Usuario.js'
import generarJWT from '../helpers/crearJWT.js'
import { sendMailToUser, sendMailToRecoveryPassword } from '../config/nodemailer.js'



// Login 
const login = async (req, res) => {
  const { correo, password } = req.body
  const usuario = await Usuario.findOne({ correo })
  if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
  if (!usuario.confirmEmail) return res.status(403).json({ msg: "Cuenta no verificada" })

  const match = await usuario.matchPassword(password)
  if (!match) return res.status(401).json({ msg: "Contraseña incorrecta" })

  const token = generarJWT(usuario._id, usuario.rol)
  const { nombre, rol, _id } = usuario
  res.status(200).json({ token, nombre, rol, correo, _id })
}

// Registro de usuario
const registro = async (req, res) => {
  let { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  nombre = nombre.replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/g, '').toUpperCase();

  try {
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const existeNombre = await Usuario.findOne({ nombre });
    if (existeNombre) {
      return res.status(400).json({ msg: "El nombre de usuario ya está en uso" });
    }

    const nuevoUsuario = new Usuario({ nombre, correo, password, rol });
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
    const token = nuevoUsuario.crearToken();
    nuevoUsuario.token = token;

    await nuevoUsuario.save();
    await sendMailToUser(correo, token);

    // ✅ AÑADIDO: devolvemos el ID del nuevo usuario
    res.status(201).json({
      msg: "Usuario registrado, verifica tu cuenta por correo",
      cliente: { _id: nuevoUsuario._id }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar el usuario", error: error.message });
  }
};



// Confirmar cuenta de usuario
const confirmarCuenta = async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
      // Token inválido
      return res.redirect(`${process.env.URL_FRONTEND}/confirmacion-error`);
    }

    // Confirmar usuario
    usuario.token = null;
    usuario.confirmEmail = true;
    await usuario.save();

    // Redirigir al frontend
    return res.redirect(`${process.env.URL_FRONTEND}/confirmacion-exitosa`);
  } catch (error) {
    console.error("Error confirmando cuenta:", error);
    return res.redirect(`${process.env.URL_FRONTEND}/confirmacion-error`);
  }
};


// Recuperar contraseña
const recuperarPassword = async (req, res) => {
  const { correo } = req.body
  const usuario = await Usuario.findOne({ correo })
  if (!usuario) return res.status(404).json({ msg: "Correo no encontrado" })

  const token = usuario.crearToken()
  usuario.token = token
  await usuario.save()

  await sendMailToRecoveryPassword(correo, token)
  res.status(200).json({ msg: "Correo enviado para restablecer la contraseña" })
}


// Restablecer contraseña
const resetearPassword = async (req, res) => {
  const { token } = req.params
  const { password, confirmar } = req.body

  if (password !== confirmar) return res.status(400).json({ msg: "Las contraseñas no coinciden" })
  const usuario = await Usuario.findOne({ token })
  if (!usuario) return res.status(404).json({ msg: "Token inválido" })

  usuario.password = await usuario.encrypPassword(password)
  usuario.token = null
  await usuario.save()
  return res.redirect(`${process.env.URL_FRONTEND}/password-actualizada`);
}

export {
  login,
  registro,
  confirmarCuenta,
  recuperarPassword,
  resetearPassword
}
