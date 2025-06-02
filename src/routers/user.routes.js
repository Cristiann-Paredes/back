import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import soloAdmin from '../middlewares/soloAdmin.js'

import {
  listarClientes,
  detalleCliente,
  actualizarCliente,
  cambiarEstadoCliente,
  eliminarCliente
} from '../controllers/user_controller.js'

const router = express.Router()

// Listar todos los clientes
router.get('/clientes', verificarAutenticacion, soloAdmin, listarClientes)

// Obtener detalles de un cliente específico
router.get('/clientes/:id', verificarAutenticacion, soloAdmin, detalleCliente)

// Actualizar un cliente (nombre, correo o estado)
router.put('/clientes/:id', verificarAutenticacion, soloAdmin, actualizarCliente)

// Cambiar el estado de un cliente (activo/inactivo)
router.patch('/clientes/:id/estado', verificarAutenticacion, soloAdmin, cambiarEstadoCliente)

// Eliminar un cliente
router.delete('/clientes/:id', verificarAutenticacion, soloAdmin, eliminarCliente)

export default router