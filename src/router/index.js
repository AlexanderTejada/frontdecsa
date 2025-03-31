// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Reclamos from '../views/cliente/Reclamos.vue';
import Facturas from '../views/cliente/Facturas.vue';
import Perfil from '../views/cliente/Perfil.vue';
import ReclamosEmpleados from '../views/empleados/ReclamosEmpleados.vue';
import Chatbot from '../views/empleados/Chatbot.vue';
import GestionUsuarios from '../views/empleados/GestionUsuarios.vue'; // Nueva vista
import Login from '../views/Login.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/reclamos', component: Reclamos, meta: { requiresCliente: true } },
  { path: '/facturas', component: Facturas, meta: { requiresCliente: true } },
  { path: '/perfil', component: Perfil, meta: { requiresCliente: true } },
  { path: '/reclamos-empleados', component: ReclamosEmpleados, meta: { requiresEmpleado: true } },
  { path: '/chatbot', component: Chatbot, meta: { requiresEmpleado: true } },
  { path: '/gestion-usuarios', component: GestionUsuarios, meta: { requiresAdmin: true } }, // Nueva ruta
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const dniGuardado = localStorage.getItem('dni');
  const tokenGuardado = localStorage.getItem('token');

  // Si la ruta requiere un cliente
  if (to.meta.requiresCliente) {
    if (!dniGuardado || tipoUsuario !== 'cliente') {
      next('/login');
      return;
    }
  }

  // Si la ruta requiere un empleado
  if (to.meta.requiresEmpleado) {
    if (!tokenGuardado || tipoUsuario !== 'empleado') {
      next('/login');
      return;
    }
  }

  // Si la ruta requiere un admin
  if (to.meta.requiresAdmin) {
    if (!tokenGuardado || tipoUsuario !== 'empleado') {
      next('/login');
      return;
    }
    // Verificar el rol "admin" (esto debería hacerse en el backend, pero lo simulamos aquí)
    // En un sistema real, el backend debería devolver los roles en el token y verificarlos
    const usuario = localStorage.getItem('usuario');
    if (usuario !== 'pruebamodifica') { // Simulamos que solo pruebamodifica es admin
      next('/reclamos-empleados');
      return;
    }
  }

  // Si no hay sesión y no estamos en login, redirigir a login
  if (to.path !== '/login' && !dniGuardado && !tokenGuardado) {
    next('/login');
    return;
  }

  // Si estamos en login y ya hay sesión, redirigir según el tipo de usuario
  if (to.path === '/login' && (dniGuardado || tokenGuardado)) {
    if (tipoUsuario === 'cliente') {
      next('/reclamos');
    } else if (tipoUsuario === 'empleado') {
      next('/reclamos-empleados');
    }
    return;
  }

  next();
});

export default router;