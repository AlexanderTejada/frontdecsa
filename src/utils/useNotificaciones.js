// utils/useNotificaciones.js
import { ref } from 'vue'

const notificaciones = ref([])

export function useNotificaciones() {
  const agregarNotificacion = (reclamo, tipo = 'info') => {
    const id = Date.now()

    const mensaje = `🆕 Reclamo #${reclamo.id_reclamo}\n👤 ${reclamo.cliente?.nombre || 'Usuario desconocido'}\n📄 ${reclamo.descripcion || 'Sin descripción'}`

    notificaciones.value.push({ id, mensaje, tipo })
    setTimeout(() => {
      notificaciones.value = notificaciones.value.filter(n => n.id !== id)
    }, 4000)
  }

  return {
    notificaciones,
    agregarNotificacion
  }
}