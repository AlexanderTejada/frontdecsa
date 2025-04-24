<template>
  <div class="max-w-6xl mx-auto w-full px-6 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
        Bienvenido,
        <span class="relative inline-block bg-gradient-to-r from-indigo-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent underline-animate">
          {{ nombreUsuario || 'Admin' }}
        </span>
      </h1>
      <p class="text-lg text-slate-600">Área de gestión administrativa DECSA</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <router-link to="/reclamos-empleados" class="group relative cursor-pointer bg-white border rounded-lg p-6 shadow-md hover:shadow-xl transition-all" :class="reclamosPendientes > 0 ? 'border-red-300' : 'border-indigo-300'">
        <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-600 via-red-400 to-red-200 rounded-s-lg" />
        <div class="flex items-center gap-3 mb-3">
          <ExclamationTriangleIcon class="w-6 h-6 text-red-700" />
          <h2 class="text-xl font-semibold text-red-900">Reclamos pendientes</h2>
        </div>
        <p class="text-slate-800 text-sm">
          Actualmente hay <strong>{{ reclamosPendientes }}</strong> reclamos sin resolver.
        </p>
      </router-link>

      <router-link to="/avisos" class="group relative bg-white border border-yellow-300 rounded-lg p-6 shadow-md hover:shadow-xl transition-all">
        <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-500 via-yellow-300 to-yellow-100 rounded-s-lg" />
        <div class="flex items-center gap-3 mb-3">
          <ChatBubbleBottomCenterTextIcon class="w-6 h-6 text-yellow-700" />
          <h2 class="text-xl font-semibold text-yellow-900">Avisos</h2>
        </div>
        <p class="text-slate-800 text-sm">Envia notificaciones a los clientes por WhatsApp.</p>
      </router-link>

      <router-link to="/gestion-usuarios" class="group relative bg-white border border-emerald-300 rounded-lg p-6 shadow-md hover:shadow-xl transition-all">
        <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-600 via-emerald-400 to-emerald-100 rounded-s-lg" />
        <div class="flex items-center gap-3 mb-3">
          <UserCircleIcon class="w-6 h-6 text-emerald-700" />
          <h2 class="text-xl font-semibold text-emerald-900">Empleados</h2>
        </div>
        <p class="text-slate-800 text-sm">Gestiona usuarios internos y sus permisos.</p>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Últimos reclamos -->
<div class="bg-white border border-slate-200 rounded-xl p-6">
  <h3 class="text-lg font-semibold text-slate-800 mb-4">Últimos reclamos</h3>
  <ul class="space-y-3 text-sm text-slate-700">
    <li
      v-for="r in ultimosReclamos"
      :key="r.ID"
      class="relative pl-4 pr-4 py-3 rounded-lg border-l-4 border-indigo-400 bg-slate-100/60 hover:bg-slate-200/70 transition shadow-sm"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-0.5">{{ r.barrio || 'Barrio desconocido' }}</p>
          <p class="text-xs text-slate-600">{{ r.descripcion || 'Sin descripción' }}</p>
        </div>
        <span class="text-xs text-slate-500 mt-1 ml-2 whitespace-nowrap">
          <svg class="w-4 h-4 inline-block mr-1 -mt-0.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 5.25h18M3 21V8.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 8.25V21H3z" />
          </svg>
          {{ formatoFecha(r.fecha) }}
        </span>
      </div>
    </li>
  </ul>
  <div class="text-right mt-4">
    <router-link to="/reclamos-empleados" class="inline-flex items-center text-sm text-indigo-600 hover:underline font-medium">
      Ver todos
      <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12h-18" />
      </svg>
    </router-link>
  </div>
</div>

      <div class="bg-white border border-slate-200 rounded-xl p-6 h-[450px]">
        <h3 class="text-lg font-semibold text-slate-500 mb-1">Estado de reclamos</h3>
        <PolarArea :data="polarChartData" :options="polarChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PolarArea } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js';

import {
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from '@heroicons/vue/24/solid';

import { obtenerTodosLosReclamos } from '@/services/api';

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, ArcElement);

const nombreUsuario = ref('Admin');
const reclamosPendientes = ref(0);
const totalResueltos = ref(0);
const totalPendientes = ref(0);
const ultimosReclamos = ref([]);

const cargarDatos = async () => {
  try {
    const reclamos = await obtenerTodosLosReclamos();

    reclamosPendientes.value = reclamos.filter(r => r.estado === 'Pendiente').length;
    totalPendientes.value = reclamos.filter(r => r.estado === 'Pendiente').length;
    totalResueltos.value = reclamos.filter(r => r.estado !== 'Pendiente').length;

    ultimosReclamos.value = reclamos.slice(-3).map(r => ({
      ID: r.id_reclamo,
      barrio: r.barrio,
      descripcion: r.descripcion,
      fecha: r.fecha
    })).reverse();

  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

onMounted(cargarDatos);

const formatoFecha = fecha => {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const polarChartData = computed(() => ({
  labels: ['Pendientes', 'Resueltos'],
  datasets: [
    {
      label: 'Estado de reclamos',
      data: [totalPendientes.value, totalResueltos.value],
      backgroundColor: [
        'rgba(1000, 0, 0, 0.3)', // Light indigo for Pendientes
        'rgba(0, 56, 202, 0.6)'   // Dark indigo for Resueltos
      ],
      borderColor: [
      'rgba(1000, 0, 0, 0.6)', // Light indigo for Pendientes
      'rgba(67, 56, 202, 1)'
      ],
      borderWidth: 3,
      hoverBackgroundColor: [
      'rgba(1000, 0, 0, 0.6)',  // Light indigo for Pendientes
      'rgba(67, 56, 202, 0.8)'
      ],
      hoverBorderWidth: 4
    }
  ]
}));

const polarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: 15,
        color: '#1e293b'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
      padding: 10
    }
  },
  scales: {
    r: {
      ticks: {
        font: {
          size: 12,
          weight: 'bold'
        },
        color: '#1e293b',
        backdropColor: 'rgba(255, 255, 255, 0.7)',
        backdropPadding: 3
      },
      grid: {
        color: 'rgba(100, 116, 139, 0.2)',
        lineWidth: 1
      },
      pointLabels: {
        font: {
          size: 14,
          weight: 'bold'
        },
        color: '#1e293b'
      }
    }
  },
  animation: {
    duration: 800,
    easing: 'easeOutQuad'
  }
};
</script>

<style scoped>
.underline-animate::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, #4f46e5, #5fbae4);
  transition: width 0.4s ease-in-out;
}

.underline-animate:hover::after {
  width: 100%;
  cursor: pointer;
}
</style>