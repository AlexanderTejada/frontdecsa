<template>
  <div class="gestion-usuarios-container px-6 py-12 sm:px-4 sm:py-8 md:px-6 lg:px-12 xl:px-16 max-w-6xl mx-auto w-full">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h2 class="text-2xl font-semibold text-slate-800">Gestión de Empleados</h2>
      <button
        disabled
        class="relative z-10 font-semibold text-base sm:text-sm px-5 py-2 sm:px-4 sm:py-2 rounded-lg
               bg-gradient-to-r from-slate-400 via-slate-300 to-slate-200 border border-slate-400/30
               text-white shadow-md transition-all duration-500 ease-in-out overflow-hidden
               cursor-not-allowed"
      >
        <span class="relative z-10">+ Crear Usuario</span>
        <span class="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-700"></span>
      </button>
    </div>

    <!-- Contenido central -->
    <div class="flex justify-center items-center min-h-[60vh] bg-slate-50 rounded-xl border border-dashed border-indigo-300 shadow-inner">
      <div class="text-center px-8 py-12">
        <h1 class="text-5xl sm:text-6xl font-extrabold text-indigo-600 mb-4 tracking-wider drop-shadow-md">PRONTO</h1>
        <p class="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
          Este módulo te permitirá gestionar los usuarios internos, roles y permisos del sistema. 
          Estamos trabajando para que pronto puedas crear, editar y anular empleados desde aquí.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vista estática por ahora. En el futuro se puede conectar al backend de usuarios y roles.
</script>

<style scoped>
.gestion-usuarios-container {
  animation: fadeIn 0.6s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
