<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Encabezado del perfil -->
    <div class="flex items-center gap-6 mb-6">
      <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-400 text-white flex items-center justify-center text-3xl font-bold shadow-md select-none">
        {{ avatarIniciales }}
      </div>
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">
          {{ usuario?.nombre_completo || usuario?.NOMBRE_COMPLETO || usuario?.NombreCompleto || 'Usuario' }}
        </h2>
        <p class="text-sm text-slate-500">DNI: {{ usuario?.dni || usuario?.DNI || 'N/A' }}</p>
      </div>
    </div>

    <!-- Card de información -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
        <p><strong class="text-blue-800">Teléfono:</strong> {{ usuario?.celular || usuario?.CELULAR || usuario?.Telefono || 'No disponible' }}</p>
        <p><strong class="text-blue-800">Email:</strong> {{ usuario?.email || usuario?.EMAIL || 'No disponible' }}</p>
        <p><strong class="text-blue-800">Calle:</strong> {{ usuario?.calle || usuario?.CALLE || 'Sin calle' }}</p>
        <p><strong class="text-blue-800">Barrio:</strong> {{ usuario?.barrio || usuario?.BARRIO || 'Sin barrio' }}</p>
        <p><strong class="text-blue-800">Código Postal:</strong> {{ usuario?.codigo_postal || usuario?.CODIGO_POSTAL || 'N/A' }}</p>
        <p><strong class="text-blue-800">Suministro:</strong> {{ usuario?.codigo_suministro || usuario?.CODIGO_SUMINISTRO || 'N/A' }}</p>
        <p><strong class="text-blue-800">Medidor:</strong> {{ usuario?.numero_medidor || usuario?.NUMERO_MEDIDOR || 'N/A' }}</p>
      </div>

      <div class="mt-6 text-right">
        <button
          @click="abrirModal"
          class="cursor-pointer px-5 py-2 font-medium text-sm text-white rounded-md shadow-md bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400 hover:from-indigo-700 hover:to-sky-600 transition-all duration-300"
        >
          Editar información
        </button>
      </div>
    </div>

    <!-- Modal de edición -->
    <Transition name="modal-fade">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md transform transition-transform duration-300">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Editar Información</h3>
          <form @submit.prevent="guardarCambios" class="space-y-4">
            <div v-for="campo in campos" :key="campo.id">
              <label :for="campo.id" class="block text-sm font-medium text-slate-700">{{ campo.label }}</label>
              <input
                v-model="form[campo.id]"
                :type="campo.type"
                :id="campo.id"
                class="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="cerrarModal"
                class="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium rounded-md transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition shadow-md"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerUsuario, actualizarDatosUsuario } from '@/services/usuariosService';

const usuario = ref(null);
const dniUsuario = localStorage.getItem('dni');
const router = useRouter();

const obtenerDatosUsuario = async () => {
  if (!dniUsuario) {
    router.push('/login');
    return;
  }

  try {
    const data = await obtenerUsuario(dniUsuario);
    usuario.value = data;
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error);
  }
};

const avatarIniciales = computed(() => {
  const nombreCompleto = usuario.value?.nombre_completo || usuario.value?.NOMBRE_COMPLETO || usuario.value?.NombreCompleto || '';
  return nombreCompleto
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const mostrarModal = ref(false);
const form = reactive({
  EMAIL: '',
  CELULAR: '',
  CALLE: '',
  BARRIO: ''
});

const campos = [
  { id: 'EMAIL', label: 'Email', type: 'email' },
  { id: 'CELULAR', label: 'Teléfono', type: 'text' },
  { id: 'CALLE', label: 'Calle', type: 'text' },
  { id: 'BARRIO', label: 'Barrio', type: 'text' },
];

const abrirModal = () => {
  form.EMAIL = usuario.value?.email || usuario.value?.EMAIL || '';
  form.CELULAR = usuario.value?.celular || usuario.value?.CELULAR || '';
  form.CALLE = usuario.value?.calle || usuario.value?.CALLE || '';
  form.BARRIO = usuario.value?.barrio || usuario.value?.BARRIO || '';
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const guardarCambios = async () => {
  try {
    await actualizarDatosUsuario(dniUsuario, form);
    mostrarModal.value = false;
    await obtenerDatosUsuario();
  } catch (error) {
    console.error('Error al actualizar datos:', error);
  }
};

onMounted(obtenerDatosUsuario);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-leave-to {
  opacity: 0;
}
</style>
