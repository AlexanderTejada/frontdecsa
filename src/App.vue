<template>
  <div>
    <router-view v-if="esLogin" />

    <div v-else class="flex min-h-screen overflow-x-hidden energy-bg">
      <Sidebar />

      <div
        class="flex flex-col flex-grow transition-all duration-300
               ml-0 md:ml-[200px] lg:ml-[240px] xl:ml-[280px]
               w-full md:w-[calc(100%-200px)] lg:w-[calc(100%-240px)] xl:w-[calc(100%-280px)]"
      >
        <header
          class="bg-white px-4 py-2 sm:px-6 sm:py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-50 energy-header"
        >
          <!-- BOTÓN MENÚ MOBILE -->
          <button
            @click="mostrarSidebarMobile = true"
            class="md:hidden mr-2 text-slate-700 hover:text-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Identidad institucional -->
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="energy-icon shrink-0"></div>
            <div class="leading-tight">
              <h1 class="text-sm sm:text-lg font-semibold text-slate-800 animate-glow-text truncate">
                Distribuidora Eléctrica de Caucete S.A.
              </h1>
              <p class="hidden sm:block text-xs text-slate-500 truncate">
                Compañía de servicios públicos — San Juan, Argentina
              </p>
            </div>
          </div>

          <!-- Nombre de usuario -->
          <div class="text-right leading-tight">
            <router-link
              v-if="tipoUsuario === 'cliente'"
              to="/perfil"
              class="text-sm sm:text-base font-medium text-indigo-700 hover:underline hover:text-indigo-900 transition-colors"
            >
              {{ nombreUsuario }}
            </router-link>
            <span
              v-else
              class="text-sm sm:text-base font-medium text-indigo-700"
            >
              {{ nombreUsuario }}
            </span>
          </div>
        </header>

        <router-view />
      </div>

      <MobileNav v-if="mostrarSidebarMobile" @cerrar="mostrarSidebarMobile = false" />
      <Spinner v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import MobileNav from '@/components/MobileNav.vue';
import Spinner from '@/components/comunes/Spinner.vue';
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
    if (!dni) {
      if (!esLogin.value) router.push('/login');
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

router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  setTimeout(() => (loading.value = false), 800);
});
</script>

<style scoped>
.energy-bg {
  background: #f8fafc;
  position: relative;
}

.energy-header {
  position: relative;
  overflow: hidden;
}
.energy-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 1px;
  background: linear-gradient(to right, transparent, #60a5fa, transparent);
  animation: energyFlowHeader 4s infinite ease-in-out;
}

.energy-icon {
  width: 32px;
  height: 32px;
  background: url('https://cdn-icons-png.flaticon.com/512/9746/9746766.png') no-repeat center;
  background-size: contain;
  animation: subtlePulse 2s infinite;
}

.animate-glow-text {
  animation: textGlow 3s infinite ease-in-out;
}

@keyframes energyFlowHeader {
  0% { left: -100%; }
  50% { left: 50%; }
  100% { left: 150%; }
}

@keyframes subtlePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes textGlow {
  0%, 100% { color: #1e293b; }
  50% { color: #1e40af; text-shadow: 0 0 4px rgba(96, 165, 250, 0.5); }
}
</style>
