// src/services/usuariosService.js
import api from './http';

// 🔹 Obtener datos de un usuario por DNI
export async function obtenerUsuario(dni) {
  try {
    const response = await api.get(`/api/usuarios/${dni}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

// 🔹 Actualizar datos de usuario por DNI
export async function actualizarDatosUsuario(dni, datos) {
  try {
    const response = await api.put(`/api/usuarios/${dni}`, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    throw error;
  }
}
