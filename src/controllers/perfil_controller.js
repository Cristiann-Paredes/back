import Usuario from '../models/Usuario.js'
import bcrypt from 'bcryptjs'

const verPerfil = async (req, res) => {
  const usuario = req.usuario
  delete usuario.password
  delete usuario.token
  delete usuario.__v

  res.status(200).json(usuario)
}

// Actualizar nombre/correo
const actualizarPerfil = async (req, res) => {
  const { nombre, correo } = req.body
  const usuario = await Usuario.findById(req.usuario._id)

  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

  // Si se quiere cambiar el correo, validar que no exista otro
  if (correo && correo !== usuario.correo) {
    const existeCorreo = await Usuario.findOne({ correo })
    if (existeCorreo) return res.status(400).json({ msg: 'Ese correo ya está en uso' })
    usuario.correo = correo
  }

  usuario.nombre = nombre || usuario.nombre
  await usuario.save()

  res.status(200).json({ msg: 'Perfil actualizado correctamente' })
}

// Cambiar la contraseña
const cambiarPassword = async (req, res) => {
  const { passwordActual, passwordNuevo } = req.body

  const usuario = await Usuario.findById(req.usuario._id)
  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

  const passwordOk = await bcrypt.compare(passwordActual, usuario.password)
  if (!passwordOk) return res.status(400).json({ msg: 'La contraseña actual es incorrecta' })

  usuario.password = await usuario.encrypPassword(passwordNuevo)
  await usuario.save()

  res.status(200).json({ msg: 'Contraseña actualizada correctamente' })
}

export {
  verPerfil,
  actualizarPerfil,
  cambiarPassword
}
