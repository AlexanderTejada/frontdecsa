<template>
  <div class="h-full w-full px-4 sm:px-6 lg:px-20 py-5 ">
    <div class="flex flex-col h-full rounded-xl overflow-hidden bg-white border border-gray-200">   

      <!-- Mensajes -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap',
            message.sender === 'user'
              ? 'bg-blue-500 text-white self-end ml-auto'
              : 'bg-gray-200 text-gray-800 self-start'
          ]"
        >
          <span v-if="message.isTyping" class="inline-block animate-pulse">...</span>
          <span v-else v-html="message.text" />
        </div>
      </div>

      <!-- Input -->
      <div class="px-6 py-4 bg-white border border-gray-300 flex gap-2">
        <textarea
          v-model="inputMessage"
          @keyup.enter.exact.prevent="sendMessage"
          placeholder="Escribe tu consulta..."
          class="flex-1 p-2 rounded-md border border-gray-300  resize-none text-sm focus:outline-none focus:ring focus:ring-blue-200"
          rows="2"
          ref="textarea"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition"
        >
        <h2 style="cursor: pointer;"><strong>Enviar</strong></h2>
        </button>
      </div>
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
  