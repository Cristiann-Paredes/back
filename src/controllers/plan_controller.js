import Plan from '../models/Plan.js'
import mongoose from 'mongoose'



const crearPlan = async (req, res) => {
    const { nombre } = req.body
  
    const existe = await Plan.findOne({ nombre: nombre.trim() })
    if (existe) {
      return res.status(400).json({ msg: 'Ya existe un plan con ese nombre' })
    }
  
    const plan = new Plan(req.body)
    await plan.save()
    res.status(201).json({ msg: 'Plan creado correctamente', plan })
  }



const listarPlanes = async (req, res) => {
  const planes = await Plan.find({ estado: true })
  res.status(200).json(planes)
}

const detallePlan = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'ID no válido' })

  const plan = await Plan.findById(id)
  if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' })
  res.status(200).json(plan)
}

const actualizarPlan = async (req, res) => {
  const { id } = req.params
  const plan = await Plan.findById(id)
  if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' })

  Object.assign(plan, req.body)
  await plan.save()
  res.status(200).json({ msg: 'Plan actualizado correctamente' })
}

const eliminarPlan = async (req, res) => {
    const { id } = req.params
    const plan = await Plan.findById(id)
    if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' })
  
    await Plan.findByIdAndDelete(id)
    res.status(200).json({ msg: 'Plan eliminado permanentemente' })
  }

export {
  crearPlan,
  listarPlanes,
  detallePlan,
  actualizarPlan,
  eliminarPlan
}
