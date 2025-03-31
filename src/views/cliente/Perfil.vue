<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Encabezado del perfil -->
    <div class="flex items-center gap-6 mb-6">
      <div class="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
        {{ avatarIniciales }}
      </div>
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ usuario?.NOMBRE_COMPLETO || usuario?.NombreCompleto }}
        </h2>
        <p class="text-sm text-gray-500">DNI: {{ usuario?.DNI }}</p>
      </div>
    </div>

    <!-- Card de información -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong class="text-blue-800">Teléfono:</strong> {{ usuario?.CELULAR || usuario?.Telefono || 'No disponible' }}</p>
        <p><strong class="text-blue-800">Email:</strong> {{ usuario?.EMAIL || 'No disponible' }}</p>
        <p><strong class="text-blue-800">Calle:</strong> {{ usuario?.CALLE || usuario?.Calle || 'Sin calle' }}</p>
        <p><strong class="text-blue-800">Barrio:</strong> {{ usuario?.BARRIO || usuario?.Barrio || 'Sin barrio' }}</p>
        <p><strong class="text-blue-800">Código Postal:</strong> {{ usuario?.CODIGO_POSTAL || usuario?.CodigoPostal || 'N/A' }}</p>
        <p><strong class="text-blue-800">Suministro:</strong> {{ usuario?.CODIGO_SUMINISTRO || usuario?.CodigoSuministro || 'N/A' }}</p>
        <p><strong class="text-blue-800">Medidor:</strong> {{ usuario?.NUMERO_MEDIDOR || usuario?.NumeroMedidor || 'N/A' }}</p>
      </div>

      <div class="mt-6 text-right">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          @click="abrirModal"
        >
          Editar información
        </button>
      </div>
    </div>

    <!-- Modal de edición -->
    <transition name="modal-fade">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Editar Información</h3>
          <form @submit.prevent="guardarCambios" class="space-y-4">
            <div>
              <label class="block text-sm font-medium">Email</label>
              <input v-model="form.EMAIL" type="email" class="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium">Teléfono</label>
              <input v-model="form.CELULAR" type="text" class="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium">Calle</label>
              <input v-model="form.CALLE" type="text" class="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium">Barrio</label>
              <input v-model="form.BARRIO" type="text" class="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="cerrarModal" class="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
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
  if (!usuario.value) return '';
  const nombreCompleto = usuario.value.NOMBRE_COMPLETO || usuario.value.NombreCompleto;
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

const abrirModal = () => {
  form.EMAIL = usuario.value?.EMAIL || '';
  form.CELULAR = usuario.value?.CELULAR || '';
  form.CALLE = usuario.value?.CALLE || '';
  form.BARRIO = usuario.value?.BARRIO || '';
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
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
