// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { storage } from '@/services/storage';
import { 
  LoginResponseDTO, 
  UsuarioCreateDTO, 
  EstudoResponseDTO, 
  CandidaturaCreateDTO, 
  CandidaturaResponseDTO,
  MatchResultResponseDTO,
  RespostasBatchCreateDTO,
  UsuarioResponseDTO
} from '../../types/types';


const BASE_URL = 'http://10.0.2.2:8080'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o Token automaticamente em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  auth: {
    login: async (login: string, senha: string) => {
      const response = await api.post<LoginResponseDTO>('/auth/login', { login, senha });
      if (response.data.token) {
        await SecureStore.setItemAsync('user_token', response.data.token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.usuario));
      }
      return response.data;
    },
    logout: async () => {
      await SecureStore.deleteItemAsync('user_token');
      await SecureStore.deleteItemAsync('user_data');
    }
  },

  // --- USUÁRIOS ---
  usuario: {
    create: async (data: UsuarioCreateDTO) => {
      const response = await api.post<UsuarioResponseDTO>('/api/v1/usuarios', data);
      return response.data;
    },
    getById: async (id: number) => {
      const response = await api.get<UsuarioResponseDTO>(`/api/v1/usuarios/${id}`);
      return response.data;
    },
    update: async (id: number, data: Partial<UsuarioCreateDTO>) => {
      const response = await api.put<UsuarioResponseDTO>(`/api/v1/usuarios/${id}`, data);
      return response.data;
    }
  },

  // --- ESTUDOS ---
  estudo: {
    listAll: async () => {
      const response = await api.get<EstudoResponseDTO[]>('/api/v1/estudos');
      return response.data;
    },
    getById: async (id: number) => {
      const response = await api.get<EstudoResponseDTO>(`/api/v1/estudos/${id}`);
      return response.data;
    },
    // Busca inteligente por nome de doença
    searchByDoenca: async (termo: string) => {
      const response = await api.get<EstudoResponseDTO[]>('/api/v1/estudos/busca', {
        params: { termo }
      });
      return response.data;
    },
    getByPesquisador: async (pesquisadorId: number) => {
      const response = await api.get<any[]>(`/api/v1/estudos/pesquisador/${pesquisadorId}`);
      return response.data;
    },
    listRecruiting: async () => {
      const response = await api.get('/api/v1/estudos/recrutando');
      return response.data;
    },
  },

  doenca: {
    listAll: async () => {
      const response = await api.get('/api/v1/doencas');
      return response.data;
    },
    search: async (termo: string) => {
      const response = await api.get('/api/v1/doencas/busca', { params: { termo } });
      return response.data;
    },
  },

  // --- CANDIDATURAS (Novo Fluxo de Handshake) ---
  candidatura: {
    // oluntário se candidata
    criar: async (data: CandidaturaCreateDTO) => {
      const response = await api.post<CandidaturaResponseDTO>('/api/v1/candidaturas', data);
      return response.data;
    },
    
    // Pesquisador Aprova/Recusa
    analisePesquisador: async (id: number, aprovado: boolean) => {
      const response = await api.patch<CandidaturaResponseDTO>(
        `/api/v1/candidaturas/${id}/analise-pesquisador`, 
        aprovado, // Envia o booleano direto no corpo
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    },

    // Voluntário Confirma Participação (Gera Match)
    confirmacaoVoluntario: async (id: number, aceito: boolean) => {
      const response = await api.patch<CandidaturaResponseDTO>(
        `/api/v1/candidaturas/${id}/confirmacao-voluntario`, 
        aceito,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    },

    listarPorVoluntario: async (voluntarioId: number) => {
      const response = await api.get<CandidaturaResponseDTO[]>(`/api/v1/candidaturas/voluntario/${voluntarioId}`);
      return response.data;
    },

    listarPorEstudo: async (estudoId: number) => {
      const response = await api.get<CandidaturaResponseDTO[]>(`/api/v1/candidaturas/estudo/${estudoId}`);
      return response.data;
    }
  },

  // --- MATCHES (Resultados Finais) ---
  match: {
    listAll: async () => {
      const response = await api.get<MatchResultResponseDTO[]>('/api/v1/match');
      return response.data;
    },
    getById: async (id: number) => {
      const response = await api.get<MatchResultResponseDTO>(`/api/v1/match/${id}`);
      return response.data;
    }
  },

  // --- FORMULÁRIOS & RESPOSTAS ---
  formulario: {
    enviarRespostasEmLote: async (data: RespostasBatchCreateDTO) => {
      await api.post('/api/v1/respostas/batch', data);
    }
  }
};

export default api;