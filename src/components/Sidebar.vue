<template>
  <aside
    :class="[collapsed ? 'w-[80px]' : 'w-[220px] lg:w-[250px] xl:w-[280px]', 'hidden md:flex flex-col h-screen fixed top-0 left-0 z-40 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 backdrop-blur-md shadow-2xl text-white rounded-tr-[2.5rem] transition-all duration-300']"
  >
    <!-- Encabezado -->
    <div class="px-4 py-5 border-b border-slate-700 flex items-center justify-between">
      <h2 class="text-lg font-bold tracking-wide text-white/90" v-if="!collapsed">DECSA</h2>
      <button
        @click="collapsed = !collapsed"
        class="text-slate-400 hover:text-white transition-transform transform hover:scale-110 cursor-pointer"
      >
        <ChevronDoubleLeftIcon v-if="!collapsed" class="w-5 h-5" />
        <ChevronDoubleRightIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-2 py-5 space-y-2 overflow-y-auto">
      <!-- CLIENTE -->
      <template v-if="tipoUsuario === 'cliente'">
        <router-link to="/dashboard" class="nav-link" active-class="active">
          <HomeIcon class="w-5 h-5" />
          <span v-if="!collapsed">Inicio</span>
        </router-link>
        <router-link to="/reclamos" class="nav-link" active-class="active">
          <ChatBubbleBottomCenterTextIcon class="w-5 h-5" />
          <span v-if="!collapsed">Reclamos</span>
        </router-link>
        <router-link to="/facturas" class="nav-link" active-class="active">
          <DocumentTextIcon class="w-5 h-5" />
          <span v-if="!collapsed">Facturas</span>
        </router-link>
        <router-link to="/perfil" class="nav-link" active-class="active">
          <UserCircleIcon class="w-5 h-5" />
          <span v-if="!collapsed">Perfil</span>
        </router-link>
      </template>

      <!-- EMPLEADO -->
      <template v-else-if="tipoUsuario === 'empleado'">
        <router-link to="/dashboard-admin" class="nav-link" active-class="active">
          <HomeIcon class="w-5 h-5" />
          <span v-if="!collapsed">Inicio</span>
        </router-link>
        <router-link to="/reclamos-empleados" class="nav-link" active-class="active">
          <InboxIcon class="w-5 h-5" />
          <span v-if="!collapsed">Reclamos</span>
        </router-link>
        <router-link to="/chatbot" class="nav-link" active-class="active">
          <CpuChipIcon class="w-5 h-5" />
          <span v-if="!collapsed">Chatbot</span>
        </router-link>
        <router-link to="/avisos" class="nav-link" active-class="active">
          <MegaphoneIcon class="w-5 h-5" />
          <span v-if="!collapsed">Avisos</span>
        </router-link>
        <!-- ADMIN -->
        <router-link
          v-if="tipoUsuario === 'empleado'"
          to="/gestion-usuarios"
          class="nav-link"
          active-class="active"
        >
          <Cog6ToothIcon class="w-5 h-5" />
          <span v-if="!collapsed">Gestión Usuarios</span>
        </router-link>
      </template>
    </nav>

    <!-- Cierre de sesión -->
    <div class="px-3 pb-6">
      <button
        @click="mostrarConfirmacion = true"
        class="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition text-sm font-medium cursor-pointer"
      >
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        <span v-if="!collapsed">Cerrar sesión</span>
      </button>
    </div>
  </aside>

  <!-- Modal confirmación -->
  <Teleport to="body">
    <transition name="fade-scale">
      <div v-if="mostrarConfirmacion" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 text-center transform transition-transform duration-300">
          <h3 class="text-lg font-semibold text-slate-800 mb-2">¿Cerrar sesión?</h3>
          <p class="text-sm text-slate-600 mb-4">Perderás el acceso hasta que vuelvas a iniciar sesión.</p>
          <div class="flex justify-center gap-4">
            <button @click="confirmarLogout" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition cursor-pointer">
              Sí, salir
            </button>
            <button @click="mostrarConfirmacion = false" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  InboxIcon,
  CpuChipIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MegaphoneIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const mostrarConfirmacion = ref(false);
const collapsed = ref(false);

const tipoUsuario = computed(() => localStorage.getItem('tipoUsuario') || 'cliente');
const usuario = localStorage.getItem('usuario') || '';

const confirmarLogout = () => {
  localStorage.removeItem('dni');
  localStorage.removeItem('token');
  localStorage.removeItem('tipoUsuario');
  localStorage.removeItem('usuario');
  router.push('/login');
};
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
  cursor: pointer;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}
.nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
