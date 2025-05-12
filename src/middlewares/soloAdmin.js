const soloAdmin = (req, res, next) => {
    if (req.rol !== 'admin') {
      return res.status(403).json({ msg: "Acceso denegado: solo administradores" })
    }
    next()
  }
  
  export default soloAdmin
  