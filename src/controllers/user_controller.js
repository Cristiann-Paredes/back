import Usuario from '../models/Usuario.js'
import mongoose from 'mongoose'

// Listar solo clientes confirmados y activos
const listarClientes = async (req, res) => {
  try {
    const clientes = await Usuario.find({ rol: 'cliente', confirmEmail: true }).select('-password -__v')
    res.status(200).json(clientes)
  } catch (error) {
    res.status(500).json({ msg: 'Error al listar clientes' })
  }
}


// Obtener detalle de un cliente
const detalleCliente = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'ID no válido' })

  const cliente = await Usuario.findById(id).select('-password -__v')
  if (!cliente || cliente.rol !== 'cliente') return res.status(404).json({ msg: 'Cliente no encontrado' })

  res.status(200).json(cliente)
}

// Actualizar datos del cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params
  const { nombre, correo } = req.body

  const cliente = await Usuario.findById(id)
  if (!cliente || cliente.rol !== 'cliente') return res.status(404).json({ msg: 'Cliente no encontrado' })

  cliente.nombre = nombre || cliente.nombre
  cliente.correo = correo || cliente.correo
  await cliente.save()

  res.status(200).json({ msg: 'Cliente actualizado correctamente' })
}

// Cambiar estado del cliente (activo/inactivo)
const cambiarEstadoCliente = async (req, res) => {
  const { id } = req.params
  const cliente = await Usuario.findById(id)
  if (!cliente || cliente.rol !== 'cliente') return res.status(404).json({ msg: 'Cliente no encontrado' })

  cliente.estado = !cliente.estado
  await cliente.save()

  res.status(200).json({ msg: `Cliente ${cliente.estado ? 'activado' : 'desactivado'}` })
}

// Eliminar cliente 
const eliminarCliente = async (req, res) => {
  const { id } = req.params
  try {
    const cliente = await Usuario.findById(id)
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' })
    }

    // Elimina el cliente
    await Usuario.findByIdAndDelete(id) 
    res.json({ msg: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error al eliminar el cliente' })
  }
}

export {
  listarClientes,
  detalleCliente,
  actualizarCliente,
  cambiarEstadoCliente,
  eliminarCliente
}
