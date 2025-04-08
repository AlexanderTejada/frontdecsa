<template>
  <aside
    class="hidden md:flex flex-col w-[220px] lg:w-[250px] xl:w-[280px] h-screen fixed top-0 left-0 z-40 bg-slate-900/90 backdrop-blur-md shadow-lg text-white"
  >
    <!-- Encabezado -->
    <div class="px-6 py-5 border-b border-slate-800">
      <h2 class="text-lg font-bold tracking-wide">DECSA</h2>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
      <template v-if="tipoUsuario === 'cliente'">
        <router-link
          to="/reclamos"
          class="nav-link"
          active-class="bg-slate-800 ring-1 ring-white/10"
        >Reclamos</router-link>
        <router-link
          to="/facturas"
          class="nav-link"
          active-class="bg-slate-800 ring-1 ring-white/10"
        >Facturas</router-link>
        <router-link
          to="/perfil"
          class="nav-link"
          active-class="bg-slate-800 ring-1 ring-white/10"
        >Perfil</router-link>
      </template>

      <template v-else-if="tipoUsuario === 'empleado'">
        <router-link
          to="/reclamos-empleados"
          class="nav-link"
          active-class="bg-slate-800 ring-1 ring-white/10"
        >Reclamos</router-link>
        <router-link
          to="/chatbot"
          class="nav-link"
          active-class="bg-slate-800 ring-1 ring-white/10"
        >Chatbot</router-link>
      </template>
    </nav>

    <!-- Cierre de sesión -->
    <div class="px-4 pb-6">
      <button
        @click="mostrarConfirmacion = true"
        class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition text-sm font-medium cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  </aside>

  <!-- Modal de confirmación fuera del sidebar -->
  <Teleport to="body">
    <transition name="fade-scale">
      <div
        v-if="mostrarConfirmacion"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      >
        <div
          class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 text-center transform transition-transform duration-300"
        >
          <h3 class="text-lg font-semibold text-slate-800 mb-2">¿Cerrar sesión?</h3>
          <p class="text-sm text-slate-600 mb-4">Perderás el acceso hasta que vuelvas a iniciar sesión.</p>
          <div class="flex justify-center gap-4">
            <button
              @click="confirmarLogout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Sí, salir
            </button>
            <button
              @click="mostrarConfirmacion = false"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mostrarConfirmacion = ref(false)
const tipoUsuario = computed(() => localStorage.getItem('tipoUsuario') || 'cliente')

const confirmarLogout = () => {
  localStorage.removeItem('dni')
  localStorage.removeItem('token')
  localStorage.removeItem('tipoUsuario')
  router.push('/login')
}
</script>

<style scoped>
/* Transición del modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from {
  opacity: 0;
}
.fade-scale-leave-to {
  opacity: 0;
}

/* Enlaces del sidebar */
.nav-link {
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(2px);
}
</style>
