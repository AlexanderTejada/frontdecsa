<!-- components/LoadingElectric.vue -->
<template>
    <div class="loading-overlay">
      <div class="electric-container">
        <div
          class="bolt"
          v-for="n in 5"
          :key="n"
          :style="{ animationDelay: `${n * 0.1}s` }"
        ></div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5); /* Más acorde al sistema blanco */
    backdrop-filter: blur(4px);
    z-index: 9999;
  }
  
  .electric-container {
    display: flex;
    gap: 10px;
    padding: 20px 30px;
    border-radius: 16px;
  }
  
  .bolt {
    width: 10px;
    height: 40px;
    border-radius: 4px;
    background: linear-gradient(180deg, #15b9fa, #6cc4ff);
    animation: spark 0.8s ease-in-out infinite;
    opacity: 1;
    box-shadow: 0 0 6px #99f3ff;
  }
  
  @keyframes spark {
    0%, 100% {
      transform: scaleY(1);
      box-shadow: 0 0 2px #70f5ff;
      opacity: 0.6;
    }
    50% {
      transform: scaleY(1.8);
      box-shadow: 0 0 10px #8ae8ff;
      opacity: 1;
    }
  }
  </style>
  