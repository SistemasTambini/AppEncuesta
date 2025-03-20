import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'https://api-encuesta-7920396be181.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL, // Usa la URL desde app.json
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Verifica que está obteniendo la URL correcta
console.log("Conectando a API en:", API_URL);

export default api;