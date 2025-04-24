<template>
  <div class="px-6 py-12 sm:px-6 sm:py-10 md:px-10 lg:px-16 xl:px-20 max-w-7xl mx-auto w-full">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <h2 class="text-2xl font-semibold text-slate-800">Reclamos de Todos los Clientes</h2>
    </div>

    <!-- Navegación por mes y año -->
    <div class="flex items-center justify-center mb-8 gap-4 flex-wrap">
      <button @click="mesAnterior" class="cursor-pointer px-4 py-2 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 transition-all shadow-md">‹</button>
      <span class="text-lg font-medium text-slate-800">{{ meses[mesActual] }} {{ anioActual }}</span>
      <button @click="mesSiguiente" class="cursor-pointer px-4 py-2 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 transition-all shadow-md">›</button>
      <button @click="irAlMesActual" class="cursor-pointer ml-2 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 text-white hover:from-indigo-600 hover:to-blue-500 transition-all shadow-md">Mes actual</button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="busqueda" type="text" placeholder="Nombre, DNI, medidor o suministro" class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-[240px] md:w-[280px] lg:w-[300px]" />
      <select v-model="filtroEstado" class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white w-full sm:w-[160px]">
        <option value="Todos">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Resuelto">Resuelto</option>
      </select>
      <select v-model="filtroBarrio" class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white w-full sm:w-[180px]">
        <option value="Todos">Todos los barrios</option>
        <option v-for="barrio in barriosDisponibles" :key="barrio" :value="barrio">{{ barrio }}</option>
      </select>
    </div>

    <!-- Filtro de Prioridades -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        v-for="(etiqueta, prioridad) in prioridades"
        :key="prioridad"
        @click="filtroPrioridad = prioridad"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold border transition',
          filtroPrioridad === prioridad
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
        ]"
      >
        {{ etiqueta.label }}
        <span
          v-if="etiqueta.count !== null"
          class="ml-2 text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full"
        >
          {{ etiqueta.count }}
        </span>
      </button>
    </div>

    <!-- Resultados -->
    <div class="relative">
      <div v-if="reclamosFiltrados.length === 0" class="text-center text-slate-500 text-lg sm:text-base py-8">
        No hay reclamos disponibles para mostrar.
      </div>

      <div v-else class="overflow-y-auto max-h-[60vh] pr-2 border border-slate-300 rounded-xl shadow-md bg-slate-100/70 backdrop-blur-md p-6 transition-all duration-300 custom-scroll">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
          <ReclamoCardEmpleados
            v-for="reclamo in reclamosFiltrados"
            :key="reclamo.id_reclamo"
            v-bind="reclamo"
            :highlighted="reclamo.id_reclamo === idUltimoNuevo"
            @verDetalles="abrirModal(reclamo)"
          />
        </div>
      </div>

      <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-xl bg-gradient-to-t from-slate-100/80 via-slate-100/60 to-transparent"></div>
    </div>

    <!-- Modal -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { obtenerTodosLosReclamos, actualizarEstadoReclamo } from '@/services/api'
import { useNotificaciones } from '@/utils/useNotificaciones'
import ReclamoCardEmpleados from '@/components/empleados/ReclamoCardEmpleados.vue'
import ModalEstadoReclamo from '@/components/empleados/modal/ModalEstadoReclamo.vue'

const reclamos = ref([])
const reclamosPrevios = ref(new Set())
const primeraCarga = ref(true)
const idUltimoNuevo = ref(null)

const { agregarNotificacion } = useNotificaciones()

const busqueda = ref('')
const filtroEstado = ref('Todos')
const filtroBarrio = ref('Todos')
const filtroPrioridad = ref('Todos')

const modalAbierto = ref(false)
const reclamoSeleccionado = ref(null)
const nuevoEstado = ref('')
const loading = ref(false)
const error = ref('')

const fechaActual = new Date()
const anioActual = ref(fechaActual.getFullYear())
const mesActual = ref(fechaActual.getMonth())

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11
    anioActual.value--
  } else {
    mesActual.value--
  }
}

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0
    anioActual.value++
  } else {
    mesActual.value++
  }
}

const irAlMesActual = () => {
  anioActual.value = fechaActual.getFullYear()
  mesActual.value = fechaActual.getMonth()
}

const prioridades = ref({
  Alta: { label: 'Prioridad: Alta', count: null },
  Media: { label: 'Prioridad: Media', count: null },
  Baja: { label: 'Prioridad: Baja', count: null },
  Todos: { label: 'Todas', count: null }
})

const obtenerReclamos = async () => {
  try {
    const response = await obtenerTodosLosReclamos()
    const ahora = Date.now()

    if (!primeraCarga.value) {
      const nuevos = response.filter(r => !reclamosPrevios.value.has(r.id_reclamo))
      if (nuevos.length > 0) {
        idUltimoNuevo.value = nuevos[0].id_reclamo
        nuevos.forEach(nr => agregarNotificacion(nr, 'info'))
      }
    } else {
      primeraCarga.value = false
    }

    reclamosPrevios.value = new Set(response.map(r => r.id_reclamo))

    reclamos.value = response.map(reclamo => {
      const fechaReclamo = new Date(reclamo.fecha)
      const fechaCierre = reclamo.fechaCierre ? new Date(reclamo.fechaCierre) : null

      return {
        id: reclamo.id_reclamo,
        id_reclamo: reclamo.id_reclamo,
        timestamp: fechaReclamo.getTime(),
        fecha: fechaReclamo.toLocaleDateString('es-ES'),
        hora: fechaReclamo.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        fechaCierre: fechaCierre ? fechaCierre.toLocaleDateString('es-ES') : null,
        horaCierre: fechaCierre ? fechaCierre.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
        estado: reclamo.estado || 'Pendiente',
        cliente: reclamo.cliente || { nombre: 'Desconocido', dni: 'N/A' },
        numeroSuministro: reclamo.numeroSuministro || 'N/A',
        medidor: reclamo.medidor || 'N/A',
        descripcion: reclamo.descripcion || 'Sin descripción',
        calle: reclamo.calle || 'Sin calle',
        barrio: reclamo.barrio || 'Sin barrio',
        codigo_postal: reclamo.codigo_postal || 'N/A',
        prioridad: reclamo.prioridad ?? 'Media'
      }
    })

    const counts = { Alta: 0, Media: 0, Baja: 0 }
    const mes = mesActual.value
    const anio = anioActual.value

    reclamos.value.forEach(r => {
      const fecha = new Date(r.fecha.split('/').reverse().join('-'))
      if (
        r.estado !== 'Resuelto' &&
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes &&
        counts[r.prioridad] !== undefined
      ) {
        counts[r.prioridad]++
      }
    })

    prioridades.value.Alta.count = counts.Alta
    prioridades.value.Media.count = counts.Media
    prioridades.value.Baja.count = counts.Baja
    prioridades.value.Todos.count = counts.Alta + counts.Media + counts.Baja

  } catch (err) {
    console.error('Error al obtener reclamos:', err)
    reclamos.value = []
  }
}

const barriosDisponibles = computed(() => {
  const barrios = new Set()
  reclamos.value.forEach(r => {
    if (r.barrio && r.barrio !== 'Sin barrio') barrios.add(r.barrio)
  })
  return Array.from(barrios).sort()
})

const reclamosFiltrados = computed(() => {
  const ordenPrioridad = { Alta: 1, Media: 2, Baja: 3 }
  let resultados = [...reclamos.value]

  resultados.sort((a, b) => {
    const aPrioridad = ordenPrioridad[a.prioridad] || 999
    const bPrioridad = ordenPrioridad[b.prioridad] || 999
    if (aPrioridad === bPrioridad) {
      return b.timestamp - a.timestamp
    }
    return aPrioridad - bPrioridad
  })

  if (filtroEstado.value !== 'Todos') {
    resultados = resultados.filter(r => r.estado === filtroEstado.value)
  }
  if (filtroBarrio.value !== 'Todos') {
    resultados = resultados.filter(r => r.barrio === filtroBarrio.value)
  }
  if (filtroPrioridad.value !== 'Todos') {
    resultados = resultados.filter(r => r.prioridad === filtroPrioridad.value)
  }

  resultados = resultados.filter(r => {
    const fecha = new Date(r.fecha.split('/').reverse().join('-'))
    return fecha.getFullYear() === anioActual.value && fecha.getMonth() === mesActual.value
  })

  if (!busqueda.value.trim()) return resultados

  const filtro = busqueda.value.toLowerCase()
  return resultados.filter(r => {
    const nombre = r.cliente?.nombre?.toLowerCase() || ''
    const dni = r.cliente?.dni?.toString() || ''
    const suministro = r.numeroSuministro?.toLowerCase() || ''
    const medidor = r.medidor?.toLowerCase() || ''
    return (
      nombre.includes(filtro) ||
      dni.includes(filtro) ||
      suministro.includes(filtro) ||
      medidor.includes(filtro)
    )
  })
})

const abrirModal = (reclamo) => {
  reclamoSeleccionado.value = reclamo
  nuevoEstado.value = reclamo.estado
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  error.value = ''
}

const actualizarEstado = async () => {
  if (!reclamoSeleccionado.value) return
  loading.value = true
  error.value = ''
  try {
    await actualizarEstadoReclamo(reclamoSeleccionado.value.id_reclamo, nuevoEstado.value)
    reclamoSeleccionado.value.estado = nuevoEstado.value
    cerrarModal()
  } catch (err) {
    error.value = 'Error al actualizar el estado.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

let intervaloActualizacion = null

onMounted(() => {
  obtenerReclamos()
  intervaloActualizacion = setInterval(obtenerReclamos, 2000)
})

onUnmounted(() => {
  clearInterval(intervaloActualizacion)
})
</script>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.custom-scroll::-webkit-scrollbar {
  width: 10px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 82, 198, 0.4); /* slate-500 transparent */
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(71, 85, 105, 0.5); /* slate-600 */
}

</style>
