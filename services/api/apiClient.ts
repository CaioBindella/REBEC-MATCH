import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Coloque a URL base da sua API aqui
const baseURL = "http://10.0.2.2:8080";
//process.env.PUBLIC_API_BASE_URL ||

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


// --- DADOS SIMULADOS ---
// const mockStudies = [
//   {
//     id: 1,
//     titulo: "Estudo sobre Eficácia de Novo Medicamento para Enxaqueca",
//     informacoesGerais: "Este estudo visa avaliar a redução na frequência de crises de enxaqueca em pacientes que utilizam o novo composto experimental X.",
//     status: 'EM_ANDAMENTO',
//     busca: {
//       id: 1,
//       anuncio: {
//         mensagem: "Procuram-se voluntários com diagnóstico de enxaqueca para participar em novo estudo clínico na região de São Paulo. Ajude a ciência a avançar!"
//       },
//       criterios: [
//         { texto: "Deve ter diagnóstico de enxaqueca crônica há mais de 2 anos." },
//         { texto: "Não deve estar a participar noutros estudos clínicos." },
//         { texto: "Idade entre 18 e 65 anos." }
//       ]
//     }
//   },
//   {
//     id: 2,
//     titulo: "Pesquisa sobre Qualidade do Sono e Uso de Dispositivos Eletrônicos",
//     informacoesGerais: "Análise da correlação entre o tempo de uso de telas antes de dormir e a qualidade do sono em adultos.",
//     status: 'RECRUTANDO',
//     busca: {
//       id: 2,
//       anuncio: {
//         mensagem: "Você usa o seu telemóvel antes de dormir? Participe na nossa pesquisa online e ajude-nos a entender melhor os hábitos de sono modernos."
//       },
//       criterios: [
//         { texto: "Idade superior a 18 anos." },
//         { texto: "Possuir um smartphone." }
//       ]
//     }
//   },
//   {
//     id: 3,
//     titulo: "Estudo sobre Dieta Mediterrânea e Saúde Cardiovascular",
//     informacoesGerais: "Avaliação dos benefícios da dieta mediterrânea na prevenção de doenças cardiovasculares. Não há anúncio para esta busca, então a descrição geral do estudo é mostrada.",
//     status: 'Recrutando',
//     busca: {
//       id: 3,
//       criterios: [
//         { texto: "Idade entre 40 e 75 anos." },
//         { texto: "Sem histórico de doença cardíaca grave." }
//       ]
//     }
//   }
// ];

// // Função para obter o token (simulação)
// async function getToken() {
//   // Em um app real, você pegaria o token do AsyncStorage ou Expo SecureStore.
//   // Para simulação, retornamos um valor qualquer.
//   return 'SIMULATED_JWT_TOKEN';
// }

// export async function getAvailableStudies() {
//   console.log("Simulando chamada à API para buscar estudos...");

//   // Simula um atraso de rede de 1 segundo
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   console.log("Dados simulados retornados.");
//   return Promise.resolve(mockStudies);

// }