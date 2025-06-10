// controllers/plan_controller.js
import Plan from '../models/Plan.js';
import mongoose from 'mongoose';

// Crear un plan
const crearPlan = async (req, res) => {
  try {
    const { nombre, descripcion, nivel, ejercicios } = req.body;

    let ejerciciosProcesados = [];
    if (typeof ejercicios === 'string') {
      ejerciciosProcesados = JSON.parse(ejercicios);
    } else if (Array.isArray(ejercicios)) {
      ejerciciosProcesados = ejercicios;
    }

    // No añadimos imágenes aquí. Las imágenes llegan desde el frontend.
    const ejerciciosFinales = ejerciciosProcesados.map(ej => ({
      nombre: ej.nombre,
      repeticiones: ej.repeticiones,
      imagenURL: ej.imagenURL || '', // Se espera que venga del frontend
      videoURL: ej.videoURL || '',
    }));

    const nuevoPlan = new Plan({
      nombre,
      descripcion,
      nivel,
      ejercicios: ejerciciosFinales,
    });

    await nuevoPlan.save();
    res.status(201).json({ msg: '✅ Plan creado correctamente', plan: nuevoPlan });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al crear el plan', error: error.message });
  }
};

// Listar planes activos
const listarPlanes = async (req, res) => {
  const planes = await Plan.find({ estado: true });
  res.status(200).json(planes);
};

// Detalle de un plan
const detallePlan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID no válido' });
  }

  const plan = await Plan.findById(id);
  if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' });

  res.status(200).json(plan);
};


// Actualizar plan
const actualizarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID no válido' });
    }

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' });

    const { nombre, descripcion, nivel, ejercicios } = req.body;

    let ejerciciosProcesados = [];
    if (typeof ejercicios === 'string') {
      ejerciciosProcesados = JSON.parse(ejercicios);
    } else if (Array.isArray(ejercicios)) {
      ejerciciosProcesados = ejercicios;
    }

    const ejerciciosFinales = ejerciciosProcesados.map(ej => ({
      nombre: ej.nombre,
      repeticiones: ej.repeticiones,
      imagenURL: ej.imagenURL || '', // Usamos el que viene del frontend
      videoURL: ej.videoURL || '',
    }));

    plan.nombre = nombre;
    plan.descripcion = descripcion;
    plan.nivel = nivel;
    plan.ejercicios = ejerciciosFinales;

    await plan.save();
    res.status(200).json({ msg: '✅ Plan actualizado correctamente', plan });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al actualizar el plan', error: error.message });
  }
};

// Eliminar plan
const eliminarPlan = async (req, res) => {
  const { id } = req.params;
  const plan = await Plan.findById(id);
  if (!plan) return res.status(404).json({ msg: 'Plan no encontrado' });

  await Plan.findByIdAndDelete(id);
  res.status(200).json({ msg: '✅ Plan eliminado permanentemente' });
};

export {
  crearPlan,
  listarPlanes,
  detallePlan,
  actualizarPlan,
  eliminarPlan
};
