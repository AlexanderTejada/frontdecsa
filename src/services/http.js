import axios from 'axios';

const api = axios.create({
  baseURL: 'https://coral-large-absolutely.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Ngrok-Skip-Browser-Warning': '1',  // ⬅️ esta línea elimina el problema
  },
});

export default api;
