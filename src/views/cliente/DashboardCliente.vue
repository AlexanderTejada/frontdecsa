<script setup>
import { ref, onMounted } from 'vue';
import { obtenerUsuario } from '@/services/usuariosService';
import { obtenerFacturas } from '@/services/facturasService';
import { obtenerReclamos } from '@/services/reclamosService';

// Heroicons
import {
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/solid';

const dni = localStorage.getItem('dni');
const nombreCliente = ref('');
const suministro = ref('');
const cantidadReclamos = ref(0);
const totalPendientes = ref(0);

const cargarDatos = async () => {
  try {
    const cliente = await obtenerUsuario(dni);
    nombreCliente.value = cliente.NOMBRE_COMPLETO || cliente.NombreCompleto || 'Cliente';
    suministro.value = cliente.CODIGO_SUMINISTRO || cliente.CodigoSuministro || '---';

    const respuestaReclamos = await obtenerReclamos(dni);
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    cantidadReclamos.value = (respuestaReclamos.reclamos || []).filter(r => {
      const fecha = new Date(r.FECHA_RECLAMO);
      return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    }).length;

    const respuestaFacturas = await obtenerFacturas(dni);
    const todas = respuestaFacturas?.facturas || [];
    totalPendientes.value = todas.filter(f => f.Estado?.toLowerCase() === 'pendiente').length;

  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
  }
};
onMounted(cargarDatos);
</script>
<template>
    <div class="max-w-6xl mx-auto w-full px-6 py-12">
      <!-- Encabezado con subrayado animado -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
  Hola,
  <span
    class="relative inline-block bg-gradient-to-r from-indigo-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent underline-animate hover:brightness-110 transition-all duration-500 ease-in-out"
  >
    {{ nombreCliente || 'Cliente' }}
  </span>
</h1>

        <p class="text-lg text-slate-600">
          Número de cuenta: <span class="font-medium text-indigo-700">{{ suministro || '---' }}</span>
        </p>
      </div>
  
      <!-- Cards con estilo mixto -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        <!-- Reclamos -->
        <router-link 
          to="/reclamos" 
          class="group relative cursor-pointer bg-white border border-indigo-300 rounded-lg p-6 flex flex-col justify-between
                 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden sm:col-span-1 lg:col-span-1"
        >
          <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-600 via-blue-500 to-sky-300 rounded-s-lg"></div>
          <div class="flex items-center gap-3 mb-3">
            <ChatBubbleBottomCenterTextIcon class="w-6 h-6 text-indigo-700 group-hover:text-indigo-900 transition" />
            <h2 class="text-xl font-semibold text-indigo-900">Tus Reclamos</h2>
          </div>
          <p class="text-slate-800 text-sm mb-4">
            Has realizado <strong>{{ cantidadReclamos }}</strong> reclamos este mes.
          </p>
          <p class="text-sm font-semibold text-indigo-900 underline group-hover:underline mt-auto">Ver todos los reclamos</p>
        </router-link>
  
        <!-- Facturas -->
        <router-link 
          to="/facturas" 
          class="group relative cursor-pointer bg-white border border-sky-300 rounded-lg p-6 flex flex-col justify-between
                 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden sm:col-span-1 lg:col-span-1"
        >
          <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-600 via-cyan-400 to-teal-300 rounded-s-lg"></div>
          <div class="flex items-center gap-3 mb-3">
            <DocumentTextIcon class="w-6 h-6 text-sky-700 group-hover:text-sky-900 transition" />
            <h2 class="text-xl font-semibold text-sky-900">Tus Facturas</h2>
          </div>
          <p class="text-slate-800 text-sm mb-4">
            Consulta tus facturas registradas, vencimientos y montos.
          </p>
          <p class="text-sm font-semibold text-sky-900 underline group-hover:underline mt-auto">Ver facturas</p>
        </router-link>
  
        <!-- Estado de facturas -->
        <div 
          class="relative bg-white border border-slate-300 rounded-lg p-6 flex items-center justify-between
                 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-slate-500 via-slate-300 to-slate-100 rounded-s-lg"></div>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
              :class="{
                'bg-green-100 text-green-700': totalPendientes === 0,
                'bg-yellow-100 text-yellow-800': totalPendientes === 1,
                'bg-red-100 text-red-700': totalPendientes > 1
              }"
            >
              <component
                :is="totalPendientes === 0 ? CheckCircleIcon : totalPendientes === 1 ? ExclamationCircleIcon : ExclamationTriangleIcon"
                class="w-6 h-6"
              />
            </div>
            <div>
              <p class="text-base font-semibold text-slate-800">
                <template v-if="totalPendientes === 0">No tienes facturas pendientes</template>
                <template v-else-if="totalPendientes === 1">Tienes una factura pendiente</template>
                <template v-else>Tienes {{ totalPendientes }} facturas pendientes</template>
              </p>
              <p class="text-sm text-slate-600">Mantente al día con tus pagos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .underline-animate::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background-color: #6366f1; /* Indigo-500 */
    transition: width 0.4s ease-in-out;
  }
  
  .underline-animate:hover::after {
    width: 100%;
  }
  </style>
  
<style scoped>
.underline-animate::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, #4f46e5, #5fbae4); /* indigo-600 to sky-500 */
  transition: width 0.4s ease-in-out;
}

.underline-animate:hover::after {
  width: 100%;
}

</style>