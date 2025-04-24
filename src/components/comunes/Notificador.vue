<template>
    <transition-group name="toast-slide" tag="div" class="fixed bottom-6 right-6 z-[1000] flex flex-col gap-4">
      <div
        v-for="noti in notificaciones"
        :key="noti.id"
        :class="[
          'px-5 py-3 rounded-lg shadow-lg min-w-[280px] max-w-sm relative border-l-4 animate-fadeIn',
          noti.tipo === 'exito' ? 'bg-green-600 text-white border-green-400' :
          noti.tipo === 'error' ? 'bg-red-600 text-white border-red-400' :
          noti.tipo === 'advertencia' ? 'bg-yellow-600 text-white border-yellow-400' :
          'bg-blue-700 text-white border-blue-400'
        ]"
      >
        <p class="text-sm font-bold leading-snug whitespace-pre-line">
          {{ noti.mensaje }}
        </p>
        <button
          @click="cerrarNotificacion(noti.id)"
          class="absolute top-2 right-2 text-white hover:text-gray-200 text-xs"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const notificaciones = ref([])
  
  function mostrarNotificacion(mensaje, tipo = 'info') {
    const id = Date.now()
    notificaciones.value.push({ id, mensaje, tipo })
  
    setTimeout(() => {
      notificaciones.value = notificaciones.value.filter(n => n.id !== id)
    }, 5000)
  }
  
  function cerrarNotificacion(id) {
    notificaciones.value = notificaciones.value.filter(n => n.id !== id)
  }
  
  onMounted(() => {
    window.__notificadorGlobal = mostrarNotificacion
  })
  </script>
  
  <style scoped>
  .toast-slide-enter-active,
  .toast-slide-leave-active {
    transition: all 0.5s ease;
  }
  .toast-slide-enter-from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  .toast-slide-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }
  </style>