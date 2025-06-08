import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import soloAdmin from '../middlewares/soloAdmin.js'
import { reiniciarEjerciciosSemanales } from '../utils/resetSemanal.js';

import {
  asignarPlan,
  verAsignacionesCliente,
  verAsignacionesAdmin,
  actualizarAsignacion,
  eliminarAsignacion,
  actualizarEjercicioEstado
} from '../controllers/asignacion_controller.js'


const router = express.Router()

router.post('/asignaciones', verificarAutenticacion, soloAdmin, asignarPlan)
router.get('/asignaciones', verificarAutenticacion, soloAdmin, verAsignacionesAdmin)
router.get('/mis-planes', verificarAutenticacion, verAsignacionesCliente)
router.delete('/asignaciones/:id', verificarAutenticacion, soloAdmin, eliminarAsignacion)
router.put('/asignaciones/:id', verificarAutenticacion, soloAdmin, actualizarAsignacion)
router.patch('/asignaciones/:id/ejercicio', verificarAutenticacion, actualizarEjercicioEstado);
// rutas/asignaciones.js
router.post('/reiniciar-semanal', verificarAutenticacion, soloAdmin, async (req, res) => {
  try {
    await reiniciarEjerciciosSemanales();
    res.status(200).json({ msg: 'Reinicio semanal ejecutado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al ejecutar el reinicio semanal.' });
  }
});


export default router
