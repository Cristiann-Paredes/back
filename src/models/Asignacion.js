import mongoose from 'mongoose';

const ejercicioEstadoSchema = new mongoose.Schema({
  realizado: { type: Boolean, default: false },
  motivo: { type: String, default: '' }
});

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
  fechaFin: Date,
  observaciones: String,
  estadoEjercicios: {
    type: [ejercicioEstadoSchema],
    default: []
  }
}, { timestamps: true });

const Asignacion = mongoose.model('Asignacion', asignacionSchema);
export default Asignacion;