<template>
    <div class="px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-semibold text-slate-800">Gestión de Avisos</h2>
          <p class="text-sm text-slate-500">Envía comunicados importantes a los clientes.</p>
        </div>
        <button
          @click="abrirModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm shadow"
        >
          + Crear Aviso
        </button>
      </div>
  
      <!-- Cartel PRONTO -->
      <transition name="fade">
        <div v-if="mostrarPronto" class="bg-indigo-100 border border-indigo-300 rounded-xl p-6 flex items-center justify-between mb-6 shadow">
          <div>
            <h1 class="text-3xl font-extrabold text-indigo-700 mb-1">PRONTO</h1>
            <p class="text-sm text-slate-700">Aquí podrás gestionar y publicar avisos masivos por barrios o en general.</p>
          </div>
          <button @click="mostrarPronto = false" class="text-indigo-500 hover:text-indigo-700">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </transition>
  
      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select v-model="filtroBarrio" class="border rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los barrios</option>
          <option v-for="b in barriosDisponibles" :key="b" :value="b">{{ b }}</option>
        </select>
        <select v-model="filtroMes" class="border rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los meses</option>
          <option v-for="(mes, index) in meses" :key="index" :value="index">{{ mes }}</option>
        </select>
      </div>
  
      <!-- Avisos -->
      <div v-if="avisosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(aviso, index) in avisosFiltrados" :key="index" class="bg-white border border-slate-300 rounded-xl p-4 shadow">
          <div class="flex justify-between items-center mb-1">
            <p class="text-sm font-semibold text-indigo-700">{{ aviso.barrio }}</p>
            <span class="text-xs text-slate-400">{{ formatoFecha(aviso.fecha) }}</span>
          </div>
          <p class="text-sm text-slate-800 whitespace-pre-line">{{ aviso.descripcion }}</p>
  
          <div v-if="aviso.cancelado" class="mt-2 text-sm text-red-600 italic">
            Cancelado: {{ aviso.motivoCancelacion }}
          </div>
  
          <div v-else class="flex justify-end mt-3">
            <button @click="abrirCancelacion(index)" class="text-xs text-red-500 hover:text-red-700 font-semibold">Cancelar aviso</button>
          </div>
  
          <div v-if="index === cancelandoAviso" class="mt-3">
            <label class="text-sm text-slate-700">Motivo de cancelación:</label>
            <textarea v-model="motivoCancelacion" rows="2" class="w-full border border-red-300 rounded px-2 py-1 text-sm mt-1"></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <button @click="cancelandoAviso = null" class="text-xs text-slate-600 hover:text-slate-800">Volver</button>
              <button @click="confirmarCancelacion(index)" class="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-slate-500 text-sm mt-12">No hay avisos para los filtros seleccionados.</div>
  
      <!-- Modal de creación -->
      <transition name="fade">
        <div v-if="modalActivo" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Nuevo Aviso</h2>
            <label class="block text-sm text-slate-700 mb-1">Barrio</label>
            <select v-model="nuevoAviso.barrio" class="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4">
              <option disabled value="">Seleccione un barrio</option>
              <option value="Todos">Todos</option>
              <option v-for="b in barriosDisponibles" :key="b" :value="b">{{ b }}</option>
            </select>
  
            <label class="block text-sm text-slate-700 mb-1">Descripción</label>
            <textarea v-model="nuevoAviso.descripcion" rows="4" class="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3"></textarea>
  
            <div class="text-red-500 text-xs mb-4">
              Este aviso será enviado por WhatsApp a todos los usuarios del barrio seleccionado.
            </div>
  
            <div class="flex justify-end gap-2">
              <button @click="cerrarModal" class="text-slate-600 hover:text-slate-800 px-3 py-2 text-sm">Cancelar</button>
              <button @click="publicarAviso" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm rounded-lg font-semibold">Publicar</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { XMarkIcon } from '@heroicons/vue/24/solid';
  
  const mostrarPronto = ref(true);
  const modalActivo = ref(false);
  const nuevoAviso = ref({ descripcion: '', barrio: '' });
  const motivoCancelacion = ref('');
  const cancelandoAviso = ref(null);
  
  const barriosDisponibles = ['Centro', 'Villa Dolores', 'Pie de Palo', 'Justo P. Castro I', 'Justo P. Castro II'];
  const avisos = ref([]);
  
  const filtroBarrio = ref('');
  const filtroMes = ref('');
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const avisosFiltrados = computed(() => {
    return avisos.value.filter(a => {
      const fecha = new Date(a.fecha);
      const coincideMes = filtroMes.value === '' || fecha.getMonth() === parseInt(filtroMes.value);
      const coincideBarrio = filtroBarrio.value === '' || a.barrio === filtroBarrio.value || filtroBarrio.value === 'Todos';
      return coincideMes && coincideBarrio;
    });
  });
  
  const abrirModal = () => {
    nuevoAviso.value = { descripcion: '', barrio: '' };
    modalActivo.value = true;
  };
  
  const cerrarModal = () => {
    modalActivo.value = false;
  };
  
  const publicarAviso = () => {
    if (nuevoAviso.value.descripcion && nuevoAviso.value.barrio) {
      avisos.value.unshift({
        descripcion: nuevoAviso.value.descripcion,
        barrio: nuevoAviso.value.barrio,
        fecha: new Date(),
        cancelado: false,
        motivoCancelacion: ''
      });
      cerrarModal();
    }
  };
  
  const abrirCancelacion = (index) => {
    motivoCancelacion.value = '';
    cancelandoAviso.value = index;
  };
  
  const confirmarCancelacion = (index) => {
    if (!motivoCancelacion.value.trim()) return;
    const aviso = avisos.value[index];
    if (!aviso.cancelado) {
      aviso.cancelado = true;
      aviso.motivoCancelacion = motivoCancelacion.value;
    }
    cancelandoAviso.value = null;
  };
  
  const formatoFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(fecha));
  };
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  