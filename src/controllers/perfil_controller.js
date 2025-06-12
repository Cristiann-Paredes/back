import Usuario from '../models/Usuario.js'
import bcrypt from 'bcryptjs'

const verPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password -token -__v');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const hoy = new Date();
    let diasRestantes = null;

    if (usuario.fechaVencimiento) {
      const vencimiento = new Date(usuario.fechaVencimiento);
      const diferencia = vencimiento - hoy;
      diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    res.status(200).json({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      imagenPerfil: usuario.imagenPerfil,
      estado: usuario.estado,
      fechaInicio: usuario.fechaInicio,
      fechaVencimiento: usuario.fechaVencimiento,
      diasRestantes    // dias para el cliente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el perfil' });
  }
};

// Actualizar nombre/correo
const actualizarPerfil = async (req, res) => {
  const { nombre, correo, imagenPerfil } = req.body;

  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Validar si el nuevo nombre ya existe en otro usuario (ignorando el actual)
    if (nombre && nombre !== usuario.nombre) {
      const nombreEnUso = await Usuario.findOne({
        nombre: nombre.toUpperCase(),
        _id: { $ne: req.usuario.id }
      });

      if (nombreEnUso) {
        return res.status(400).json({ msg: '❌ El nombre ya está en uso por otro usuario.' });
      }

      usuario.nombre = nombre.toUpperCase();
    }

    // Actualizar correo solo si es distinto
    if (correo && correo !== usuario.correo) {
      usuario.correo = correo;
    }

    // Actualizar imagen solo si es nueva
    if (imagenPerfil) {
      usuario.imagenPerfil = imagenPerfil;
    }

    await usuario.save();

    res.json({ msg: '✅ Perfil actualizado correctamente.', usuario });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al actualizar el perfil' });
  }
};



// Cambiar la contraseña
const cambiarPassword = async (req, res) => {
  const { passwordActual, passwordNuevo } = req.body

  const usuario = await Usuario.findById(req.usuario._id)
  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

  const passwordOk = await bcrypt.compare(passwordActual, usuario.password)
  if (!passwordOk) return res.status(400).json({ msg: 'La contraseña actual es incorrecta' })

  usuario.password = await usuario.encrypPassword(passwordNuevo)
  await usuario.save()

  res.status(200).json({ msg: 'Contraseña actualizada correctamente' })
}


// Actualizar estado del cliente
const actualizarEstadoCliente = async (req, res) => {
  const { id } = req.params;
  const { fechaInicio, fechaVencimiento } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario || usuario.rol !== 'cliente') {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    usuario.fechaInicio = fechaInicio || null;
    usuario.fechaVencimiento = fechaVencimiento || null;

    const hoy = new Date().toISOString().slice(0, 10);
    usuario.estado = (fechaInicio && fechaVencimiento && hoy >= fechaInicio && hoy <= fechaVencimiento) ? true : false;

    await usuario.save();

    res.json({ msg: '✅ Estado y fechas actualizados correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al actualizar estado' });
  }
};



// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Usuario.find({
      rol: 'cliente',
      confirmEmail: true   // ✅ Solo usuarios confirmados
    }).select('nombre correo estado fechaInicio fechaVencimiento');

    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al obtener clientes' });
  }
};



export {
  verPerfil,
  actualizarPerfil,
  cambiarPassword,
  actualizarEstadoCliente,
  obtenerClientes
}
