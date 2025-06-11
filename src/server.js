import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron'; // ✅ Importar node-cron
import { reiniciarEjerciciosSemanales } from './utils/resetSemanal.js'; // ✅ Lógica del reinicio


// Rutas
import routerAuth from './routers/auth.routes.js';
import routerUsuarios from './routers/user.routes.js';
import routerPerfil from './routers/perfil.routes.js';
import routerPlanes from './routers/plan.routes.js';
import routerAsignaciones from './routers/asignacion.routes.js';


const app = express();
dotenv.config();

// Configuración del puerto
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(cors({
  origin: process.env.URL_FRONTEND,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas
app.use('/api', routerAuth);
app.use('/api', routerUsuarios);
app.use('/api', routerPerfil);
app.use('/api', routerPlanes);
app.use('/api', routerAsignaciones);

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// 🕒 Tarea cron: reinicio automático de ejercicios cada lunes a las 00:00
cron.schedule('0 0 * * 1', async () => {
  console.log('🔁 Ejecutando reinicio semanal de ejercicios...');
  await reiniciarEjerciciosSemanales();
});

export default app;