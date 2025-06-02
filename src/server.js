import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "recursos"
app.use('/recursos', express.static(path.join('src', 'recursos')));
// Servir la carpeta recursos como pública
app.use('/recursos', express.static(path.resolve('recursos')));

// Rutas
app.use('/api', routerAuth);
app.use('/api', routerUsuarios);
app.use('/api', routerPerfil);
app.use('/api', routerPlanes);
app.use('/api', routerAsignaciones);

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

export default app;