<template>
  <div class="px-4 md:px-8 py-10 max-w-screen-2xl mx-auto">
    <!-- Título -->
    <h2 class="text-2xl font-semibold text-slate-800 text-center mb-8">
      Reclamos de Todos los Clientes
    </h2>

    <!-- Filtros centrados -->
    <div class="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mb-6 text-center">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre, DNI, medidor o suministro"
        class="w-full sm:w-[300px] px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        v-model="filtroEstado"
        class="w-full sm:w-[120px] px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400  bg-blue-90"
      >
        <option value="Todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Resuelto">Resuelto</option>
      </select>
    </div>

    <!-- Navegación por mes y año -->
    <div class="flex justify-center items-center gap-4 flex-wrap mb-8">
      <button
        @click="mesAnterior"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 transition hover:bg-blue-200 boton-mes"
        aria-label="Mes anterior"
      >
        ‹
      </button>

      <span class="text-lg font-medium text-slate-800 whitespace-nowrap ">
        {{ meses[mesActual] }} {{ anioActual }}
      </span>

      <button
        @click="mesSiguiente"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 transition hover:bg-blue-200 boton-mes"
        aria-label="Mes siguiente"
      >
        ›
      </button>

      <button
        @click="irAlMesActual"
        class="px-4 py-1 rounded-md text-sm font-medium bg-slate-100 text-slate-700 shadow-sm transition hover:bg-slate-200"
      >
        Mes actual
      </button>
    </div>

    <!-- Resultados -->
    <div
      class="overflow-y-auto max-h-[50vh] p-2 pr-4 w-full transition-all  rounded-xl overflow-hidden bg-white border border-gray-200"
      :class="{ 'flex items-center justify-center min-h-[300px]': reclamosFiltrados.length === 0 }"
    >
      <div v-if="reclamosFiltrados.length === 0" class="text-center text-slate-500 text-lg">
        No hay reclamos disponibles para mostrar.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <ReclamoCardEmpleados
          v-for="reclamo in reclamosFiltrados"
          :key="reclamo.ID_RECLAMO"
          v-bind="reclamo"
          @verDetalles="abrirModal(reclamo)"
        />
      </div>
    </div>

    <!-- Modal -->
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

    <!-- Chat flotante -->
    <ChatBubble />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerTodosLosReclamos, actualizarEstadoReclamo } from '@/services/api';
import ReclamoCardEmpleados from '@/components/empleados/ReclamoCardEmpleados.vue';
import ModalEstadoReclamo from '@/components/empleados/modal/ModalEstadoReclamo.vue';
import ChatBubble from '@/components/empleados/ChatBubble.vue';

const reclamos = ref([]);
const busqueda = ref('');
const filtroEstado = ref('Todos');
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

const reclamosFiltrados = computed(() => {
  let resultados = reclamos.value;

  if (filtroEstado.value !== 'Todos') {
    resultados = resultados.filter(r => r.estado === filtroEstado.value);
  }

  resultados = resultados.filter(r => {
    const fecha = new Date(r.fecha.split('/').reverse().join('-'));
    return (
      fecha.getFullYear() === anioActual.value &&
      fecha.getMonth() === mesActual.value
    );
  });

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
.boton-mes {
  /* --- Estilos Base --- */
  font-size: 1.25rem;        /* Tamaño de fuente (mantenido) */
  background-color: #007bfff3; /* Un azul más estándar y agradable que 'aqua' */
  color: white;              /* Texto blanco para buen contraste */
  padding: 1.5rem 1.5rem;    /* Espaciado interno (arriba/abajo, izquierda/derecha) */
  border: none;              /* Quita el borde por defecto del navegador */
  border-radius: 100px;        /* Esquinas redondeadas */
  cursor: pointer;           /* Cambia el cursor a una mano para indicar que es clickeable */
  text-align: center;        /* Centra el texto */
  font-weight: bold;         /* Texto en negrita */
  transition: background-color 0.2s ease-in-out, transform 0.1s ease; /* Transición suave para efectos */

  /* --- Estilos de Interacción --- */

  /* Al pasar el mouse por encima (hover) */
  &:hover {
    background-color: #0056b3; /* Un azul un poco más oscuro */
  }

  /* Al hacer click (active) */
  &:active {
    background-color: #004085; /* Un azul aún más oscuro */
    transform: scale(0.98);   /* Efecto sutil de "presionado" */
  }

  /* Para accesibilidad (cuando el botón tiene foco, ej: navegando con Tab) */
  /* :focus-visible es más moderno y preferible a :focus */
  &:focus-visible {
    outline: 2px solid #0056b3; /* Un borde visible alrededor */
    outline-offset: 2px;      /* Separación entre el borde y el botón */
  }
}
</style>