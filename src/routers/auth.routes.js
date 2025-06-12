import express from 'express'
import Usuario from '../models/Usuario.js'
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

// POST - Enviar email de recuperación
router.post('/auth/recuperar-password', recuperarPassword);

// GET - Mostrar formulario al abrir enlace del correo
router.get('/auth/recuperar-password/:token', async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    return res.send(`
      <html>
        <head>
          <title>Token inválido</title>
          <style>
            body { font-family: sans-serif; background: #121212; color: white; text-align: center; padding: 4rem; }
            a { color: #1976d2; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>❌ Enlace inválido o ya utilizado</h1>
          <p>Este enlace ya fue utilizado o ha expirado.</p>
          <a href="${process.env.URL_FRONTEND}/recuperar">Solicitar nuevo enlace</a>
        </body>
      </html>
    `);
  }

  // Mostrar formulario de nueva contraseña
  res.send(`
    <html>
      <head>
        <title>Restablecer Contraseña</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #121212;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .form-container {
            background: #1e1e1e;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
            width: 90%;
            max-width: 400px;
          }

          h2 {
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            color: #d32f2f;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
          }

          button {
            width: 100%;
            padding: 0.75rem;
            background-color: #d32f2f;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 0.5rem;
          }

          button:hover {
            background-color: #b71c1c;
          }

          .link {
            display: block;
            margin-top: 1.5rem;
            text-align: center;
            color: #64b5f6;
            text-decoration: none;
            font-size: 0.95rem;
          }

          .link:hover {
            text-decoration: underline;
          }

          @media (max-width: 500px) {
            .form-container {
              padding: 1.5rem;
            }

            h2 {
              font-size: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h2>Restablecer Contraseña</h2>
          <form action="/api/auth/recuperar-password/${token}" method="POST">
            <input type="password" name="password" placeholder="Nueva contraseña" required />
            <input type="password" name="confirmar" placeholder="Confirmar contraseña" required />
            <button type="submit">Actualizar contraseña</button>
          </form>
          <a class="link" href="${process.env.URL_FRONTEND}/login ">Volver al inicio de sesión</a>
        </div>
      </body>
    </html>
  `);
});

// POST - Guardar nueva contraseña
router.post('/auth/recuperar-password/:token', resetearPassword);


export default router
