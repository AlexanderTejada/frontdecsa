// src/services/reclamosService.js

import api from './http'

// 🔹 Listar todos los reclamos del sistema (incluye datos de cliente)
export async function obtenerTodosLosReclamos() {
  try {
    const res = await api.get('/api/reclamos/')
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('Error al obtener todos los reclamos del sistema:', error)
    return []
  }
}

export async function obtenerTodosLosReclamosPorDni(dni) {
  try {
    const res = await api.get(`/api/reclamos/todos/${dni}`);
    return res.data?.reclamos || [];
  } catch (error) {
    console.error('Error al obtener todos los reclamos por DNI:', error);
    return [];
  }
}

// 🔹 Últimos 5 reclamos por DNI (BOT o dashboard)
export async function obtenerReclamos(dni, limit = 5) {
  try {
    const res = await api.get(`/api/reclamos/${dni}`)
    const reclamos = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.reclamos)
      ? res.data.reclamos
      : []

    return reclamos.slice(-limit)
  } catch (error) {
    console.error('Error al obtener reclamos (limitado):', error)
    return []
  }
}

// 🔹 Crear un nuevo reclamo
export async function crearReclamo(dni, descripcion, prioridad = 'Media') {
  try {
    const res = await api.post(`/api/reclamos/${dni}`, {
      descripcion,
      prioridad
    })
    return res.data
  } catch (error) {
    console.error('Error al crear reclamo:', error)
    throw error
  }
}

// 🔹 Actualizar estado de un reclamo por ID
export async function actualizarEstadoReclamo(idReclamo, estado) {
  try {
    const res = await api.put(`/api/reclamos/${idReclamo}`, { estado })
    return res.data
  } catch (error) {
    console.error('Error al actualizar estado del reclamo:', error)
    throw error
  }
}
