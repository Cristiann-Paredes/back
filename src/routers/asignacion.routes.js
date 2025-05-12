import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import soloAdmin from '../middlewares/soloAdmin.js'
import {
  asignarPlan,
  verAsignacionesCliente,
  verAsignacionesAdmin
} from '../controllers/asignacion_controller.js'

const router = express.Router()

router.post('/asignaciones', verificarAutenticacion, soloAdmin, asignarPlan)
router.get('/asignaciones', verificarAutenticacion, soloAdmin, verAsignacionesAdmin)
router.get('/mis-planes', verificarAutenticacion, verAsignacionesCliente)

export default router
