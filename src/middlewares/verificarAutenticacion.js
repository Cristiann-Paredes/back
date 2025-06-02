const verificarAutenticacion = (req, res, next) => {
if (usuario.rol === 'cliente') {
  const hoy = new Date();
  if (!usuario.estado || !usuario.fechaInicio || !usuario.fechaFin || hoy < usuario.fechaInicio || hoy > usuario.fechaFin) {
    return res.status(403).json({ msg: 'Acceso desactivado. Contacta con el administrador.' });
  }
}
};