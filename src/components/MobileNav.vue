<template>
  <transition name="slide-fade">
    <aside
      v-if="mostrar"
      class="fixed inset-0 z-50 flex flex-col backdrop-blur-lg bg-white/30 text-slate-800 shadow-2xl md:hidden"
    >
      <!-- Encabezado -->
      <div class="px-6 py-5 border-b border-slate-300 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">DECSA</h2>
        </div>
        <button @click="cerrar" class="text-slate-500 hover:text-slate-800 transition-transform transform hover:scale-110 duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-10 text-lg font-medium">
        <template v-if="tipoUsuario === 'cliente'">
          <router-link to="/dashboard" class="nav-link" active-class="active" @click="cerrar">Inicio</router-link>
          <router-link to="/reclamos" class="nav-link" active-class="active" @click="cerrar">Reclamos</router-link>
          <router-link to="/facturas" class="nav-link" active-class="active" @click="cerrar">Facturas</router-link>
          <router-link to="/perfil" class="nav-link" active-class="active" @click="cerrar">Perfil</router-link>
          <router-link to="/chat" class="nav-link" active-class="active" @click="cerrar">Asistente Reclamos</router-link>
        </template>

        <template v-else-if="tipoUsuario === 'empleado'">
          <router-link to="/reclamos-empleados" class="nav-link" active-class="active" @click="cerrar">Reclamos</router-link>
          <router-link to="/chatbot" class="nav-link" active-class="active" @click="cerrar">Chatbot</router-link>
        </template>
      </nav>

      <!-- Botón cerrar sesión -->
      <div class="px-4 pb-6 flex justify-center">
        <button @click="mostrarConfirmacion = true" class="logout-button">
          Cerrar sesión
        </button>
      </div>

      <!-- Modal de confirmación -->
      <transition name="fade">
        <div v-if="mostrarConfirmacion" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 text-center">
            <h3 class="text-lg font-semibold text-slate-800 mb-2">¿Cerrar sesión?</h3>
            <p class="text-sm text-slate-600 mb-4">Perderás el acceso hasta que vuelvas a iniciar sesión.</p>
            <div class="flex justify-center gap-4">
              <button @click="confirmarLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                Sí, salir
              </button>
              <button @click="mostrarConfirmacion = false" class="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </transition>
    </aside>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['cerrar'])

const router = useRouter()
const mostrar = ref(false)
const mostrarConfirmacion = ref(false)

const tipoUsuario = computed(() => localStorage.getItem('tipoUsuario') || 'cliente')

onMounted(() => {
  requestAnimationFrame(() => {
    mostrar.value = true
  })
})

const cerrar = () => {
  mostrar.value = false
  setTimeout(() => emit('cerrar'), 400)
}

const confirmarLogout = () => {
  localStorage.removeItem('dni')
  localStorage.removeItem('token')
  localStorage.removeItem('tipoUsuario')
  router.push('/login')
}
</script>

<style scoped>
/* Transición principal */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Transición para el modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilo de los enlaces */
.nav-link {
  text-decoration: none;
  color: #18315a;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: background 0.3s, color 0.3s, transform 0.2s ease-in-out;
}
.nav-link:hover {
  background-color: rgba(30, 58, 138, 0.1);
  color: #1e40af;
  transform: scale(1.05);
}
.nav-link.active {
  background: linear-gradient(to right, #270eb783, #3aaffd);
  color: #ffffffd3;
}

/* Botón logout */
.logout-button {
  background: transparent;
  color: #ef4444;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #ef4444;
  border-radius: 9999px;
  transition: all 0.3s ease;
}
.logout-button:hover {
  background-color: #ef4444;
  color: white;
}
</style>