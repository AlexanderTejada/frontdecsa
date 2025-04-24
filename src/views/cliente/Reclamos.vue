<template>
  <div class="px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
    <!-- Encabezado y botón -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h2 class="text-2xl font-semibold text-slate-800">Mis Reclamos</h2>
      <button
        @click="abrirModalCrear"
        class="relative z-10 font-semibold text-base sm:text-sm px-5 py-2 sm:px-4 sm:py-2 rounded-lg
               bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-400 border border-indigo-600/30
               text-white shadow-md hover:shadow-lg transition-all duration-500 ease-in-out overflow-hidden
               cursor-pointer"
      >
        <span class="relative z-10">+ Hacer Reclamo</span>
        <span class="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-700"></span>
      </button>
    </div>

    <!-- Navegación por mes -->
    <div class="flex items-center justify-center mb-6 gap-4 flex-wrap">
      <button
        @click="cambiarMes(-1)"
        class="cursor-pointer p-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Mes anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span class="text-lg font-medium text-slate-800">{{ meses[mesActual] }}</span>

      <button
        @click="cambiarMes(1)"
        class="cursor-pointer p-2 rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-md transition hover:scale-105 text-slate-700"
        aria-label="Mes siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Contenedor de reclamos -->
    <div class="relative">
      <div
        class="overflow-y-auto max-h-[60vh] pr-2 border border-slate-200 rounded-xl
               shadow-md bg-slate-100/60 backdrop-blur-sm p-4 transition-all duration-500 ease-in-out"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <ReclamoCard
            v-for="reclamo in reclamosFiltrados"
            :key="reclamo.ID_RECLAMO"
            :reclamo="reclamo"
            @click="abrirDetalle(reclamo)"
          />
        </div>
      </div>

      <!-- Sombra inferior para scroll -->
      <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-xl
                  bg-gradient-to-t from-slate-100/90 via-slate-100/60 to-transparent"></div>
    </div>

    <!-- Modales -->
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerTodosLosReclamosPorDni as obtenerReclamosDesdeServicio } from '@/services/reclamosService'
import ReclamoCard from '@/components/cliente/ReclamoCard.vue'
import CrearReclamoModal from '@/components/cliente/CrearReclamoModal.vue'
import ReclamoDetalleModal from '@/components/cliente/ReclamoDetalleModal.vue'

const router = useRouter()
const reclamos = ref([])
const mostrarModalCrear = ref(false)
const reclamoSeleccionado = ref(null)
const dniUsuario = localStorage.getItem('dni')

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const fechaActual = new Date()
const mesActual = ref(fechaActual.getMonth())
const anioActual = ref(fechaActual.getFullYear())

const cambiarMes = (delta) => {
  const nuevaFecha = new Date(anioActual.value, mesActual.value + delta)
  mesActual.value = nuevaFecha.getMonth()
  anioActual.value = nuevaFecha.getFullYear()
}

const abrirModalCrear = () => {
  mostrarModalCrear.value = true
}

const abrirDetalle = (reclamo) => {
  reclamoSeleccionado.value = reclamo
}

const cargarReclamos = async () => {
  if (!dniUsuario) {
    router.push('/login')
    return
  }

  try {
    const response = await obtenerReclamosDesdeServicio(dniUsuario)
    const reclamosData = Array.isArray(response.reclamos) ? response.reclamos : response

    reclamos.value = reclamosData
      .filter(r => r) // evita reclamos nulos o malformados
      .map(r => {
        const fechaObj = new Date(r.fecha || r.FECHA_RECLAMO || r.fecha_reclamo)
        return {
          ID_RECLAMO: r.ID_RECLAMO || r.id_reclamo,
          fecha: fechaObj.toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric'
          }),
          hora: fechaObj.toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
          }),
          mes: fechaObj.getMonth(),
          anio: fechaObj.getFullYear(),
          estado: r.ESTADO || r.estado,
          calle: r.calle || '---',
          barrio: r.barrio || '---',
          codigo_postal: r.codigo_postal || '',
          medidor: r.medidor || '',
          numeroSuministro: r.numeroSuministro || '',
          descripcion: r.DESCRIPCION || r.descripcion || 'Sin descripción'
        }
      })
      .sort((a, b) => new Date(b.anio, b.mes) - new Date(a.anio, a.mes))

  } catch (error) {
    console.error('❌ Error al obtener reclamos:', error)
    reclamos.value = []
  }
}

const reclamosFiltrados = computed(() => {
  return reclamos.value.filter(r => r.mes === mesActual.value && r.anio === anioActual.value)
})

onMounted(cargarReclamos)
</script>
