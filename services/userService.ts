import api from './api/apiClient';

// Tipagem para as credenciais de login
export interface LoginCredentials {
  login: string;
  senha: string; 
}

// Tipagem para a resposta da API que você mostrou
export interface LoginResponse {
  token: string;
}

const userService = {
  // Função para fazer login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Faz uma requisição POST para o endpoint 'auth/login' (ajuste se for diferente)
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Lança o erro para ser tratado no AuthContext ou na tela de login
      console.error('Erro na chamada de login:', error);
      throw error;
    }
  },

  // Você pode adicionar outras funções aqui depois (ex: register, getUserProfile, etc.)
};

export default userService;