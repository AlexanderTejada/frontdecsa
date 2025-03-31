<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClipboardList, CreditCard, User } from 'lucide-vue-next'

const router = useRouter()
const tipoUsuario = computed(() => localStorage.getItem('tipoUsuario') || 'cliente')
const mostrarConfirmacion = ref(false)

const confirmarLogout = () => {
  localStorage.removeItem('dni')
  localStorage.removeItem('token')
  localStorage.removeItem('tipoUsuario')
  router.push('/login')
}
</script>

<template>
  <!-- NAV -->
  <nav class="mobile-nav">
    <template v-if="tipoUsuario === 'cliente'">
      <router-link to="/reclamos" class="nav-item" active-class="active">
        <ClipboardList class="icon" />
        <small>Reclamos</small>
      </router-link>
      <router-link to="/facturas" class="nav-item" active-class="active">
        <CreditCard class="icon" />
        <small>Facturas</small>
      </router-link>
      <router-link to="/perfil" class="nav-item" active-class="active">
        <User class="icon" />
        <small>Perfil</small>
      </router-link>
    </template>

    <template v-else-if="tipoUsuario === 'empleado'">
      <router-link to="/reclamos-empleados" class="nav-item" active-class="active">
        <ClipboardList class="icon" />
        <small>Reclamos</small>
      </router-link>
      <router-link to="/chatbot" class="nav-item" active-class="active">
        <User class="icon" />
        <small>Chatbot</small>
      </router-link>
    </template>

    <button @click="mostrarConfirmacion = true" class="nav-item text-red-400 hover:text-red-300 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
      </svg>
      <small>Salir</small>
    </button>
  </nav>

  <!-- MODAL -->
  <transition name="fade">
    <div v-if="mostrarConfirmacion" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 text-center">
        <h3 class="text-lg font-semibold text-slate-800 mb-2">¿Cerrar sesión?</h3>
        <p class="text-sm text-slate-600 mb-4">Perderás el acceso hasta que vuelvas a iniciar sesión.</p>
        <div class="flex justify-center gap-4">
          <button @click="confirmarLogout"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            Sí, salir
          </button>
          <button @click="mostrarConfirmacion = false"
                  class="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.mobile-nav {
  display: none;
}
@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1f2937;
    border-top: 1px solid #374151;
    padding: 0.5rem 1rem;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #d1d5db;
    font-size: 0.8rem;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-item.active {
    color: #60a5fa;
  }

  .nav-item:hover {
    color: #93c5fd;
  }

  .icon {
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
