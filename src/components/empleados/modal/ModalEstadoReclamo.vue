<template>
    <div class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal-container">
        <button class="modal-close" @click="$emit('cerrar')">✕</button>
  
        <h2 class="modal-title">
          Detalles del Reclamo #{{ reclamo.ID_RECLAMO }}
        </h2>
  
        <div class="estado-buttons">
          <button
            :class="['btn-estado', 'pendiente', localEstado === 'Pendiente' && 'activo']"
            @click="localEstado = 'Pendiente'"
          >
            Pendiente
          </button>
          <button
            :class="['btn-estado', 'enproceso', localEstado === 'En proceso' && 'activo']"
            @click="localEstado = 'En proceso'"
          >
            En proceso
          </button>
          <button
            :class="['btn-estado', 'resuelto', localEstado === 'Resuelto' && 'activo']"
            @click="localEstado = 'Resuelto'"
          >
            Resuelto
          </button>
        </div>
  
        <div class="modal-grid">
            <p><strong>Nombre:</strong> {{ reclamo.cliente.nombre }}</p>
            <p><strong>DNI:</strong> {{ reclamo.cliente.dni }}</p>
  <p><strong>Fecha del reclamo:</strong> {{ reclamo.fecha }} {{ reclamo.hora }}</p>

  <p><strong>Suministro:</strong> {{ reclamo.numeroSuministro }}</p>
  <p><strong>Código Postal:</strong> {{ reclamo.codigo_postal }}</p>

  <p><strong>Barrio:</strong> {{ reclamo.barrio }}</p>
  <p><strong>Calle:</strong> {{ reclamo.calle }}</p>

  <p><strong>Medidor:</strong> {{ reclamo.medidor }}</p>
  <p><strong>Descripción:</strong> {{ reclamo.descripcion }}</p>


</div>

        <div class="modal-actions">
          <button @click="$emit('cerrar')" class="btn-cancelar">Cancelar</button>
          <button
            @click="$emit('updateEstado')"
            :disabled="loading"
            class="btn-confirmar"
          >
            {{ loading ? 'guardando...' : 'Guardar' }}
          </button>
        </div>
  
        <p v-if="error" class="modal-error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    reclamo: Object,
    error: String,
    loading: Boolean,
    nuevoEstado: String
  });
  
  const emit = defineEmits(['cerrar', 'updateEstado', 'update:nuevoEstado']);
  
  const localEstado = ref(props.nuevoEstado || '');
  
  watch(localEstado, (nuevo) => {
    emit('update:nuevoEstado', nuevo);
  });
  
  watch(() => props.nuevoEstado, (nuevo) => {
    localEstado.value = nuevo;
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 9999;
  }
  
  .modal-container {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 680px;
    width: 100%;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    animation: fadeIn 0.25s ease-out;
  }
  
  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 1.25rem;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  .modal-close:hover {
    color: #111827;
  }
  
  .estado-buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  
  .btn-estado {
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-estado.pendiente {
    background-color: #fef3c7;
    color: #b45309;
    border-color: #fde68a;
  }
  .btn-estado.pendiente.activo {
    background-color: #fde68a;
    border-color: #fcd34d;
    color: #78350f;
    border: 2px solid rgba(0, 0, 0, 0.295);
  }
  
  .btn-estado.enproceso {
    background-color: #dbeafe;
    color: #1e40af;
    border-color: #bfdbfe;
  }
  .btn-estado.enproceso.activo {
    background-color: #bfdbfe;
    border-color: #93c5fd;
    color: #1e3a8a;
    border: 2px solid rgba(0, 0, 0, 0.295);

  }
  
  .btn-estado.resuelto {
    background-color: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
    
  }
  .btn-estado.resuelto.activo {
    background-color: #bbf7d0;
    border-color: #86efac;
    color: #166534;
    border: 2px solid rgba(0, 0, 0, 0.295);

  }
  
  .modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 1rem;
    font-size: 0.95rem;
    color: #374151;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn-cancelar,
  .btn-confirmar {
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.95rem;
  }
  
  .btn-cancelar {
    background-color: #f3f4f6;
    color: #374151;
  }
  .btn-cancelar:hover {
    background-color: #e5e7eb;
  }
  
  .btn-confirmar {
    background-color: #1e40af;
    color: white;
  }
  .btn-confirmar:hover {
    background-color: #1e3a8a;
  }
  .btn-confirmar:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  
  .modal-error {
    color: #b91c1c;
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: right;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @media (max-width: 620px) {
    .modal-overlay {
    width: 100vw;
    height: 100vh;
  }

  .modal-container {
    padding: 1.25rem 1rem;
    border-radius: 0.75rem;
    max-width: 90vw;
    margin-right: 8%;

  }

  .modal-title {
    font-size: 1.25rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .estado-buttons {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .modal-grid {
    grid-template-columns: 1fr 1fr; /* Mantener dos columnas */
    font-size: 0.9rem;
    gap: 0.5rem 0.75rem;
  }

  .modal-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-cancelar,
  .btn-confirmar {
    width: 100%;
    font-size: 0.9rem;
    padding: 0.6rem;
  }
}

  </style>
  