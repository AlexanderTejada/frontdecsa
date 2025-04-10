<template>
    <div class="max-w-6xl mx-auto w-full px-6 py-12">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          Bienvenido, {{ nombreCliente || 'Cliente' }}
        </h1>
        <p class="text-lg text-slate-600">
          Número de cuenta: <span class="font-medium text-indigo-600">{{ suministro || '---' }}</span>
        </p>
      </div>
  
      <!-- Cards resumen -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div class="bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-indigo-800 mb-2">Tus Reclamos</h2>
          <p class="text-slate-700 text-sm mb-4">Has realizado <strong>{{ cantidadReclamos }}</strong> reclamos este mes.</p>
          <router-link to="/reclamos" class="text-sm font-semibold text-indigo-700 hover:underline">
            Ver todos los reclamos →
          </router-link>
        </div>
  
        <div class="bg-sky-100 border border-sky-200 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-sky-800 mb-2">Tus Facturas</h2>
          <p class="text-slate-700 text-sm mb-4">
            {{ estadoFactura }}
          </p>
          <router-link to="/facturas" class="text-sm font-semibold text-sky-700 hover:underline">
            Ver facturas →
          </router-link>
        </div>
      </div>
  
      <!-- Última factura -->
      <div class="bg-white border border-slate-300 rounded-xl shadow p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Última Factura</h3>
  
        <div v-if="ultimaFactura" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-700">
          <p><strong>Fecha de emisión:</strong> {{ ultimaFactura.FechaEmision }}</p>
          <p><strong>Vencimiento:</strong> {{ ultimaFactura.Vencimiento }}</p>
          <p><strong>Estado:</strong> <span :class="estadoColor">{{ ultimaFactura.Estado }}</span></p>
          <p><strong>Monto:</strong> ${{ parseFloat(ultimaFactura.Total).toFixed(2) }}</p>
          <p><strong>Consumo:</strong> {{ ultimaFactura.Consumo }} kWh</p>
          <p><strong>Medidor:</strong> {{ ultimaFactura.NumeroMedidor }}</p>
        </div>
  
        <div v-else class="text-slate-500 text-sm">No hay facturas disponibles.</div>
  
        <div class="mt-6 text-right">
          <router-link to="/facturas" class="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm font-semibold">
            Ver facturas
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { obtenerUsuario } from '@/services/usuariosService';
  import { obtenerFacturas } from '@/services/facturasService';
  import { obtenerReclamos } from '@/services/reclamosService';
  
  const dni = localStorage.getItem('dni');
  const nombreCliente = ref('');
  const suministro = ref('');
  const cantidadReclamos = ref(0);
  const ultimaFactura = ref(null);
  const estadoFactura = ref('Cargando...');
  const estadoColor = ref('text-slate-600');
  
  const cargarDatos = async () => {
    try {
      // Datos del cliente
      const cliente = await obtenerUsuario(dni);
      nombreCliente.value = cliente.NOMBRE_COMPLETO || cliente.NombreCompleto || 'Cliente';
      suministro.value = cliente.CODIGO_SUMINISTRO || cliente.CodigoSuministro || '---';
  
      // Reclamos
      const respuestaReclamos = await obtenerReclamos(dni);
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();
  
      cantidadReclamos.value = (respuestaReclamos.reclamos || []).filter(r => {
        const fecha = new Date(r.FECHA_RECLAMO);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      }).length;
  
      // Facturas
      const respuestaFacturas = await obtenerFacturas(dni);
      const todas = respuestaFacturas?.facturas || [];
  
      if (todas.length > 0) {
        todas.sort((a, b) => new Date(b.FechaEmision) - new Date(a.FechaEmision));
        ultimaFactura.value = todas[0];
  
        if (todas.some(f => f.Estado?.toLowerCase() === 'pendiente')) {
          estadoFactura.value = 'Tienes facturas pendientes de pago.';
          estadoColor.value = 'text-red-600 font-semibold';
        } else {
          estadoFactura.value = 'Todo en orden. No hay facturas pendientes.';
          estadoColor.value = 'text-green-600 font-semibold';
        }
      } else {
        estadoFactura.value = 'No hay facturas disponibles.';
      }
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      estadoFactura.value = 'Error al obtener información.';
    }
  };
  
  onMounted(cargarDatos);
  </script>
  