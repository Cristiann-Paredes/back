import Asignacion from '../models/Asignacion.js'
import Usuario from '../models/Usuario.js'
import Plan from '../models/Plan.js'
import mongoose from 'mongoose'

const asignarPlan = async (req, res) => {
  const { usuario, plan, observaciones, fechaFin } = req.body

  if (!mongoose.Types.ObjectId.isValid(usuario) || !mongoose.Types.ObjectId.isValid(plan)) {
    return res.status(400).json({ msg: 'ID de usuario o plan no válido' })
  }

  const usuarioExiste = await Usuario.findById(usuario)
  const planExiste = await Plan.findById(plan)

  if (!usuarioExiste || usuarioExiste.rol !== 'cliente') return res.status(404).json({ msg: 'Usuario cliente no válido' })
  if (!planExiste) return res.status(404).json({ msg: 'Plan no encontrado' })

  const yaAsignado = await Asignacion.findOne({ usuario, plan })
  if (yaAsignado) return res.status(400).json({ msg: 'Ese plan ya está asignado a este usuario' })

  const nueva = new Asignacion({ usuario, plan, observaciones, fechaFin })
  await nueva.save()
  res.status(201).json({ msg: 'Plan asignado correctamente' })
}


const verAsignacionesCliente = async (req, res) => {
  const usuarioId = req.usuario._id

  const asignaciones = await Asignacion.find({ usuario: usuarioId })
    .populate('plan', 'nombre descripcion nivel ejercicios')

  res.status(200).json(asignaciones)
}



const verAsignacionesAdmin = async (req, res) => {
  const asignaciones = await Asignacion.find()
    .populate('usuario', 'nombre correo')
    .populate('plan', 'nombre nivel')
  res.status(200).json(asignaciones)
}

export {
  asignarPlan,
  verAsignacionesCliente,
  verAsignacionesAdmin
}
