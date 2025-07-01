import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Coloque a URL base da sua API aqui
const baseURL = process.env.PUBLIC_API_BASE_URL; // Ex: http://192.168.1.10:3333/api

const api = axios.create({
  baseURL,
});

// Este é um "interceptor". Ele vai adicionar o token de autenticação
// em todas as requisições para a API depois que o usuário fizer login.
api.interceptors.request.use(async (config) => {
  // Busca o token que salvamos no AsyncStorage
  const token = await AsyncStorage.getItem('userToken');

  // Se o token existir, adiciona no cabeçalho 'Authorization'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;