import express from 'express'
import {
  login,
  registro,
  confirmarCuenta,
  recuperarPassword,
  resetearPassword
} from '../controllers/auth_controller.js'

const router = express.Router()

router.post('/auth/login', login)
router.post('/auth/registro', registro)
router.get('/auth/confirmar/:token', confirmarCuenta)
router.post('/auth/recuperar-password', recuperarPassword)
router.post('/auth/recuperar-password/:token', resetearPassword)

export default router
