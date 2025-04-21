<template>
  <div
    @click="emitirDetalles"
    class="w-full bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer backdrop-blur-sm
           max-w-sm xl:max-w-xs 2xl:max-w-sm relative"
  >
    <!-- Borde superior según prioridad -->
    <div :class="prioridadBarClass" class="absolute top-0 left-0 w-full h-1 rounded-t-xl"></div>

    <!-- Contenido principal -->
    <div class="p-4">
      <!-- Encabezado -->
      <div class="border-b pb-2 mb-2 flex justify-between items-start">
        <div class="flex flex-col">
          <h3 class="text-blue-800 font-semibold text-sm xl:text-xs">R. #{{ ID_RECLAMO }}</h3>
          <p class="text-gray-500 text-xs xl:text-[0.65rem]">{{ fecha }} {{ hora }}</p>
          <p class="text-gray-600 text-[0.65rem] xl:text-[0.6rem] mt-0.2 leading-tight">
            {{ cliente.nombre }}<br>
            <span class="text-gray-400">(DNI: {{ cliente.dni }})</span>
          </p>
        </div>

        <span
          :class="estadoClass"
          class="text-xs xl:text-[0.65rem] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border"
        >
          ● {{ estado }}
        </span>
      </div>

      <!-- Cuerpo de la tarjeta -->
      <div class="grid grid-cols-2 gap-2 xl:gap-1.5 text-sm xl:text-xs text-gray-700">
        <p><strong class="text-blue-800">Dirección:</strong> {{ truncatedDireccion }}</p>
        <p><strong class="text-blue-800">Suministro:</strong> {{ numeroSuministro }}</p>
        <p><strong class="text-blue-800">Medidor:</strong> {{ medidor }}</p>
        <p class="col-span-1 break-words overflow-hidden leading-snug text-sm xl:text-xs">
          <strong class="text-blue-800">Descripción:</strong> {{ truncatedDescripcion }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const {
  ID_RECLAMO,
  fecha,
  hora,
  estado,
  cliente,
  numeroSuministro,
  medidor,
  descripcion,
  calle,
  barrio,
  codigo_postal,
  prioridad,
} = defineProps({
  ID_RECLAMO: Number,
  fecha: String,
  hora: String,
  estado: String,
  cliente: Object,
  numeroSuministro: String,
  medidor: String,
  descripcion: String,
  calle: String,
  barrio: String,
  codigo_postal: String,
  prioridad: String,
});

const emit = defineEmits(['verDetalles']);

const truncatedDescripcion = computed(() => {
  const limite = window.innerWidth <= 620 ? 30 : 50;
  return descripcion.length > limite ? `${descripcion.substring(0, limite)}...` : descripcion;
});

const truncatedDireccion = computed(() => {
  const limite = window.innerWidth <= 620 ? 20 : 40;
  const direccion = `${calle}, ${barrio} (CP ${codigo_postal})`;
  return direccion.length > limite ? `${direccion.substring(0, limite)}...` : direccion;
});

const estadoClass = computed(() => {
  switch (estado) {
    case 'Resuelto':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'En proceso':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
});

const prioridadBarClass = computed(() => {
  switch (prioridad) {
    case 'Alta':
      return 'bg-red-500';
    case 'Media':
      return 'bg-yellow-400';
    case 'Baja':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
});

const emitirDetalles = () => {
  emit('verDetalles', {
    ID_RECLAMO,
    fecha,
    hora,
    estado,
    prioridad,
    cliente,
    numeroSuministro,
    medidor,
    descripcion,
    calle,
    barrio,
    codigo_postal,
  });
};
</script>
