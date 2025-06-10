// src/controllers/auth_controller.js
import Usuario from '../models/Usuario.js'
import generarJWT from '../helpers/crearJWT.js'
import { sendMailToUser, sendMailToRecoveryPassword } from '../config/nodemailer.js'




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


const registro = async (req, res) => {
  const { nombre, correo, password, rol } = req.body

  // Validar campos requeridos
  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" })
  }

  try {
    // Verificar si el correo ya está registrado
    const existe = await Usuario.findOne({ correo })
    if (existe) {
      return res.status(400).json({ msg: "El correo ya está registrado" })
    }
    // verificar si existe el mismo nombre de usuario
    const existeNombre = await Usuario.findOne({ nombre })
    if (existeNombre) {
      return res.status(400).json({ msg: "El nombre de usuario ya está en uso" })
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, correo, password, rol })
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password) // Encriptar contraseña
    const token = nuevoUsuario.crearToken() // Generar token para verificación
    nuevoUsuario.token = token

    await nuevoUsuario.save()

    // Enviar correo de verificación
    await sendMailToUser(correo, token)

    // Responder al cliente
    res.status(201).json({ msg: "Usuario registrado, verifica tu cuenta por correo" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Error al registrar el usuario", error: error.message })
  }
}



const confirmarCuenta = async (req, res) => {
  const { token } = req.params
  const usuario = await Usuario.findOne({ token })
  if (!usuario) return res.status(404).json({ msg: "Token no válido" })

  usuario.token = null
  usuario.confirmEmail = true
  await usuario.save()
  res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })
}

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


const resetearPassword = async (req, res) => {
  const { token } = req.params
  const { password, confirmar } = req.body

  if (password !== confirmar) return res.status(400).json({ msg: "Las contraseñas no coinciden" })
  const usuario = await Usuario.findOne({ token })
  if (!usuario) return res.status(404).json({ msg: "Token inválido" })

  usuario.password = await usuario.encrypPassword(password)
  usuario.token = null
  await usuario.save()
  res.status(200).json({ msg: "Contraseña actualizada correctamente" })
}

export {
  login,
  registro,
  confirmarCuenta,
  recuperarPassword,
  resetearPassword
}
