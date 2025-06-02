import express from 'express';
import verificarAutenticacion from '../middlewares/autenticacion.js';
import soloAdmin from '../middlewares/soloAdmin.js';
import { validacionPlan } from '../middlewares/validacionPlan.js';
import {
  crearPlan,
  listarPlanes,
  detallePlan,
  actualizarPlan,
  eliminarPlan,
} from '../controllers/plan_controller.js';

const router = express.Router();

router.post('/planes', crearPlan);
router.get('/planes', verificarAutenticacion, listarPlanes);
router.get('/planes/:id', verificarAutenticacion, detallePlan);
router.put('/planes/:id', verificarAutenticacion, soloAdmin, validacionPlan, actualizarPlan);
router.delete('/planes/:id', verificarAutenticacion, soloAdmin, eliminarPlan);

export default router;
