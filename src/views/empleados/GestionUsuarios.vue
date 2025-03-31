<!-- views/empleados/GestionUsuarios.vue -->
<template>
    <div class="gestion-usuarios-container">
      <div class="header">
        <h2>Gestión de Usuarios</h2>
        <button class="crear-btn" @click="abrirModalCrear">
          + Crear Usuario
        </button>
      </div>
  
      <div v-if="usuarios.length === 0" class="no-usuarios">
        No hay usuarios disponibles para mostrar.
      </div>
  
      <div v-else class="contenedor-scroll">
        <table class="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.IdUsuario">
              <td>{{ usuario.Usuario }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.roles.map(r => r.Nombre).join(', ') }}</td>
              <td>
                <span :class="usuario.Anulado ? 'estado-anulado' : 'estado-activo'">
                  {{ usuario.Anulado ? 'Anulado' : 'Activo' }}
                </span>
              </td>
              <td>
                <button class="edit-btn" @click="abrirModalEditar(usuario)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="abrirModalEliminar(usuario)"
                  :disabled="usuario.Anulado"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal para Crear/Editar -->
      <transition name="modal-fade">
        <div v-if="mostrarModalCrear || mostrarModalEditar" class="modal-overlay">
          <div class="modal">
            <h3>{{ mostrarModalCrear ? 'Crear Usuario' : 'Editar Usuario' }}</h3>
            <form @submit.prevent="guardarUsuario">
              <label>Usuario:</label>
              <input v-model="form.Usuario" type="text" required />
  
              <label>Email:</label>
              <input v-model="form.email" type="email" required />
  
              <label>Contraseña:</label>
              <input
                v-model="form.Pass"
                type="password"
                :required="mostrarModalCrear"
                :placeholder="mostrarModalEditar ? 'Dejar en blanco para no cambiar' : ''"
              />
  
              <label>Roles:</label>
              <select v-model="form.roles" multiple required>
                <option v-for="rol in rolesDisponibles" :key="rol.IdRol" :value="rol.Nombre">
                  {{ rol.Nombre }}
                </option>
              </select>
  
              <div class="modal-buttons">
                <button type="submit">Guardar</button>
                <button @click.prevent="cerrarModal" class="cancel">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
  
      <!-- Modal para Eliminar -->
      <transition name="modal-fade">
        <div v-if="mostrarModalEliminar" class="modal-overlay">
          <div class="modal">
            <h3>Eliminar Usuario</h3>
            <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ usuarioSeleccionado?.Usuario }}</strong>?</p>
            <div class="modal-buttons">
              <button class="delete-confirm" @click="eliminarUsuario">Eliminar</button>
              <button @click="cerrarModal" class="cancel">Cancelar</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/services/http';
  
  const usuarios = ref([]);
  const rolesDisponibles = ref([]);
  const mostrarModalCrear = ref(false);
  const mostrarModalEditar = ref(false);
  const mostrarModalEliminar = ref(false);
  const usuarioSeleccionado = ref(null);
  
  const form = ref({
    Usuario: '',
    email: '',
    Pass: '',
    roles: [],
    OperadorCrea: '',
    OperadorModifica: '',
  });
  
  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/api/admin/usuarios', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      usuarios.value = response.data;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      usuarios.value = [];
    }
  };
  
  const cargarRoles = async () => {
    try {
      const response = await api.get('/api/admin/roles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      rolesDisponibles.value = response.data;
    } catch (error) {
      console.error('Error al cargar roles:', error);
      rolesDisponibles.value = [];
    }
  };
  
  const abrirModalCrear = () => {
    form.value = {
      Usuario: '',
      email: '',
      Pass: '',
      roles: [],
      OperadorCrea: localStorage.getItem('usuario') || 'admin',
      OperadorModifica: '',
    };
    mostrarModalCrear.value = true;
  };
  
  const abrirModalEditar = (usuario) => {
    usuarioSeleccionado.value = usuario;
    form.value = {
      Usuario: usuario.Usuario,
      email: usuario.email,
      Pass: '',
      roles: usuario.roles.map(r => r.Nombre),
      OperadorCrea: '',
      OperadorModifica: localStorage.getItem('usuario') || 'admin',
    };
    mostrarModalEditar.value = true;
  };
  
  const abrirModalEliminar = (usuario) => {
    usuarioSeleccionado.value = usuario;
    mostrarModalEliminar.value = true;
  };
  
  const cerrarModal = () => {
    mostrarModalCrear.value = false;
    mostrarModalEditar.value = false;
    mostrarModalEliminar.value = false;
    usuarioSeleccionado.value = null;
  };
  
  const guardarUsuario = async () => {
    try {
      if (mostrarModalCrear.value) {
        await api.post('/api/admin/usuarios', form.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        await api.put(`/api/admin/usuarios/${usuarioSeleccionado.value.IdUsuario}`, form.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
      cerrarModal();
      await cargarUsuarios();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario. Verifica los datos e intenta de nuevo.');
    }
  };
  
  const eliminarUsuario = async () => {
    try {
      await api.delete(`/api/admin/usuarios/${usuarioSeleccionado.value.IdUsuario}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          OperadorAnula: localStorage.getItem('usuario') || 'admin',
        },
      });
      cerrarModal();
      await cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario. Intenta de nuevo.');
    }
  };
  
  onMounted(async () => {
    await cargarUsuarios();
    await cargarRoles();
  });
  </script>
  
  <style scoped>
  .gestion-usuarios-container {
    padding: 3rem 2rem;
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  h2 {
    color: #1f2937;
    font-size: 1.5rem;
  }
  
  .crear-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .crear-btn:hover {
    background-color: #2563eb;
  }
  
  .no-usuarios {
    text-align: center;
    color: #64748b;
    font-size: 1.2rem;
    padding: 2rem;
  }
  
  .contenedor-scroll {
    max-height: 60vh;
    overflow-y: auto;
    padding: 10px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.219);
  }
  
  .contenedor-scroll::-webkit-scrollbar {
    width: 8px;
  }
  
  .contenedor-scroll::-webkit-scrollbar-track {
    background: #e0dfdf62;
    border-radius: 12px;
    margin-block: 9px;
  }
  
  .contenedor-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(120deg, #27b1db, #29c8dd);
    border-radius: 12px;
    border: 2px solid #ffe5e5;
  }
  
  .contenedor-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(120deg, #209bff, #27ffff);
  }
  
  @supports (scrollbar-width: ) {
    .contenedor-scroll {
      scrollbar-width: thin;
      scrollbar-color: #6babff #fcfcfc00;
      border-radius: 16px;
    }
  }
  
  .usuarios-table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
  }
  
  .usuarios-table th,
  .usuarios-table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .usuarios-table th {
    background: #f9fafb;
    color: #1f2937;
    font-weight: 600;
  }
  
  .usuarios-table tr:hover {
    background: #f3f4f6;
  }
  
  .estado-activo {
    color: #15803d;
    background: #dcfce7;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  
  .estado-anulado {
    color: #b45309;
    background: #fef3c7;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  
  .edit-btn,
  .delete-btn {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-right: 0.5rem;
    transition: background 0.3s ease;
  }
  
  .edit-btn {
    background: #3b82f6;
    color: white;
  }
  
  .edit-btn:hover {
    background: #2563eb;
  }
  
  .delete-btn {
    background: #ef4444;
    color: white;
  }
  
  .delete-btn:hover {
    background: #dc2626;
  }
  
  .delete-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(6px);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    transition: backdrop-filter 0.3s ease;
  }
  
  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .modal h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
  
  .modal label {
    display: block;
    margin-top: 1rem;
    font-weight: 600;
  }
  
  .modal input,
  .modal select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
  }
  
  .modal select {
    height: 100px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .modal-buttons button {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
  }
  
  .modal-buttons .cancel {
    background: #e5e7eb;
    color: #111827;
  }
  
  .modal-buttons button[type="submit"],
  .delete-confirm {
    background: #3b82f6;
    color: white;
  }
  
  .delete-confirm {
    background: #ef4444;
  }
  
  .delete-confirm:hover {
    background: #dc2626;
  }
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .gestion-usuarios-container {
      padding: 1rem;
    }
  
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  
    .crear-btn {
      width: 100%;
    }
  
    .usuarios-table th,
    .usuarios-table td {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
  
    .edit-btn,
    .delete-btn {
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
    }
  
    .modal {
      max-width: 90%;
      padding: 1.5rem;
    }
  
    .modal h3 {
      font-size: 1.1rem;
    }
  
    .modal input,
    .modal select {
      font-size: 0.9rem;
    }
  
    .modal-buttons button {
      padding: 0.5rem 1rem;
    }
  }
  </style>