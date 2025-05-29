<template>
  <div
    @click="emitirDetalles"
    :class="[
      'relative bg-white rounded-lg shadow p-4 border-t-4 transition cursor-pointer hover:shadow-md',
      baseBordeColor,
      hoverBordeColor,
      esNuevo ? 'animacion-borde' : ''
    ]"
  >
    <!-- ID del reclamo en la esquina superior izquierda -->
    <span class="absolute top-2 left-3 text-xs font-bold text-indigo-500">
      #{{ id_reclamo }}
    </span>

    <!-- PRIORIDAD COMO TEXTO COLOREADO -->
    <div class="mb-2 text-center text-xs font-bold tracking-widest uppercase"
         :class="prioridadTituloClass">
      Prioridad: {{ prioridad || 'Media' }}
    </div>

    <!-- CABECERA DEL CLIENTE -->
    <div class="mb-2">
      <h3 class="text-base font-semibold text-center" :class="nombreClienteClass">
        {{ cliente?.nombre || 'Desconocido' }}
      </h3>
      <p class="text-xs text-slate-600 text-center">DNI: {{ cliente?.dni || 'Sin DNI' }}</p>
    </div>

    <!-- DESCRIPCIÓN Y UBICACIÓN -->
    <div class="mb-2 text-sm text-slate-600">
      <p class="text-xs truncate">
        <span class="font-medium text-slate-700">Descripción:</span>
        {{ descripcion || 'Sin descripción' }}
      </p>
      <p class="text-xs mt-1 truncate">
        <span class="font-medium text-slate-700">Dirección:</span>
        {{ calle || 'Sin calle' }} — {{ barrio || 'Sin barrio' }}
      </p>
    </div>

    <!-- FECHAS Y ESTADO -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 text-xs text-slate-600">
      <div>
        <p><span class="font-medium text-slate-600">Fecha:</span> {{ fecha || 'Sin fecha' }} {{ hora || '' }}</p>
        <p v-if="fechaCierre">
          <span class="font-medium text-slate-700">Cierre:</span> {{ fechaCierre }} {{ horaCierre }}
        </p>
      </div>
      <div>
        <span class="px-2 py-0.5 rounded-full font-medium"
              :class="{
                'bg-orange-100 text-orange-500': estado === 'Pendiente',
                'bg-blue-100 text-blue-700': estado === 'En proceso',
                'bg-green-100 text-green-700': estado === 'Resuelto',
                'bg-slate-300 text-slate-800': !['Pendiente','En proceso','Resuelto'].includes(estado)
              }">
          Estado: {{ estado || 'Pendiente' }}
        </span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'

const emit = defineEmits(['verDetalles'])

const props = defineProps({
  id_reclamo: [String, Number],
  cliente: Object,
  prioridad: String,
  estado: String,
  numeroSuministro: String,
  medidor: String,
  descripcion: String,
  calle: String,
  barrio: String,
  codigo_postal: String,
  fecha: String,
  hora: String,
  fechaCierre: String,
  horaCierre: String
})

const emitirDetalles = () => {
  emit('verDetalles', { ...props })
}

const baseBordeColor = computed(() => {
  if (props.estado === 'Resuelto') return 'border-t-green-400'
  switch (props.prioridad) {
    case 'Alta': return 'border-t-red-400'
    case 'Media': return 'border-t-yellow-400'
    case 'Baja': return 'border-t-indigo-300'
    default: return 'border-t-slate-300'
  }
})

const hoverBordeColor = computed(() => {
  if (props.estado === 'Resuelto') return 'hover:border-t-green-500'
  switch (props.prioridad) {
    case 'Alta': return 'hover:border-t-red-600'
    case 'Media': return 'hover:border-t-yellow-500'
    case 'Baja': return 'hover:border-t-indigo-500'
    default: return 'hover:border-t-slate-400'
  }
})

const prioridadTituloClass = computed(() => {
  if (props.estado === 'Resuelto') return 'text-green-700'
  switch (props.prioridad) {
    case 'Alta': return 'text-red-600'
    case 'Media': return 'text-yellow-600'
    case 'Baja': return 'text-indigo-500'
    default: return 'text-slate-500'
  }
})

const nombreClienteClass = computed(() => {
  if (props.estado === 'Resuelto') return 'text-green-700'
  switch (props.prioridad) {
    case 'Alta': return 'text-red-600'
    case 'Media': return 'text-yellow-600'
    case 'Baja': return 'text-indigo-500'
    default: return 'text-slate-700'
  }
})
</script>


<style scoped>
@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(56, 189, 248, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }
}

.animacion-borde {
  animation: pulse-border 2s ease-out infinite;
  border-color: #3b82f6 !important; /* Azul vibrante */
}
</style>
