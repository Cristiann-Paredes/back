import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import soloAdmin from '../middlewares/soloAdmin.js'
import {
  verPerfil,
  actualizarPerfil,
  cambiarPassword,
  actualizarEstadoCliente,
  obtenerClientes
} from '../controllers/perfil_controller.js'

const router = express.Router()

// Rutas existentes
router.get('/perfil', verificarAutenticacion, verPerfil)
router.put('/perfil', verificarAutenticacion, actualizarPerfil)
router.put('/perfil/password', verificarAutenticacion, cambiarPassword)

// NUEVA RUTA para actualizar estado (solo admin)
router.put('/perfil/estado/:id', verificarAutenticacion, actualizarEstadoCliente, soloAdmin)
// NUEVA RUTA para obtener clientes (solo admin)
router.get('/perfil/clientes', verificarAutenticacion, soloAdmin, obtenerClientes)

export default router
