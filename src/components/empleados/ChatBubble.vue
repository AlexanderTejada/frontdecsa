<template>
  <!-- Visible solo en pantallas sm o mayores -->
  <div class="hidden sm:block fixed bottom-8 right-8 z-50">
    <!-- Botón flotante -->
    <div
      class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg cursor-pointer transition hover:scale-110"
      :class="{ 'bg-gradient-to-br from-red-400 to-red-500': isOpen }"
      @click="toggleChat"
    >
      <svg
        v-if="!isOpen"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-7 h-7 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-7 h-7 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>

    <!-- Panel de chat -->
    <transition name="chat-panel">
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
      >
        <div class="bg-gradient-to-br from-blue-500 to-blue-400 text-white p-4 text-center border-b border-slate-200">
          <h3 class="text-base font-medium">Consulta Rápida</h3>
        </div>

        <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-slate-50">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['mb-3 flex flex-col', message.sender === 'user' ? 'items-end' : 'items-start']"
          >
            <div
              :class="[message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-slate-200 text-slate-800 rounded-bl-sm', 'px-3 py-2 rounded-lg max-w-[80%] text-sm leading-snug']"
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
            class="ml-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';

const isOpen = ref(false);
const inputMessage = ref('');
const isLoading = ref(false);
const messages = ref([
  { sender: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?', isTyping: false },
]);
const messagesContainer = ref(null);

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

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  messages.value.push({ sender: 'user', text: inputMessage.value, isTyping: false });
  const userMessage = inputMessage.value;
  inputMessage.value = '';
  isLoading.value = true;
  scrollToBottom();

  messages.value.push({ sender: 'bot', text: '', isTyping: true });
  try {
    const response = await simulateBotResponse(userMessage);
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

const simulateBotResponse = async (message) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `Entendido, has preguntado: "${message}".`;
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
</style>