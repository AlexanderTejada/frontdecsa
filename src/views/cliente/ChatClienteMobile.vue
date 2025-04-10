<template>
  <div class="fixed inset-0 z-50 bg-gradient-to-b from-slate-50 to-white flex flex-col">
    <!-- Cabecera -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/90 shadow-sm">
      <button @click="cerrarChat" class="text-slate-600 hover:text-indigo-600 transition">
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <h2 class="text-base font-semibold text-slate-800">Asistente <span class="text-indigo-600 font-bold">DECSA</span></h2>
      <div class="w-5 h-5"></div>
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
          :class="[
            message.sender === 'user'
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-sm'
              : 'bg-slate-200 text-slate-800 rounded-bl-sm border-l-4 border-indigo-300 shadow-sm animate-fadeInUp',
            'px-3 py-2 rounded-lg max-w-[85%] text-sm leading-snug'
          ]"
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
    <div class="p-3 border-t border-slate-200 bg-white">
      <div class="flex items-center gap-2">
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
          class="p-2 text-white rounded-md disabled:opacity-50 transition-all bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const inputMessage = ref('')
const mostrarPreguntas = ref(true)
const messages = ref([
  {
    sender: 'bot',
    text: '¡Hola! Soy DECSA, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    isTyping: false,
  },
])

const preguntas = [
  'Hola, ¿dónde están ubicados?',
  '¿Qué horarios tienen?',
  '¿Debo alguna factura?',
  'Quiero hacer un reclamo',
]

const messagesContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handlePregunta = (texto) => {
  mostrarPreguntas.value = false
  inputMessage.value = texto
  sendMessage()
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  messages.value.push({ sender: 'user', text: inputMessage.value, isTyping: false })
  const userMessage = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true
  scrollToBottom()

  messages.value.push({ sender: 'bot', text: '', isTyping: true })

  try {
    const response = await fetchBotResponse(userMessage)
    messages.value[messages.value.length - 1].isTyping = false
    await typeMessage(response, messages.value.length - 1)
  } catch (err) {
    messages.value[messages.value.length - 1].isTyping = false
    messages.value[messages.value.length - 1].text = 'Lo siento, ocurrió un error. Intenta nuevamente.'
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const fetchBotResponse = async (message) => {
  const historial = messages.value
    .filter((m) => !m.isTyping)
    .map((m) => `${m.sender === 'user' ? 'Usuario' : 'DECSA'}: ${m.text}`)
    .join(' | ')

  const response = await fetch('http://localhost:5000/api/frontend-chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje: message, historial }),
  })

  if (!response.ok) throw new Error('Error al obtener respuesta')

  const data = await response.json()
  return data.respuesta
}

const typeMessage = async (text, index) => {
  const words = text.split(' ')
  let currentText = ''
  for (const word of words) {
    currentText += word + ' '
    messages.value[index].text = currentText
    await new Promise((resolve) => setTimeout(resolve, 40))
    scrollToBottom()
  }
}

const cerrarChat = () => {
  router.back()
}

onMounted(scrollToBottom)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
</style>
