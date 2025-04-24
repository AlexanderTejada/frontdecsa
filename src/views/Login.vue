<!-- views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Lado izquierdo: Bienvenida -->
      <div class="login-left">
        <h1>Bienvenido a <span class="decsa">DECSA</span></h1>
        <p>
          Ingresa con tus credenciales para gestionar tus reclamos, ver tus facturas y más.
        </p>
      </div>

      <!-- Lado derecho: Formulario -->
      <div class="login-right">
        <h2>Acceso</h2>

        <!-- Selector de tipo de usuario -->
        <div class="tipo-usuario">
          <button
            :class="{ active: tipoUsuario === 'cliente' }"
            @click="tipoUsuario = 'cliente'"
          >
            Cliente
          </button>
          <button
            :class="{ active: tipoUsuario === 'empleado' }"
            @click="tipoUsuario = 'empleado'"
          >
            Empleado
          </button>
        </div>

        <form @submit.prevent="login">
          <!-- Formulario para Cliente -->
          <div v-if="tipoUsuario === 'cliente'" class="input-group">
            <input
              v-model="dni"
              id="dni"
              type="text"
              placeholder="DNI"
              autocomplete="username"
              required
            />
          </div>
          <div v-if="tipoUsuario === 'cliente'" class="input-group">
            <input
              v-model="suministro"
              id="suministro"
              type="password"
              placeholder="N° de cuenta"
              autocomplete="current-password"
              required
            />
          </div>

          <!-- Formulario para Empleado -->
          <div v-if="tipoUsuario === 'empleado'" class="input-group">
            <input
              v-model="usuario"
              id="usuario"
              type="text"
              placeholder="Usuario"
              autocomplete="username"
              required
            />
          </div>
          <div v-if="tipoUsuario === 'empleado'" class="input-group">
            <input
              v-model="contrasena"
              id="contrasena"
              type="password"
              placeholder="Contraseña"
              autocomplete="current-password"
              required
            />
          </div>

          <button type="submit">Ingresar</button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerUsuario } from '@/services/usuariosService'
import api from '@/services/http'

const tipoUsuario = ref('cliente')
const dni = ref('')
const suministro = ref('')
const usuario = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''

  if (tipoUsuario.value === 'cliente') {
    const dniTrimmed = dni.value.trim()

    if (!dniTrimmed || dniTrimmed === 'null') {
      error.value = 'Debe ingresar un DNI válido.'
      return
    }

    try {
      const usuarioData = await obtenerUsuario(dniTrimmed)
      console.log('🔎 Usuario recibido:', usuarioData)

      const suministroDB = (
        usuarioData?.codigo_suministro ||
        usuarioData?.CODIGO_SUMINISTRO ||
        usuarioData?.CodigoSuministro ||
        ''
      ).toString().trim()

      const suministroIngresado = suministro.value.trim()

      if (!usuarioData || suministroIngresado !== suministroDB) {
        console.warn('⚠️ Suministro no coincide:', suministroIngresado, 'vs', suministroDB)
        error.value = 'Credenciales inválidas.'
        return
      }

      console.log('🔐 Guardando DNI en localStorage:', dniTrimmed)
      localStorage.setItem('dni', dniTrimmed)
      localStorage.setItem('tipoUsuario', 'cliente')
      router.push('/dashboard')
    } catch (err) {
      console.error('❌ Error en login cliente:', err)
      error.value = 'Error al intentar iniciar sesión.'
      localStorage.removeItem('dni')
      localStorage.removeItem('tipoUsuario')
    }

  } else {
    try {
      const response = await api.post('/api/admin/usuarios/login', {
        Usuario: usuario.value,
        Pass: contrasena.value,
      })

      const token = response.data.access_token
      localStorage.setItem('token', token)
      localStorage.setItem('tipoUsuario', 'empleado')
      router.push('/reclamos-empleados')
    } catch (err) {
      console.error('❌ Error en login empleado:', err)
      error.value = 'Credenciales inválidas o error al iniciar sesión.'
      localStorage.removeItem('token')
      localStorage.removeItem('tipoUsuario')
    }
  }
}
</script>



<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 4vh 4vw;
  background: linear-gradient(135deg, #b0d8f3, #fdfdfd);
  box-sizing: border-box;
}

.login-box {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 60em;
  min-height: 60vh;
  overflow: hidden;
  box-shadow: 0 2em 4em rgba(0, 0, 0, 0.2);
  background: #fff;
  flex-grow: 1;
}

@media (min-width: 40em) {
  .login-box {
    flex-direction: row;
  }
}

/* IZQUIERDA */
.login-left {
  flex: 1 1 50%;
  padding: 2em;
  background: linear-gradient(135deg, #9aa6ec, #4534ff);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.login-left h1 {
  font-size: 2em;
  margin-bottom: 1em;
}

.decsa {
  text-transform: uppercase;
  font-weight: bold;
}

.login-left p {
  font-size: 1em;
  line-height: 1.6;
  max-width: 90%;
}

/* DERECHA */
.login-right {
  flex: 1 1 50%;
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.login-right h2 {
  text-align: center;
  margin-bottom: 1.5em;
  color: #1e3a8a;
  font-size: 1.5em;
}

.tipo-usuario {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5em;
}

.tipo-usuario button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f3f4f6;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color:#1e3a8a;
}

.tipo-usuario button.active {
  background: linear-gradient(to right, #5a0eb7, #1e60d6);
  color: white;
  border-color: #3b82f6;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 0.8em 1em;
  border: 0.08em solid #cbd5e1;
  border-radius: 0.5em;
  font-size: 1em;
  outline: none;
  transition: border 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #3b82f6;
}

button {
  padding: 0.9em;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}

button:hover {
  background: linear-gradient(to right, #5a0eb7, #1e60d6);
  color: white;
}

.error {
  margin-top: 1em;
  color: #dc2626;
  text-align: center;
  font-size: 0.9em;
}@media (max-width: 640px) {
  /* Contenedor general */
  .login-box {
    flex-direction: column;
    padding: 0;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
    border-radius: 8px;

  }

  /* Lado izquierdo: bienvenida */
  .login-left {
    padding: 1.3rem;
    align-items: center;
    text-align: center;
  }

  .login-left h1 {
    font-size: 1.8em;
    text-align: center;
  }

  .login-left p {
    font-size: 1.1em;
    line-height: 1.5;
    max-width: 100%;
    padding: 0 1rem;
    text-align: center;
  }

  /* Lado derecho: formulario */
  .login-right {
    padding: 1.5rem;
  }

  .login-right h2 {
    font-size: 1.3em;
    margin-bottom: 1.2rem;
  }

  /* Selector de tipo de usuario */
  .tipo-usuario {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .tipo-usuario button {
    width: 100%;
    font-size: 0.95em;
    padding: 0.6rem 1rem;
    background: #f3f4f6;
    color: #4b5563;
  }

  .tipo-usuario button.active {
    background: linear-gradient(to right, #5a0eb7, #1e60d6);
    color: white;
    border-color: #3b82f6;
  }

  /* Inputs */
  .input-group input {
    font-size: 1.05em;
    padding: 0.9em 1em;
  }

  /* Botón de ingreso */
  button[type="submit"] {
    padding: 1.2rem;
    font-size: 1.1em;
    border-radius: 8px;
  }

  /* Error */
  .error {
    font-size: 1em;
  }
}

</style>