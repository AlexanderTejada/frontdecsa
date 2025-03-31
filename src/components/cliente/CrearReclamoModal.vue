<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Nuevo Reclamo</h3>
      <form @submit.prevent="enviarReclamo">
        <label for="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          v-model="descripcion"
          rows="4"
          placeholder="Describe el problema..."
        ></textarea>

        <div class="modal-buttons">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Hacer Reclamo' }}
          </button>
          <button type="button" class="cancel" @click="$emit('cerrar')">
            Cancelar
          </button>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { crearReclamo as crearReclamoServicio } from '@/services/reclamosService';

const emit = defineEmits(['cerrar', 'reclamoCreado']);

const descripcion = ref('');
const loading = ref(false);
const error = ref('');
const dniUsuario = localStorage.getItem('dni');

const enviarReclamo = async () => {
  if (!descripcion.value.trim()) {
    error.value = 'La descripción no puede estar vacía.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await crearReclamoServicio(dniUsuario, descripcion.value);
    descripcion.value = '';
    emit('cerrar');
    emit('reclamoCreado');
  } catch (err) {
    console.error('Error al crear reclamo:', err);
    // Mostrar más detalles del error
    if (err.response) {
      console.error('Respuesta del servidor:', err.response.data);
      console.error('Código de estado:', err.response.status);
      error.value = `Error al enviar el reclamo: ${err.response.data.error || err.response.statusText}`;
    } else if (err.request) {
      console.error('No se recibió respuesta del servidor:', err.request);
      error.value = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    } else {
      console.error('Error al configurar la solicitud:', err.message);
      error.value = `Error al enviar el reclamo: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.modal {
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.25s ease-out;
}

.modal h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1rem;
  text-align: center;
}

textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  resize: vertical;
  background-color: #f9fafb;
  transition: border-color 0.2s ease;
  max-width: 90%;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #ffffff;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
}

button[type="submit"] {
  background-color: #1e40af;
  color: white;
}

button[type="submit"]:hover {
  background-color: #1e3a8a;
}

button.cancel {
  background-color: #f3f4f6;
  color: #374151;
}

button.cancel:hover {
  background-color: #e5e7eb;
}

button[disabled] {
  background-color: #9ca3af !important;
  cursor: not-allowed;
}

.error-text {
  margin-top: 1rem;
  color: #b91c1c;
  font-size: 0.9rem;
  text-align: right;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>