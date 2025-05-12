import mongoose from 'mongoose'

const asignacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  fechaAsignacion: {
    type: Date,
    default: Date.now
  },
  fechaFin: {
    type: Date  
  },
  observaciones: {
    type: String,
    default: ''
  }
}, { timestamps: true })

const Asignacion = mongoose.model('Asignacion', asignacionSchema)
export default Asignacion
