import axios from 'axios';

const api = axios.create({
  baseURL: 'https://decsa.myiphost.com/API_Decsa',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Ngrok-Skip-Browser-Warning': '1', 
  },
});

export default api;
