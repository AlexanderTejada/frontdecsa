<template>
    <div class="dashboard-administrativo px-6 py-12 max-w-6xl mx-auto w-full">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          Bienvenido, {{ nombreEmpleado || 'Empleado' }}
        </h1>
        <p class="text-lg text-slate-600">
          Área de gestión administrativa del sistema DECSA
        </p>
      </div>
  
      <!-- Cards resumen -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div class="bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-indigo-800 mb-2">Reclamos totales</h2>
          <p class="text-slate-700 text-sm mb-4">
            Este mes se han gestionado <strong>{{ reclamosMes }}</strong> reclamos.
          </p>
          <router-link to="/reclamos-empleados" class="text-sm font-semibold text-indigo-700 hover:underline">
            Ver reclamos →
          </router-link>
        </div>
  
        <div class="bg-sky-100 border border-sky-200 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-sky-800 mb-2">Reclamos pendientes</h2>
          <p class="text-slate-700 text-sm mb-4">
            Actualmente hay <strong>{{ reclamosPendientes }}</strong> reclamos pendientes.
          </p>
          <router-link to="/reclamos-empleados" class="text-sm font-semibold text-sky-700 hover:underline">
            Ir a pendientes →
          </router-link>
        </div>
  
        <div class="bg-emerald-100 border border-emerald-200 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-emerald-800 mb-2">Asistente Virtual</h2>
          <p class="text-slate-700 text-sm mb-4">
            Accede al módulo del chatbot para probar funcionalidades.
          </p>
          <router-link to="/chatbot" class="text-sm font-semibold text-emerald-700 hover:underline">
            Ir al Chatbot →
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { obtenerTodosLosReclamos } from '@/services/api';
  
  const nombreEmpleado = ref('Empleado');
  const reclamosMes = ref(0);
  const reclamosPendientes = ref(0);
  
  const cargarDatos = async () => {
    try {
      const reclamos = await obtenerTodosLosReclamos();
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();
  
      reclamosMes.value = reclamos.filter(r => {
        const fecha = new Date(r.FECHA_RECLAMO);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      }).length;
  
      reclamosPendientes.value = reclamos.filter(r => r.ESTADO === 'Pendiente').length;
    } catch (error) {
      console.error('Error al cargar los datos administrativos:', error);
    }
  };
  
  onMounted(cargarDatos);
  </script>
  