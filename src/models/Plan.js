import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true },
  descripcion: { type: String, required: true, trim: true },
  nivel: { type: String, enum: ['básico', 'intermedio', 'avanzado'], default: 'básico' },
  ejercicios: [{
    nombre: { type: String, required: true },
    repeticiones: { type: String },
    imagenURL: { type: String },
    videoURL: { type: String },
  }],
  estado: { type: Boolean, default: true },
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
