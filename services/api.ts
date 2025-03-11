import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.200:3000/api', // Ajusta la URL base de tu API
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;