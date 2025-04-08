<template>
  <div class="flex flex-col h-215 w-full bg-gradient-to-br from-slate-100 to-white">
    <!-- Área de mensajes -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'max-w-xl px-5 py-3 rounded-xl text-sm shadow-md whitespace-pre-wrap break-words',
          message.sender === 'user'
            ? 'bg-blue-600 text-white self-end ml-auto'
            : 'bg-slate-200 text-slate-800 self-start'
        ]"
      >
        <span v-if="message.isTyping" class="inline-block animate-pulse">...</span>
        <span v-else v-html="message.text" />
      </div>
    </div>

    <!-- Input -->
    <div class="px-6 py-4 bg-white border-t border-slate-300 flex items-center gap-3">
      <textarea
        v-model="inputMessage"
        @keyup.enter.exact.prevent="sendMessage"
        placeholder="Escribe tu consulta..."
        class="flex-1 resize-none px-4 py-2 text-sm text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="2"
        ref="textarea"
        :disabled="isLoading"
      />
      <button
        @click="sendMessage"
        :disabled="isLoading"
        class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
      >
        Enviar
      </button>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref, nextTick, onMounted } from 'vue';
  import api from '@/services/http';
  
  const inputMessage = ref('');
  const isLoading = ref(false);
  const messages = ref([
    {
      sender: 'bot',
      text: '¡Hola! Soy el Chatbot de DECSA. ¿En qué puedo ayudarte hoy?',
      isTyping: false,
    },
  ]);
  const messagesContainer = ref(null);
  const textarea = ref(null);
  
  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  };
  
  const adjustTextareaHeight = () => {
    if (textarea.value) {
      textarea.value.style.height = 'auto';
      textarea.value.style.height = `${textarea.value.scrollHeight}px`;
    }
  };
  
  const sendMessage = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return;
  
    messages.value.push({
      sender: 'user',
      text: inputMessage.value,
      isTyping: false,
    });
  
    const userMessage = inputMessage.value;
    inputMessage.value = '';
    isLoading.value = true;
    adjustTextareaHeight();
    scrollToBottom();
  
    messages.value.push({
      sender: 'bot',
      text: '',
      isTyping: true,
    });
  
    try {
      const response = await api.post(
        '/api/chatbot',
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      const responseText = response.data.response;
      messages.value[messages.value.length - 1].isTyping = false;
      await typeMessage(responseText, messages.value.length - 1);
    } catch (error) {
      messages.value[messages.value.length - 1].isTyping = false;
      messages.value[messages.value.length - 1].text =
        'Lo siento, ocurrió un error. Intenta de nuevo.';
      console.error('Error al obtener respuesta del bot:', error);
    } finally {
      isLoading.value = false;
      scrollToBottom();
    }
  };
  
  const typeMessage = async (text, messageIndex) => {
    const chunks = text.split(' ');
    let currentText = '';
    for (const chunk of chunks) {
      currentText += chunk + ' ';
      messages.value[messageIndex].text = currentText;
      await new Promise((resolve) => setTimeout(resolve, 50));
      scrollToBottom();
    }
  };
  
  onMounted(() => {
    scrollToBottom();
    adjustTextareaHeight();
  });
  </script>
  