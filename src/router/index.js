// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Reclamos from '../views/cliente/Reclamos.vue';
import Facturas from '../views/cliente/Facturas.vue';
import Perfil from '../views/cliente/Perfil.vue';
import ChatClienteMobile from '../views/cliente/ChatClienteMobile.vue';

import ReclamosEmpleados from '../views/empleados/ReclamosEmpleados.vue';
import Chatbot from '../views/empleados/Chatbot.vue';
import GestionUsuarios from '../views/empleados/GestionUsuarios.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/dashboard', component: () => import('../views/cliente/DashboardCliente.vue'), meta: { requiresCliente: true } },
  { path: '/chat', component: ChatClienteMobile, meta: { requiresCliente: true } },

  { path: '/reclamos', component: Reclamos, meta: { requiresCliente: true } },
  { path: '/facturas', component: Facturas, meta: { requiresCliente: true } },
  { path: '/perfil', component: Perfil, meta: { requiresCliente: true } },
  { path: '/reclamos-empleados', component: ReclamosEmpleados, meta: { requiresEmpleado: true } },
  { path: '/chatbot', component: Chatbot, meta: { requiresEmpleado: true } },
  { path: '/gestion-usuarios', component: GestionUsuarios, meta: { requiresAdmin: true } },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const dniGuardado = localStorage.getItem('dni');
  const tokenGuardado = localStorage.getItem('token');

  // Cliente
  if (to.meta.requiresCliente) {
    if (!dniGuardado || tipoUsuario !== 'cliente') {
      next('/login');
      return;
    }
  }

  // Empleado
  if (to.meta.requiresEmpleado) {
    if (!tokenGuardado || tipoUsuario !== 'empleado') {
      next('/login');
      return;
    }
  }

  // Admin
  if (to.meta.requiresAdmin) {
    if (!tokenGuardado || tipoUsuario !== 'empleado') {
      next('/login');
      return;
    }

    const usuario = localStorage.getItem('usuario');
    if (usuario !== 'pruebamodifica') {
      next('/reclamos-empleados');
      return;
    }
  }

  // Sin sesión y fuera de login
  if (to.path !== '/login' && !dniGuardado && !tokenGuardado) {
    next('/login');
    return;
  }

  // Ya logueado, redirigir desde login
  if (to.path === '/login' && (dniGuardado || tokenGuardado)) {
    if (tipoUsuario === 'cliente') {
      next('/dashboard');
    } else if (tipoUsuario === 'empleado') {
      next('/reclamos-empleados');
    }
    return;
  }

  next();
});

export default router;
