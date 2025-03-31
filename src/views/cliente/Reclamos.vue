<template>
  <div class="px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h2 class="text-2xl font-semibold text-slate-800">Mis Reclamos</h2>
      <button
        @click="abrirModalCrear"
        class="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base sm:text-sm px-5 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300"
      >
        + Hacer Reclamo
      </button>
    </div>

    <div class="overflow-y-auto max-h-[70vh] pr-2">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    <ReclamoCard
      v-for="reclamo in reclamos"
      :key="reclamo.ID_RECLAMO"
      :reclamo="reclamo"
      @click="abrirDetalle(reclamo)"
    />
  </div>
</div>

    <CrearReclamoModal
      v-if="mostrarModalCrear"
      @cerrar="mostrarModalCrear = false"
      @reclamoCreado="cargarReclamos"
    />

    <ReclamoDetalleModal
      v-if="reclamoSeleccionado"
      :reclamo="reclamoSeleccionado"
      @cerrar="reclamoSeleccionado = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerReclamos as obtenerReclamosDesdeServicio } from '@/services/reclamosService';
import ReclamoCard from '@/components/cliente/ReclamoCard.vue';
import CrearReclamoModal from '@/components/cliente/CrearReclamoModal.vue';
import ReclamoDetalleModal from '@/components/cliente/ReclamoDetalleModal.vue';

const router = useRouter();
const reclamos = ref([]);
const mostrarModalCrear = ref(false);
const reclamoSeleccionado = ref(null);
const dniUsuario = localStorage.getItem('dni');

const abrirModalCrear = () => {
  mostrarModalCrear.value = true;
};

const abrirDetalle = (reclamo) => {
  reclamoSeleccionado.value = reclamo;
};

const cargarReclamos = async () => {
  if (!dniUsuario) {
    router.push('/login');
    return;
  }

  try {
    const response = await obtenerReclamosDesdeServicio(dniUsuario);
    // Verificar si response.reclamos es un array; si no, asignar un array vacío
    const reclamosData = Array.isArray(response.reclamos) ? response.reclamos : [];
    reclamos.value = reclamosData
      .sort((a, b) => new Date(b.FECHA_RECLAMO) - new Date(a.FECHA_RECLAMO))
      .map(reclamo => ({
        ID_RECLAMO: reclamo.ID_RECLAMO,
        fecha: new Date(reclamo.FECHA_RECLAMO).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        hora: new Date(reclamo.FECHA_RECLAMO).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        estado: reclamo.ESTADO,
        calle: reclamo.calle,
        barrio: reclamo.barrio,
        codigo_postal: reclamo.codigo_postal,
        medidor: reclamo.medidor,
        numeroSuministro: reclamo.numeroSuministro,
        descripcion: reclamo.DESCRIPCION,
      }));
  } catch (error) {
    console.error('Error al obtener reclamos:', error);
    reclamos.value = [];
  }
};

onMounted(cargarReclamos);
</script>