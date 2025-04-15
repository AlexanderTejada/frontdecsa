import { createRouter, createWebHistory } from 'vue-router';

// Cliente
import Reclamos from '../views/cliente/Reclamos.vue';
import Facturas from '../views/cliente/Facturas.vue';
import Perfil from '../views/cliente/Perfil.vue';
import ChatClienteMobile from '../views/cliente/ChatClienteMobile.vue';
import DashboardCliente from '../views/cliente/DashboardCliente.vue';

// Empleado
import ReclamosEmpleados from '../views/empleados/ReclamosEmpleados.vue';
import Chatbot from '../views/empleados/Chatbot.vue';
import GestionUsuarios from '../views/empleados/GestionUsuarios.vue';
import DashboardAdministrativo from '../views/empleados/DashboardAdministrativo.vue';
import Avisos from '../views/empleados/Avisos.vue';

// Login
import Login from '../views/Login.vue';

const routes = [
  // Acceso y redirección base
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },

  // Cliente
  { path: '/dashboard', component: DashboardCliente, meta: { requiresCliente: true } },
  { path: '/chat', component: ChatClienteMobile, meta: { requiresCliente: true } },
  { path: '/reclamos', component: Reclamos, meta: { requiresCliente: true } },
  { path: '/facturas', component: Facturas, meta: { requiresCliente: true } },
  { path: '/perfil', component: Perfil, meta: { requiresCliente: true } },

  // Empleado
  { path: '/dashboard-admin', component: DashboardAdministrativo, meta: { requiresEmpleado: true } },
  { path: '/reclamos-empleados', component: ReclamosEmpleados, meta: { requiresEmpleado: true } },
  { path: '/chatbot', component: Chatbot, meta: { requiresEmpleado: true } },
  { path: '/avisos', component: Avisos, meta: { requiresEmpleado: true } },

  // Habilitado temporalmente para cualquier "empleado"
  { path: '/gestion-usuarios', component: GestionUsuarios, meta: { requiresEmpleado: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const dniGuardado = localStorage.getItem('dni');
  const tokenGuardado = localStorage.getItem('token');

  // 🔐 Cliente
  if (to.meta.requiresCliente) {
    if (!dniGuardado || tipoUsuario !== 'cliente') {
      return next('/login');
    }
  }

  // 🔐 Empleado
  if (to.meta.requiresEmpleado) {
    if (!tokenGuardado || tipoUsuario !== 'empleado') {
      return next('/login');
    }
  }

  // 🔄 Redirección si ya hay sesión activa
  if (to.path === '/login' && (dniGuardado || tokenGuardado)) {
    return next(tipoUsuario === 'cliente' ? '/dashboard' : '/dashboard-admin');
  }

  // 🔐 Bloqueo si intenta navegar sin sesión
  if (to.path !== '/login' && !dniGuardado && !tokenGuardado) {
    return next('/login');
  }

  next();
});

export default router;
