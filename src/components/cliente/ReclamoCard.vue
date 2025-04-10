<template>
  <div
    class="w-full p-4 bg-white/80 border border-gray-200 rounded-xl shadow-sm
           hover:shadow-md hover:brightness-105 hover:-translate-y-0.5
           hover:border-blue-400 transition-all duration-500 ease-in-out cursor-pointer backdrop-blur-sm
           max-w-sm xl:max-w-xs 2xl:max-w-sm transform-gpu"
  >
    <!-- Encabezado -->
    <div class="flex justify-between items-start mb-2 border-b pb-2">
      <div class="flex flex-col">
        <h3
          class="font-semibold text-sm xl:text-xs bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent"
        >
          Reclamo #{{ reclamo.ID_RECLAMO }}
        </h3>
        <p class="text-gray-500 text-xs xl:text-[0.65rem]">
          {{ reclamo.fecha }} {{ reclamo.hora }}
        </p>
      </div>

      <span
        :class="estadoClass"
        class="text-xs xl:text-[0.65rem] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors duration-300"
      >
        ● {{ reclamo.estado }}
      </span>
    </div>

    <!-- Cuerpo -->
    <div class="grid grid-cols-2 gap-2 xl:gap-1.5 text-sm xl:text-xs text-gray-700">
      <p>
        <strong class="text-blue-800">Medidor:</strong> {{ reclamo.medidor }}
      </p>
      <p>
        <strong class="text-blue-800">Suministro:</strong> {{ reclamo.numeroSuministro }}
      </p>
      <p class="col-span-2">
        <strong class="text-blue-800">Descripción:</strong> {{ descripcionRecortada }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  reclamo: {
    type: Object,
    required: true,
    default: () => ({
      ID_RECLAMO: 0,
      fecha: '',
      hora: '',
      estado: '',
      medidor: '',
      numeroSuministro: '',
      descripcion: '',
    }),
  },
})

const descripcionRecortada = computed(() => {
  const texto = props.reclamo.descripcion || ''
  return texto.length > 30 ? texto.slice(0, 20) + '...' : texto
})

const estadoClass = computed(() => {
  switch (props.reclamo.estado) {
    case 'Resuelto':
      return 'bg-green-100 text-green-700 border-green-300'
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 'En proceso':
      return 'bg-blue-100 text-blue-700 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
})
</script>
