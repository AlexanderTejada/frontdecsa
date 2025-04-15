<template>
  <div class="px-6 py-12 sm:px-6 sm:py-10 md:px-10 lg:px-16 xl:px-20 max-w-7xl mx-auto w-full">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
      <h2 class="text-2xl font-semibold text-slate-800">Reclamos de Todos los Clientes</h2>
      <button
        @click="irAlMesActual"
        class="cursor-pointer relative text-white font-medium text-base sm:text-sm px-6 py-2.5 sm:px-5 sm:py-2 rounded-lg shadow-sm bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-300 hover:from-indigo-700 hover:to-sky-500 transition-all duration-300 overflow-hidden"
      >
        <span class="relative z-10">Mes actual</span>
        <span class="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-500"></span>
      </button>
    </div>

    <!-- Navegación por mes y año -->
    <div class="flex items-center justify-center mb-8 gap-6 flex-wrap">
      <button
        @click="mesAnterior"
        class="cursor-pointer px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Mes anterior"
      >
        ‹
      </button>

      <span class="text-lg font-medium text-slate-800">{{ meses[mesActual] }} {{ anioActual }}</span>

      <button
        @click="mesSiguiente"
        class="cursor-pointer px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Mes siguiente"
      >
        ›
      </button>
    </div>

  <!-- Filtros -->
<div class="flex flex-wrap gap-4 mb-6">
  <input
    v-model="busqueda"
    type="text"
    placeholder="Nombre, DNI, medidor o suministro"
    class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-[240px] md:w-[280px] lg:w-[300px]"
  />

  <select
    v-model="filtroEstado"
    class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white w-full sm:w-[160px]"
  >
    <option value="Todos">Todos los estados</option>
    <option value="Pendiente">Pendiente</option>
    <option value="En proceso">En proceso</option>
    <option value="Resuelto">Resuelto</option>
  </select>

  <select
    v-model="filtroBarrio"
    class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white w-full sm:w-[180px]"
  >
    <option value="Todos">Todos los barrios</option>
    <option
      v-for="barrio in barriosDisponibles"
      :key="barrio"
      :value="barrio"
    >
      {{ barrio }}
    </option>
  </select>
</div>

    <!-- Resultados -->
    <div class="relative">
      <div
        v-if="reclamosFiltrados.length === 0"
        class="text-center text-slate-500 text-lg sm:text-base py-8"
      >
        No hay reclamos disponibles para mostrar.
      </div>

      <div
        v-else
        class="overflow-y-auto max-h-[60vh] pr-2 border border-slate-300 rounded-xl shadow-md bg-slate-100/70 backdrop-blur-md p-6 transition-all duration-300"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
          <ReclamoCardEmpleados
            v-for="reclamo in reclamosFiltrados"
            :key="reclamo.ID_RECLAMO"
            v-bind="reclamo"
            @verDetalles="abrirModal(reclamo)"
          />
        </div>
      </div>

      <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-xl bg-gradient-to-t from-slate-100/80 via-slate-100/60 to-transparent"></div>
    </div>

    <!-- Modal con transición -->
    <Transition name="fade" mode="out-in">
      <ModalEstadoReclamo
        v-if="modalAbierto"
        :reclamo="reclamoSeleccionado"
        :loading="loading"
        :error="error"
        :nuevoEstado="nuevoEstado"
        @updateEstado="actualizarEstado"
        @cerrar="cerrarModal"
        @update:nuevoEstado="nuevoEstado = $event"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerTodosLosReclamos, actualizarEstadoReclamo } from '@/services/api';
import ReclamoCardEmpleados from '@/components/empleados/ReclamoCardEmpleados.vue';
import ModalEstadoReclamo from '@/components/empleados/modal/ModalEstadoReclamo.vue';

const reclamos = ref([]);
const busqueda = ref('');
const filtroEstado = ref('Todos');
const filtroBarrio = ref('Todos');

const modalAbierto = ref(false);
const reclamoSeleccionado = ref(null);
const nuevoEstado = ref('');
const loading = ref(false);
const error = ref('');

const fechaActual = new Date();
const anioActual = ref(fechaActual.getFullYear());
const mesActual = ref(fechaActual.getMonth());

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11;
    anioActual.value--;
  } else {
    mesActual.value--;
  }
};

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0;
    anioActual.value++;
  } else {
    mesActual.value++;
  }
};

const irAlMesActual = () => {
  anioActual.value = fechaActual.getFullYear();
  mesActual.value = fechaActual.getMonth();
};

const obtenerReclamos = async () => {
  try {
    const response = await obtenerTodosLosReclamos();
    if (!Array.isArray(response)) {
      console.error('La respuesta no es un array:', response);
      reclamos.value = [];
      return;
    }

    reclamos.value = response
      .sort((a, b) => new Date(b.FECHA_RECLAMO) - new Date(a.FECHA_RECLAMO))
      .map(reclamo => {
        const fechaReclamo = new Date(reclamo.FECHA_RECLAMO);
        const fechaCierre = reclamo.FECHA_CIERRE ? new Date(reclamo.FECHA_CIERRE) : null;

        return {
          ID_RECLAMO: reclamo.ID_RECLAMO,
          fecha: fechaReclamo.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          hora: fechaReclamo.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          fechaCierre: fechaCierre
            ? fechaCierre.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : null,
          horaCierre: fechaCierre
            ? fechaCierre.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            : null,
          estado: reclamo.ESTADO || 'Pendiente',
          cliente: {
            nombre: reclamo.cliente?.nombre || 'Desconocido',
            dni: reclamo.cliente?.dni || 'Sin DNI',
          },
          numeroSuministro: reclamo.numeroSuministro || 'N/A',
          medidor: reclamo.medidor || 'N/A',
          descripcion: reclamo.DESCRIPCION || 'Sin descripción',
          calle: reclamo.calle || 'Sin calle',
          barrio: reclamo.barrio || 'Sin barrio',
          codigo_postal: reclamo.codigo_postal || 'N/A',
        };
      });
  } catch (error) {
    console.error('Error al obtener reclamos:', error);
    reclamos.value = [];
  }
};

const barriosDisponibles = computed(() => {
  const barrios = new Set();
  reclamos.value.forEach(r => {
    if (r.barrio && r.barrio !== 'Sin barrio') {
      barrios.add(r.barrio);
    }
  });
  return Array.from(barrios).sort((a, b) => a.localeCompare(b));
});

const reclamosFiltrados = computed(() => {
  let resultados = reclamos.value;

  // Filtro por estado
  if (filtroEstado.value !== 'Todos') {
    resultados = resultados.filter(r => r.estado === filtroEstado.value);
  }

  // Filtro por barrio
  if (filtroBarrio.value !== 'Todos') {
    resultados = resultados.filter(r => r.barrio === filtroBarrio.value);
  }

  // Filtro por mes y año
  resultados = resultados.filter(r => {
    const fecha = new Date(r.fecha.split('/').reverse().join('-'));
    return (
      fecha.getFullYear() === anioActual.value &&
      fecha.getMonth() === mesActual.value
    );
  });

  // Filtro por búsqueda libre
  if (!busqueda.value.trim()) return resultados;

  const filtro = busqueda.value.toLowerCase();
  return resultados.filter(reclamo => {
    const nombre = reclamo.cliente.nombre?.toLowerCase() || '';
    const dni = reclamo.cliente.dni?.toString() || '';
    const suministro = reclamo.numeroSuministro?.toLowerCase() || '';
    const medidor = reclamo.medidor?.toLowerCase() || '';
    return (
      nombre.includes(filtro) ||
      dni.includes(filtro) ||
      suministro.includes(filtro) ||
      medidor.includes(filtro)
    );
  });
});

const abrirModal = (reclamo) => {
  reclamoSeleccionado.value = reclamo;
  nuevoEstado.value = reclamo.estado;
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
  error.value = '';
};

const actualizarEstado = async () => {
  if (!reclamoSeleccionado.value) return;
  loading.value = true;
  error.value = '';
  try {
    await actualizarEstadoReclamo(reclamoSeleccionado.value.ID_RECLAMO, nuevoEstado.value);
    reclamoSeleccionado.value.estado = nuevoEstado.value;
    cerrarModal();
  } catch (error) {
    error.value = 'Error al actualizar el estado. Intenta de nuevo.';
    console.error('Error al actualizar estado:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(obtenerReclamos);
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
