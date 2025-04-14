import api from './http';

// 🔹 BOT: solo los últimos 5 reclamos
export async function obtenerReclamos(dni) {
  try {
    const response = await api.get(`/api/reclamos/${dni}`);
    return response.data && typeof response.data === 'object' ? response.data : { reclamos: [] };
  } catch (error) {
    console.error('Error al obtener reclamos (limitado):', error);
    return { reclamos: [] };
  }
}

// 🔹 FRONTEND: todos los reclamos por DNI (nuevo endpoint)
export async function obtenerTodosLosReclamosPorDni(dni) {
  try {
    const response = await api.get(`/api/reclamos/todos/${dni}`);
    return response.data && Array.isArray(response.data.reclamos) ? response.data : { reclamos: [] };
  } catch (error) {
    console.error('Error al obtener todos los reclamos:', error);
    return { reclamos: [] };
  }
}

export async function obtenerTodosLosReclamos() {
  try {
    const response = await api.get('/api/reclamos/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los reclamos del sistema:', error);
    return [];
  }
}

export async function crearReclamo(dni, descripcion) {
  try {
    const response = await api.post(`/api/reclamos/${dni}`, {
      descripcion,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function actualizarEstadoReclamo(idReclamo, nuevoEstado) {
  try {
    const response = await api.put(`/api/reclamos/${idReclamo}`, { estado: nuevoEstado });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del reclamo:', error);
    throw error;
  }
}
