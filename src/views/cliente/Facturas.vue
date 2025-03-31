<template>
  <div class="relative">
    <Spinner v-if="loading" />

    <div v-else class="px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
      <h2 class="text-2xl font-semibold text-slate-800 mb-8">Mis Facturas</h2>

      <!-- Navegación por año -->
      <div class="flex items-center justify-center mb-6 gap-4 flex-wrap">
        <button
          @click="anioActual--"
          class="px-3 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700"
        >
          ←
        </button>

        <span class="text-lg font-medium text-slate-800">
          Año {{ anioActual }}
        </span>

        <button
          @click="anioActual++"
          class="px-3 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700"
        >
          →
        </button>

        <button
          @click="irAlAnioActual"
          class="ml-4 px-4 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md shadow-sm"
        >
          Ir al año actual
        </button>
      </div>

      <!-- Sin resultados -->
      <div v-if="facturasFiltradas.length === 0" class="text-center text-slate-500 text-lg sm:text-base py-8">
        No hay facturas disponibles para este año.
      </div>

      <!-- Resultados con scroll -->
      <div v-else class="overflow-y-auto max-h-[70vh] pr-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <FacturaCard
            v-for="factura in facturasFiltradas"
            :key="factura.NumeroComprobante"
            :factura="factura"
            @click="abrirModal(factura)"
          />
        </div>
      </div>

      <!-- Modal de detalle -->
      <div v-if="facturaSeleccionada" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
              class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerFacturas as obtenerFacturasDesdeServicio } from '@/services/facturasService';
import FacturaCard from '@/components/cliente/FacturaCard.vue';
import Spinner from '@/components/comunes/Spinner.vue';

const facturas = ref([]);
const facturaSeleccionada = ref(null);
const router = useRouter();
const dniUsuario = localStorage.getItem('dni');
const loading = ref(true);

// Año actual (constante) y año visualizado (reactivo)
const anioPresente = new Date().getFullYear();
const anioActual = ref(anioPresente);

const irAlAnioActual = () => {
  anioActual.value = anioPresente;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
