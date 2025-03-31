<template>
    <div class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal-container">
        <button class="modal-close" @click="$emit('cerrar')">✕</button>
  
        <h2 class="modal-title">Reclamo #{{ reclamo.ID_RECLAMO }}</h2>
  
        <div class="modal-contenido">
          <p><strong>Estado:</strong> {{ reclamo.estado }}</p>
          <p><strong>Fecha:</strong> {{ reclamo.fecha }} - {{ reclamo.hora }}</p>
          <p><strong>Medidor:</strong> {{ reclamo.medidor }}</p>
          <p><strong>Suministro:</strong> {{ reclamo.numeroSuministro }}</p>
          <p><strong>Descripción:</strong><br /> {{ reclamo.descripcion }}</p>
        </div>
  
        <div class="modal-actions">
          <button @click="$emit('cerrar')" class="btn-cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    reclamo: Object
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .modal-container {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    position: relative;
    animation: fadeIn 0.25s ease-out;
  }
  
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #6b7280;
    cursor: pointer;
  }
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .modal-contenido {
    font-size: 0.95rem;
    color: #374151;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
  
  .btn-cerrar {
    padding: 0.5rem 1.5rem;
    background-color: #1e3a8a;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .btn-cerrar:hover {
    background-color: #1d4ed8;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  </style>
  