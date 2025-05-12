import Usuario from '../models/Usuario.js'
import mongoose from 'mongoose'

// Listar solo clientes activos
const listarClientes = async (req, res) => {
  const clientes = await Usuario.find({ rol: 'cliente', estado: true }).select('-password -__v')
  res.status(200).json(clientes)
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

export {
  listarClientes,
  detalleCliente,
  actualizarCliente,
  cambiarEstadoCliente
}
