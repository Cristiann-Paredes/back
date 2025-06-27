
# 🏋️‍♂️ OxGym - Backend API

Este es el backend del sistema web **OxGym**, una plataforma de gestión de planes de entrenamiento desarrollada con Node.js, Express y MongoDB. Este servidor ofrece funcionalidades RESTful para el manejo de usuarios, planes, asignaciones y control de estado.

## 🚀 Tecnologías

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Uploadcare / Cloudinary
- dotenv

## 📁 Estructura principal

```
/backend
│
├── controllers/       # Lógica de cada ruta
├── models/            # Esquemas de Mongoose
├── routes/            # Endpoints principales
├── middlewares/       # Autenticación, validaciones
├── uploads/           # Carpeta temporal (si aplica)
├── .env.example       # Variables de entorno (ejemplo)
├── server.js          # Archivo principal
└── README.md
```

## ⚙️ Variables de entorno

Crea un archivo `.env` basado en el `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/oxgym
JWT_SECRET=tu_clave_secreta
UPLOADCARE_PUBLIC_KEY=pk_test_xxx
UPLOADCARE_SECRET_KEY=sk_test_xxx
```

## 🧪 Instalación local

```bash
# Clonar el proyecto
git clone https://github.com/tuusuario/oxgym-backend.git
cd oxgym-backend

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

El servidor estará corriendo en `http://localhost:3000/api/`.

## 🌐 Despliegue en producción

Recomendado para plataformas como **Render** o **Railway**:

1. Crear variables de entorno en el dashboard.
2. Activar despliegue automático con GitHub.
3. Configurar build command: `npm install && npm run start`.

## 🔒 Seguridad

- Los endpoints protegidos requieren token JWT en el header `Authorization`.
- Validación de roles (admin / cliente) habilitada.

## 📬 Contacto

Si deseas colaborar o reportar errores:  
📧 **tuemail@dominio.com**
