import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

//rutas 
import routerAuth from './routers/auth.routes.js'
import routerUsuarios from './routers/user.routes.js'
import routerPerfil from './routers/perfil.routes.js'
import routerPlanes from './routers/plan.routes.js'
import routerAsignaciones from './routers/asignacion.routes.js'



const app = express()
dotenv.config()

app.set('port', process.env.PORT || 3000)
app.use(cors())
app.use(express.json())

// Solo rutas nuevas (GYM)
app.use('/api', routerAuth)
app.use('/api', routerUsuarios)
app.use('/api', routerPerfil)
app.use('/api', routerPlanes)
app.use('/api', routerAsignaciones)

app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app
