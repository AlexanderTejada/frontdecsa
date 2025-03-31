<template>
  <aside class="hidden md:flex flex-col bg-slate-900 text-white w-[200px] lg:w-[240px] xl:w-[280px] h-screen fixed top-0 left-0 z-40 shadow-md">
    <div class="px-6 py-5 border-b border-slate-700">
      <h2 class="text-lg font-semibold">DECSA</h2>
      <p class="text-xs text-slate-400">Panel de gestión</p>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
      <template v-if="tipoUsuario === 'cliente'">
        <router-link to="/reclamos" class="block px-4 py-2 rounded-md hover:bg-slate-800 transition text-sm font-medium" active-class="bg-slate-800">Reclamos</router-link>
        <router-link to="/facturas" class="block px-4 py-2 rounded-md hover:bg-slate-800 transition text-sm font-medium" active-class="bg-slate-800">Facturas</router-link>
        <router-link to="/perfil" class="block px-4 py-2 rounded-md hover:bg-slate-800 transition text-sm font-medium" active-class="bg-slate-800">Perfil</router-link>
      </template>

      <template v-else-if="tipoUsuario === 'empleado'">
        <router-link to="/reclamos-empleados" class="block px-4 py-2 rounded-md hover:bg-slate-800 transition text-sm font-medium" active-class="bg-slate-800">Reclamos</router-link>
        <router-link to="/chatbot" class="block px-4 py-2 rounded-md hover:bg-slate-800 transition text-sm font-medium" active-class="bg-slate-800">Chatbot</router-link>
      </template>
    </nav>

    <div class="px-4 pb-6">
      <button @click="mostrarConfirmacion = true" class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition text-sm font-medium">
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
  </aside>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
