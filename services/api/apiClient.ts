import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage, STORAGE_KEYS } from '@/services/storage';
import {
  ApiErrorDTO,
  CandidatoDetalhadoDTO,
  CandidaturaCreateDTO,
  CandidaturaResponseDTO,
  ChangePasswordDTO,
  CriterioCreateDTO,
  CriterioResponseDTO,
  CriterioUpdateDTO,
  DoencaResponseDTO,
  EstudoCreateDTO,
  EstudoResponseDTO,
  EstudoUpdateDTO,
  LoginResponseDTO,
  MatchResultResponseDTO,
  MensagemCreateDTO,
  MensagemDTO,
  NotificacaoResponseDTO,
  PesquisadorResponseDTO,
  QuestaoResponseDTO,
  RespostaResponseDTO,
  RespostasBatchCreateDTO,
  UsuarioCreateDTO,
  UsuarioResponseDTO,
} from '@/types/types';

// Endereços dos serviços de back-end, definidos no arquivo .env (modelo em .env.example).
// No emulador Android, 10.0.2.2 corresponde ao localhost da máquina de desenvolvimento.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';
export const CHAT_URL = process.env.EXPO_PUBLIC_CHAT_URL ?? 'http://10.0.2.2:4000';

// Instância da API principal (Java/Spring Boot, porta 8080)
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Instância do serviço de chat (Node.js, porta 4000)
export const chatApi = axios.create({
  baseURL: CHAT_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptador de requisição: anexa o token JWT armazenado no dispositivo
const anexarToken = async (config: InternalAxiosRequestConfig) => {
  const token = await storage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Interceptador de resposta: um 401 em rota autenticada indica token ausente ou expirado
let aoExpirarSessao: (() => void) | null = null;
export const registrarExpiracaoDeSessao = (callback: () => void) => {
  aoExpirarSessao = callback;
};

const tratarErro = (error: AxiosError) => {
  const url = error.config?.url ?? '';
  if (error.response?.status === 401 && !url.includes('/auth/login')) {
    aoExpirarSessao?.();
  }
  return Promise.reject(error);
};

for (const instancia of [api, chatApi]) {
  instancia.interceptors.request.use(anexarToken, (error) => Promise.reject(error));
  instancia.interceptors.response.use((response) => response, tratarErro);
}

/** Extrai a mensagem de erro padronizada pela API (RestExceptionHandler) para exibição ao usuário. */
export const getErrorMessage = (error: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente.') => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorDTO> | undefined;
    if (data?.message) return data.message;
    if (!error.response) return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  return fallback;
};

/** Identificador do formulário global de perfil (criado pela migração V8 da API). */
export const ID_FORMULARIO_PERFIL = 1;

export const apiService = {
  auth: {
    login: async (login: string, senha: string) =>
      (await api.post<LoginResponseDTO>('/auth/login', { login, senha })).data,
  },

  // --- USUÁRIOS ---
  usuario: {
    create: async (data: UsuarioCreateDTO) =>
      (await api.post<UsuarioResponseDTO>('/api/v1/usuarios', data)).data,
    getById: async (id: number) =>
      (await api.get<UsuarioResponseDTO>(`/api/v1/usuarios/${id}`)).data,
    updatePassword: async (id: number, data: ChangePasswordDTO) => {
      await api.put(`/api/v1/usuarios/${id}/senha`, data);
    },
    delete: async (id: number) => {
      await api.delete(`/api/v1/usuarios/${id}`);
    },
  },

  pesquisador: {
    getById: async (id: number) =>
      (await api.get<PesquisadorResponseDTO>(`/api/v1/pesquisadores/${id}`)).data,
  },

  // --- ESTUDOS ---
  estudo: {
    getById: async (id: number) =>
      (await api.get<EstudoResponseDTO>(`/api/v1/estudos/${id}`)).data,
    // Estudos em recrutamento por nome popular/científico de doença ou condição de saúde
    searchByDoenca: async (termo: string) =>
      (await api.get<EstudoResponseDTO[]>('/api/v1/estudos/busca', { params: { termo } })).data,
    getByPesquisador: async (pesquisadorId: number) =>
      (await api.get<EstudoResponseDTO[]>(`/api/v1/estudos/pesquisador/${pesquisadorId}`)).data,
    listRecruiting: async () =>
      (await api.get<EstudoResponseDTO[]>('/api/v1/estudos/recrutando')).data,
    create: async (data: EstudoCreateDTO) =>
      (await api.post<EstudoResponseDTO>('/api/v1/estudos', data)).data,
    update: async (id: number, data: EstudoUpdateDTO) =>
      (await api.put<EstudoResponseDTO>(`/api/v1/estudos/${id}`, data)).data,
  },

  criterio: {
    create: async (data: CriterioCreateDTO) =>
      (await api.post<CriterioResponseDTO>('/api/v1/criterios', data)).data,
    update: async (id: number, data: CriterioUpdateDTO) =>
      (await api.put<CriterioResponseDTO>(`/api/v1/criterios/${id}`, data)).data,
  },

  // Sugestões do vocabulário controlado (DeCS/CID-10) a partir de três caracteres
  doenca: {
    search: async (termo: string) =>
      (await api.get<DoencaResponseDTO[]>('/api/v1/doencas', { params: { termo } })).data,
  },

  // --- COMPATIBILIDADE AUTOMÁTICA E MATCHES ---
  match: {
    // Estudos em recrutamento compatíveis com a idade e o sexo do voluntário autenticado
    estudosCompativeis: async () =>
      (await api.get<EstudoResponseDTO[]>('/api/v1/match/estudos-compativeis')).data,
    // Matches do usuário autenticado (voluntário ou pesquisador responsável)
    listar: async () =>
      (await api.get<MatchResultResponseDTO[]>('/api/v1/match')).data,
  },

  // --- CANDIDATURAS (confirmação em duas etapas) ---
  candidatura: {
    // Voluntário autenticado se candidata
    criar: async (data: CandidaturaCreateDTO) =>
      (await api.post<CandidaturaResponseDTO>('/api/v1/candidaturas', data)).data,
    // Pesquisador aprova/recusa (o booleano vai direto no corpo)
    analisePesquisador: async (id: number, aprovado: boolean) =>
      (await api.patch<CandidaturaResponseDTO>(`/api/v1/candidaturas/${id}/analise-pesquisador`, aprovado)).data,
    // Voluntário confirma/recusa a participação (a confirmação gera o match)
    confirmacaoVoluntario: async (id: number, aceito: boolean) =>
      (await api.patch<CandidaturaResponseDTO>(`/api/v1/candidaturas/${id}/confirmacao-voluntario`, aceito)).data,
    listarPorPesquisador: async (pesquisadorId: number) =>
      (await api.get<CandidatoDetalhadoDTO[]>(`/api/v1/candidaturas/pesquisador/${pesquisadorId}`)).data,
    listarPorVoluntario: async (voluntarioId: number) =>
      (await api.get<CandidaturaResponseDTO[]>(`/api/v1/candidaturas/voluntario/${voluntarioId}`)).data,
  },

  notificacao: {
    listar: async (usuarioId: number) =>
      (await api.get<NotificacaoResponseDTO[]>(`/api/v1/notificacoes/usuario/${usuarioId}`)).data,
    marcarLida: async (id: number) => {
      await api.patch(`/api/v1/notificacoes/${id}/ler`);
    },
    marcarTodasLidas: async (usuarioId: number) => {
      await api.patch(`/api/v1/notificacoes/usuario/${usuarioId}/ler-todas`);
    },
  },

  // --- FORMULÁRIO DE PERFIL ---
  questao: {
    listarPorFormulario: async (formularioId: number) =>
      (await api.get<QuestaoResponseDTO[]>('/api/v1/questoes', { params: { formularioId } })).data,
  },

  resposta: {
    getByVoluntario: async (voluntarioId: number) =>
      (await api.get<RespostaResponseDTO[]>(`/api/v1/respostas/voluntario/${voluntarioId}`)).data,
    // Envio de todas as respostas de um formulário em uma única requisição
    criarEmLote: async (data: RespostasBatchCreateDTO) =>
      (await api.post<RespostaResponseDTO[]>('/api/v1/respostas/batch', data)).data,
  },

  // --- CHAT (serviço Node.js) ---
  mensagem: {
    listar: async (estudoId: number, usuarioId: number, contatoId: number) =>
      (await chatApi.get<MensagemDTO[]>(`/mensagens/${estudoId}/${usuarioId}/${contatoId}`)).data,
    enviar: async (data: MensagemCreateDTO) =>
      (await chatApi.post<MensagemDTO>('/mensagens', data)).data,
  },
};

export default api;
