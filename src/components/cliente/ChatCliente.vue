<template>
    <div class="hidden sm:block fixed bottom-8 right-8 z-50">
      <!-- Bot animado flotante con fondo blanco -->
      <div
        class="w-[5.5rem] h-[5.5rem] rounded-full bg-white shadow-xl ring-1 ring-slate-200 hover:ring-blue-500 transition-all flex items-center justify-center cursor-pointer"
        @click="toggleChat"
      >
        <DotLottieVue
          src="https://lottie.host/6c7bd8b5-d040-420a-97c1-db22f6f9d399/cTIouqc2rR.lottie"
          autoplay
          loop
          style="width: 80%; height: 80%; transform: scale(1.1);"
        />
      </div>
  
      <!-- Panel del chat -->
      <transition name="chat-panel">
        <div
          v-if="isOpen"
          class="absolute bottom-20 right-0 w-[22rem] h-[30rem] bg-gradient-to-br from-slate-50/90 to-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg border border-slate-300"
        >
          <!-- Cabecera -->
          <div class="px-5 py-4 border-b border-slate-300 bg-white/70 backdrop-blur-sm">
            <h3 class="text-base font-semibold text-slate-700 tracking-wide">
              Asistente Virtual <span class="text-indigo-600 font-bold">DECSA</span>
            </h3>
          </div>
  
          <!-- Preguntas rápidas -->
          <transition name="fade">
            <div
              v-if="mostrarPreguntas"
              class="px-4 py-3 border-b border-slate-200 bg-white/60 flex flex-wrap gap-2 justify-center"
            >
              <button
                v-for="(q, idx) in preguntas"
                :key="idx"
                @click="handlePregunta(q)"
                class="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition cursor-pointer"
              >
                {{ q }}
              </button>
            </div>
          </transition>
  
          <!-- Mensajes -->
          <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-slate-50">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['mb-3 flex flex-col', message.sender === 'user' ? 'items-end' : 'items-start']"
            >
              <div
                :class="[message.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-200 text-slate-800 rounded-bl-sm border-l-4 border-indigo-300 shadow-sm animate-fadeInUp',
                  'px-3 py-2 rounded-lg max-w-[80%] text-sm leading-snug']"
              >
                <span v-if="message.isTyping" class="flex gap-1">
                  <span class="animate-bounce">.</span>
                  <span class="animate-bounce delay-100">.</span>
                  <span class="animate-bounce delay-200">.</span>
                </span>
                <span v-else v-html="message.text"></span>
              </div>
            </div>
          </div>
  
          <!-- Input -->
          <div class="flex p-3 border-t border-slate-200 bg-white">
            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              class="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none"
              :placeholder="isLoading ? 'Cargando...' : 'Escribe tu consulta...'"
              :disabled="isLoading"
            />
            <button
              @click="sendMessage"
              :disabled="isLoading"
              class="ml-2 p-2 text-white rounded-md disabled:opacity-50 transition-all bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
  import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
  
  const isOpen = ref(false);
  const inputMessage = ref('');
  const isLoading = ref(false);
  const messages = ref([
    { sender: 'bot', text: '¡Hola! Soy DECSA, tu asistente virtual. ¿En qué puedo ayudarte hoy?', isTyping: false },
  ]);
  const messagesContainer = ref(null);
  const mostrarPreguntas = ref(true);
  
  const preguntas = [
    'Hola, ¿dónde están ubicados?',
    '¿Qué horarios tienen?',
    '¿Debo alguna factura?',
    'Quiero hacer un reclamo',
  ];
  
  const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) scrollToBottom();
  };
  
  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  };
  
  const handlePregunta = (texto) => {
    inputMessage.value = texto;
    sendMessage();
  };
  
  const sendMessage = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return;
  
    messages.value.push({ sender: 'user', text: inputMessage.value, isTyping: false });
    const userMessage = inputMessage.value;
    inputMessage.value = '';
    isLoading.value = true;
    mostrarPreguntas.value = false;
    scrollToBottom();
  
    messages.value.push({ sender: 'bot', text: '', isTyping: true });
  
    try {
      const response = await fetchBotResponse(userMessage);
      messages.value[messages.value.length - 1].isTyping = false;
      await typeMessage(response, messages.value.length - 1);
    } catch (error) {
      messages.value[messages.value.length - 1].isTyping = false;
      messages.value[messages.value.length - 1].text = 'Lo siento, ocurrió un error. Intenta de nuevo.';
    } finally {
      isLoading.value = false;
      scrollToBottom();
    }
  };
  
  const fetchBotResponse = async (message) => {
    const historial = messages.value
      .filter((msg) => !msg.isTyping)
      .map((msg) => `${msg.sender === 'user' ? 'Usuario' : 'DECSA'}: ${msg.text}`)
      .join(' | ');
  
    const res = await fetch('http://localhost:5000/api/frontend-chatbot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: message, historial }),
    });
  
    if (!res.ok) throw new Error('Error al obtener respuesta');
  
    const data = await res.json();
    return data.respuesta;
  };
  
  const typeMessage = async (text, index) => {
    const words = text.split(' ');
    let currentText = '';
    for (const word of words) {
      currentText += word + ' ';
      messages.value[index].text = currentText;
      await new Promise((resolve) => setTimeout(resolve, 40));
      scrollToBottom();
    }
  };
  
  onMounted(scrollToBottom);
  </script>
  
  <style scoped>
  .chat-panel-enter-active,
  .chat-panel-leave-active {
    transition: all 0.3s ease;
  }
  .chat-panel-enter-from,
  .chat-panel-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out;
  }
  
  iframe {
    max-width: 100%;
    width: 100%;
    height: 180px;
    border: 0;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: block;
  }
  
  a {
    color: #2563eb;
    text-decoration: underline;
  }
  a:hover {
    color: #1e40af;
  }
  </style>
  