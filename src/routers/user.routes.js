import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import soloAdmin from '../middlewares/soloAdmin.js' 

import {
  listarClientes,
  detalleCliente,
  actualizarCliente,
  cambiarEstadoCliente
} from '../controllers/user_controller.js'

const router = express.Router()

router.get('/clientes', verificarAutenticacion, soloAdmin, listarClientes)
router.get('/clientes/:id', verificarAutenticacion, soloAdmin, detalleCliente)
router.put('/clientes/:id', verificarAutenticacion, soloAdmin, actualizarCliente)
router.patch('/clientes/:id/estado', verificarAutenticacion, soloAdmin, cambiarEstadoCliente)

export default router
