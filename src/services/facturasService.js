// services/facturaService.js
import api from './http';

export async function obtenerFacturas(dni) {
  try {
    const response = await api.get(`/api/facturas/${dni}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    return [];
  }
}
