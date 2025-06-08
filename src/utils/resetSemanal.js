// utils/resetSemanal.js
import Asignacion from '../models/Asignacion.js';
import Plan from '../models/Plan.js';

export const reiniciarEjerciciosSemanales = async () => {
  try {
    const asignaciones = await Asignacion.find().populate('plan');

    for (const asig of asignaciones) {
      const ejercicios = asig.plan?.ejercicios || [];
      asig.estadoEjercicios = ejercicios.map(() => ({ realizado: false, motivo: '' }));
      await asig.save();
    }

    console.log('✅ Reinicio semanal de ejercicios completado.');
  } catch (error) {
    console.error('❌ Error al reiniciar ejercicios:', error);
  }
};
