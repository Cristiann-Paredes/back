import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'cliente'], default: 'cliente' },
  estado: { type: Boolean, default: true }, 
  token: { type: String, default: null },
  confirmEmail: { type: Boolean, default: false }
}, { timestamps: true })

usuarioSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

usuarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

usuarioSchema.methods.crearToken = function () {
  return Math.random().toString(36).slice(2)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
