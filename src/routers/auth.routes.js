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
router.get('/auth/recuperar-password/:token', (req, res) => {
  const { token } = req.params;
  res.send(`
    <html>
      <head>
        <title>Restablecer Contraseña</title>
        <style>
          body { font-family: sans-serif; background: #181818; color: white; padding: 2rem; text-align: center; }
          form { background: #222; padding: 2rem; border-radius: 8px; display: inline-block; }
          input, button { padding: 0.5rem; margin: 0.5rem 0; width: 100%; }
          button { background: #d32f2f; color: white; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Restablecer Contraseña</h2>
        <form action="/api/auth/recuperar-password/${token}" method="POST">
          <input type="password" name="password" placeholder="Nueva contraseña" required><br>
          <input type="password" name="confirmar" placeholder="Confirmar contraseña" required><br>
          <button type="submit">Actualizar contraseña</button>
        </form>
      </body>
    </html>
  `);
});

router.post('/auth/recuperar-password/:token', resetearPassword)

export default router
