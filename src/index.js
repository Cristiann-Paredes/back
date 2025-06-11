import dotenv from 'dotenv';
dotenv.config(); // asegúrate que esté al principio

import app from './server.js';
import connection from './database.js';

// Iniciar conexión a la base de datos
connection();

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`✅ Server running on port ${app.get('port')}`);
});
