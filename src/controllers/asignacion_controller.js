import Asignacion from '../models/Asignacion.js'
import Usuario from '../models/Usuario.js'
import Plan from '../models/Plan.js'
import mongoose from 'mongoose'

// Controlador para asignar un plan a un usuario cliente
const asignarPlan = async (req, res) => {
  const { usuario, plan, observaciones } = req.body

  if (!mongoose.Types.ObjectId.isValid(usuario) || !mongoose.Types.ObjectId.isValid(plan)) {
    return res.status(400).json({ msg: 'ID de usuario o plan no válido' })
  }

  const usuarioExiste = await Usuario.findById(usuario)
  const planExiste = await Plan.findById(plan)

  if (!usuarioExiste || usuarioExiste.rol !== 'cliente') return res.status(404).json({ msg: 'Usuario cliente no válido' })
  if (!planExiste) return res.status(404).json({ msg: 'Plan no encontrado' })

  const yaAsignado = await Asignacion.findOne({ usuario, plan })
  if (yaAsignado) return res.status(400).json({ msg: 'Ese plan ya está asignado a este usuario' })

  const nueva = new Asignacion({ usuario, plan, observaciones })
  await nueva.save()
  res.status(201).json({ msg: 'Plan asignado correctamente' })
}

// Controladores para ver asignaciones
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

//eliminar asignacion
const eliminarAsignacion = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID de asignación no válido' })
  }

  const asignacion = await Asignacion.findById(id)
  if (!asignacion) {
    return res.status(404).json({ msg: 'Asignación no encontrada' })
  }
  await asignacion.deleteOne()
  res.status(200).json({ msg: 'Asignación eliminada correctamente' })
}

//actualizar asignacion
const actualizarAsignacion = async (req, res) => {
  const { id } = req.params
  const { usuario, plan, observaciones } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID de asignación no válido' })
  }

  const asignacion = await Asignacion.findById(id)
  if (!asignacion) {
    return res.status(404).json({ msg: 'Asignación no encontrada' })
  }
  if (usuario) {
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ msg: 'ID de usuario no válido' })
    }
    const usuarioExiste = await Usuario.findById(usuario)
    if (!usuarioExiste || usuarioExiste.rol !== 'cliente') {
      return res.status(404).json({ msg: 'Usuario cliente no válido' })
    }
  }
  if (plan) {
    if (!mongoose.Types.ObjectId.isValid(plan)) {
      return res.status(400).json({ msg: 'ID de plan no válido' })
    }
    const planExiste = await Plan.findById(plan)
    if (!planExiste) {
      return res.status(404).json({ msg: 'Plan no encontrado' })
    }
  }
  if (observaciones) {
    asignacion.observaciones = observaciones
  }
  //if (fechaFin) {
   // asignacion.fechaFin = fechaFin
  //}
  if (usuario) {
    asignacion.usuario = usuario
  }
  if (plan) {
    asignacion.plan = plan
  }
  await asignacion.save()
  res.status(200).json({ msg: 'Asignación actualizada correctamente' })
}



// Actualizar progreso de ejercicios por el cliente
const actualizarEjercicioEstado = async (req, res) => {
  const { id } = req.params;
  const { idx, realizado, motivo } = req.body;

  const asignacion = await Asignacion.findById(id);
  if (!asignacion) return res.status(404).json({ msg: 'Asignación no encontrada' });

  // Asegura que el array tenga la misma longitud que los ejercicios del plan
  if (!asignacion.estadoEjercicios[idx]) {
    asignacion.estadoEjercicios[idx] = { realizado: false, motivo: '' };
  }

  asignacion.estadoEjercicios[idx] = { realizado, motivo };
  await asignacion.save();

  res.status(200).json({ msg: 'Estado del ejercicio actualizado' });
};





export {
  asignarPlan,
  verAsignacionesCliente,
  verAsignacionesAdmin, 
  eliminarAsignacion,
  actualizarAsignacion,
  actualizarEjercicioEstado
}
