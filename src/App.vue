<template>
  <div>
    <!-- Sistema completo (Login incluido) -->
    <div class="flex min-h-screen overflow-x-hidden energy-bg">
      <!-- Sidebar -->
      <Sidebar v-if="!esLogin" />

      <div
        class="flex flex-col flex-grow transition-all duration-300
                ml-0 md:ml-[200px] lg:ml-[240px] xl:ml-[280px]
                w-full md:w-[calc(100%-200px)] lg:w-[calc(100%-240px)] xl:w-[calc(100%-280px)]"
      >
        <!-- HEADER -->
        <header v-if="!esLogin" class="energy-header px-4 py-2 sm:px-6 sm:py-3 border-b border-slate-200 flex items-center sticky top-0 z-20">
          <div class="flex items-center space-x-2 md:space-x-0">
            <button
              @click="mostrarSidebarMobile = true"
              class="md:hidden text-slate-700 hover:text-indigo-600 p-1 rounded-md transition"
              aria-label="Abrir menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <router-link to="/" class="flex items-center space-x-2 group">
              <div class="energy-icon w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition"></div>
              <div class="leading-tight text-left overflow-hidden">
                <h1 class="block sm:hidden text-base font-bold text-slate-800 animate-glow-text group-hover:text-indigo-600">DECSA</h1>
                <h1 class="hidden sm:block text-sm sm:text-lg font-semibold text-slate-800 animate-glow-text group-hover:text-indigo-600 truncate">Distribuidora Eléctrica de Caucete S.A.</h1>
                <p class="hidden sm:block text-xs text-slate-500 group-hover:text-indigo-500 truncate">Compañía de servicios públicos</p>
              </div>
            </router-link>
          </div>

          <div class="flex-grow"></div>

          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm sm:text-base">
              {{ nombreUsuario.charAt(0).toUpperCase() }}
            </div>
            <span class="hidden sm:inline text-sm sm:text-base font-medium text-indigo-700">
              {{ nombreUsuario }}
            </span>
          </div>
        </header>

        <!-- VISTAS DINÁMICAS -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
          </transition>
        </router-view>
      </div>

      <!-- NAV MOBILE -->
      <MobileNav v-if="mostrarSidebarMobile" @cerrar="cerrarSidebar" />
    </div>

    <!-- SPINNER Y CHAT -->
    <Spinner v-if="loading" />
    <ChatCliente v-if="tipoUsuario === 'cliente' && !esLogin" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Sidebar from '@/components/Sidebar.vue';
import MobileNav from '@/components/MobileNav.vue';
import Spinner from '@/components/comunes/Spinner.vue';
import ChatCliente from '@/components/cliente/ChatCliente.vue';
import { obtenerUsuario } from '@/services/usuariosService';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const nombreUsuario = ref('');
const mostrarSidebarMobile = ref(false);

const esLogin = computed(() => route.path === '/login');
const tipoUsuario = computed(() => localStorage.getItem('tipoUsuario') || 'cliente');

const cerrarSidebar = () => {
  mostrarSidebarMobile.value = false;
};

const cargarNombreUsuario = async () => {
  if (tipoUsuario.value === 'cliente') {
    const dni = localStorage.getItem('dni');
    if (!dni && !esLogin.value) {
      router.push('/login');
      return;
    }
    try {
      const usuario = await obtenerUsuario(dni);
      nombreUsuario.value = usuario.NOMBRE_COMPLETO || usuario.NombreCompleto || 'Usuario Desconocido';
    } catch {
      nombreUsuario.value = 'Usuario Desconocido';
    }
  } else {
    nombreUsuario.value = localStorage.getItem('usuario') || 'Admin';
  }
};

onMounted(cargarNombreUsuario);
watch(route, () => {
  if (!esLogin.value) cargarNombreUsuario();
});

// Excluir rutas del spinner
const rutasSinSpinner = ['/empleados'];

router.beforeEach((to, from, next) => {
  loading.value = !rutasSinSpinner.includes(to.path);
  next();
});

router.afterEach(() => {
  setTimeout(() => (loading.value = false), 800);
});
</script>

<style scoped>
.energy-bg {
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
  position: relative;
}

.energy-header {
  background: linear-gradient(135deg, #ffffff00 0%, #f1f5f900 100%);
  transition: all 0.5s ease;
}

.energy-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 2px;
  background: linear-gradient(to right, transparent, #60a5fa, transparent);
  animation: energyFlowHeader 4s infinite ease-in-out;
}

.energy-icon {
  background: url('/path-to-your-logo.png') no-repeat center;
  background-size: contain;
}

.animate-glow-text {
  animation: textGlow 3s infinite ease-in-out;
}

@keyframes energyFlowHeader {
  0% { left: -100%; }
  50% { left: 50%; }
  100% { left: 150%; }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 4px rgba(59, 130, 246, 0.2);
  }
  50% {
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
