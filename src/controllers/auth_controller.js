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
  const { correo, password } = req.body
  const existe = await Usuario.findOne({ correo })
  if (existe) return res.status(400).json({ msg: "El correo ya está registrado" })

  const nuevoUsuario = new Usuario(req.body)
  nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
  const token = nuevoUsuario.crearToken()
  nuevoUsuario.token = token
  await nuevoUsuario.save()

  await sendMailToUser(correo, token)
  res.status(201).json({ msg: "Usuario registrado, verifica tu cuenta por correo" })
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
