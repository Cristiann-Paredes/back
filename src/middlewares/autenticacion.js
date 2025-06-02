import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const verificarAutenticacion = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ msg: "Token no proporcionado" });

  try {
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(id).select('-password');

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // 🚨 Validar restricciones para CLIENTES
    if (usuario.rol === 'cliente') {
      if (!usuario.estado) {
        return res.status(403).json({ msg: "Tu cuenta está inactiva. Contacta al administrador." });
      }

      const hoy = new Date();
      const inicio = usuario.fechaInicio ? new Date(usuario.fechaInicio) : null;
      const fin = usuario.fechaVencimiento ? new Date(usuario.fechaVencimiento) : null;

      if ((inicio && hoy < inicio) || (fin && hoy > fin)) {
        return res.status(403).json({
          msg: "Acceso denegado. Tu plan no está activo o ha vencido. Contacta al administrador."
        });
      }
    }

    req.usuario = usuario;
    req.rol = rol;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export default verificarAutenticacion;
