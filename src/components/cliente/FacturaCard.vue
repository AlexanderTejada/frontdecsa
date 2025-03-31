<template>
  <div
    class="w-full p-4 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer backdrop-blur-sm
           max-w-sm xl:max-w-xs 2x2:max-w-sm"
  >
    <!-- Encabezado -->
    <div class="flex justify-between items-start mb-2 border-b pb-2">
      <div class="flex flex-col">
        <h3 class="text-blue-800 font-semibold text-sm xl:text-xs transition-colors hover:text-blue-900">
          Factura #{{ factura.NumeroComprobante }}
        </h3>
        <p class="text-gray-500 text-xs xl:text-[0.65rem] transition-colors hover:text-slate-600">
          {{ factura.FechaEmision }}
        </p>
      </div>

      <span
        :class="estadoClass"
        class="text-xs xl:text-[0.65rem] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all"
      >
        ● {{ factura.Estado }}
      </span>
    </div>

    <!-- Detalle -->
    <div class="grid grid-cols-2 gap-2 xl:gap-1.5 text-sm xl:text-xs text-gray-700 hover:text-slate-700">
      <div>
        <p><strong class="text-blue-800 hover:text-blue-900">Vencimiento:</strong> {{ factura.Vencimiento }}</p>
        <p><strong class="text-blue-800 hover:text-blue-900">Medidor:</strong> {{ factura.NumeroMedidor }}</p>
      </div>
      <div>
        <p><strong class="text-blue-800 hover:text-blue-900">Monto:</strong> ${{ factura.Total.toFixed(2) }}</p>
        <p><strong class="text-blue-800 hover:text-blue-900">Consumo:</strong> {{ factura.Consumo }} kWh</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  factura: {
    type: Object,
    required: true,
    default: () => ({
      NumeroComprobante: '',
      Estado: '',
      FechaEmision: '',
      Vencimiento: '',
      Total: 0,
      NumeroMedidor: '',
      Consumo: 0,
    }),
  },
});

const estadoClass = computed(() => {
  switch (props.factura.Estado) {
    case 'Pagada':
      return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200 hover:border-green-400';
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 hover:border-yellow-400';
    case 'Vencida':
      return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:border-red-400';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
  }
});
</script>
