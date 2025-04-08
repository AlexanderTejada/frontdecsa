<template>
  <div class="px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h2 class="text-2xl font-semibold text-slate-800">Mis Facturas</h2>
      <button
        @click="irAlAnioActual"
        class="cursor-pointer relative text-white font-semibold text-base sm:text-sm px-5 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-200 hover:from-indigo-700 hover:to-sky-500 transition-all duration-300 overflow-hidden"
      >
        <span class="relative z-10">Ir al año actual</span>
        <span class="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-500"></span>
      </button>
    </div>

    <!-- Navegación por año -->
    <div class="flex items-center justify-center mb-6 gap-4 flex-wrap">
      <button
        @click="cambiarAnio(-1)"
        class="cursor-pointer p-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Año anterior"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </button>

      <span class="text-lg font-medium text-slate-800">Año {{ anioActual }}</span>

      <button
        @click="cambiarAnio(1)"
        class="cursor-pointer p-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Año siguiente"
      >
        <ChevronRightIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Contenido -->
    <div class="relative">
      <!-- Sin resultados -->
      <div
        v-if="facturasFiltradas.length === 0"
        class="text-center text-slate-500 text-lg sm:text-base py-8"
      >
        No hay facturas disponibles para este año.
      </div>

      <!-- Resultados con scroll -->
      <div
        v-else
        class="overflow-y-auto max-h-[60vh] pr-2 border border-slate-300 rounded-xl shadow-md bg-slate-100/70 backdrop-blur-md p-4 transition-all duration-300"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <FacturaCard
            v-for="factura in facturasFiltradas"
            :key="factura.NumeroComprobante"
            :factura="factura"
            @click="abrirModal(factura)"
          />
        </div>
      </div>

      <!-- Sombra inferior para scroll -->
      <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-xl bg-gradient-to-t from-slate-100/80 via-slate-100/60 to-transparent"></div>
    </div>

    <!-- Modal de detalle -->
    <Transition name="modal-fade">
  <div
    v-if="facturaSeleccionada"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-transform duration-300">
      <h3 class="text-xl font-semibold text-blue-900 mb-4">
        Factura #{{ facturaSeleccionada.NumeroComprobante }}
      </h3>

      <div class="grid grid-cols-2 gap-3 text-sm text-slate-700">
        <p><strong>Estado:</strong> {{ facturaSeleccionada.Estado }}</p>
        <p><strong>Emisión:</strong> {{ facturaSeleccionada.FechaEmision }}</p>
        <p><strong>Vencimiento:</strong> {{ facturaSeleccionada.Vencimiento }}</p>
        <p><strong>Monto:</strong> ${{ facturaSeleccionada.Total.toFixed(2) }}</p>
        <p><strong>Consumo:</strong> {{ facturaSeleccionada.Consumo }} kWh</p>
        <p><strong>Medidor:</strong> {{ facturaSeleccionada.NumeroMedidor }}</p>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="facturaSeleccionada = null"
          class="cursor-pointer px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerFacturas as obtenerFacturasDesdeServicio } from '@/services/facturasService';
import FacturaCard from '@/components/cliente/FacturaCard.vue';
import Spinner from '@/components/comunes/Spinner.vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const facturas = ref([]);
const facturaSeleccionada = ref(null);
const router = useRouter();
const dniUsuario = localStorage.getItem('dni');
const loading = ref(true);

const anioPresente = new Date().getFullYear();
const anioActual = ref(anioPresente);

const irAlAnioActual = () => {
  anioActual.value = anioPresente;
};

const cambiarAnio = (delta) => {
  anioActual.value += delta;
};

const cargarFacturas = async () => {
  if (!dniUsuario) {
    router.push('/login');
    return;
  }

  loading.value = true;

  try {
    const response = await obtenerFacturasDesdeServicio(dniUsuario);
    facturas.value = Array.isArray(response.facturas) ? response.facturas : [];
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    facturas.value = [];
  } finally {
    loading.value = false;
  }
};

const facturasFiltradas = computed(() => {
  return facturas.value.filter(factura => {
    const fecha = new Date(factura.FechaEmision);
    return fecha.getFullYear() === anioActual.value;
  });
});

const abrirModal = (factura) => {
  facturaSeleccionada.value = factura;
};

onMounted(cargarFacturas);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

/* No hay animaciones activas */
</style>
