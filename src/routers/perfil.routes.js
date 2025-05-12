import express from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import {
  verPerfil,
  actualizarPerfil,
  cambiarPassword
} from '../controllers/perfil_controller.js'

const router = express.Router()

router.get('/perfil', verificarAutenticacion, verPerfil)
router.put('/perfil', verificarAutenticacion, actualizarPerfil)
router.put('/perfil/password', verificarAutenticacion, cambiarPassword)

export default router
