import React, { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { apiService, registrarExpiracaoDeSessao } from '@/services/api/apiClient';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { UsuarioResponseDTO } from '@/types/types';

// Sessão do usuário: dados da conta + nome fictício e id do perfil específico (Voluntario ou Pesquisador),
// todos devolvidos pela API em uma única resposta de login (LoginResponseDTO).
export type UserSession = UsuarioResponseDTO & {
  nomeFicticio: string | null;
  perfilId: number | null;
};

type AuthState = {
  user: UserSession | null;
  isLoading: boolean;
  isReady: boolean;
  logIn: (credentials: { login: string; senha: string }) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: false,
  isReady: false,
  logIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const expirando = useRef(false);
  const router = useRouter();

  const limparSessao = useCallback(async () => {
    setUser(null);
    await storage.removeItem(STORAGE_KEYS.TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER);
  }, []);

  // 1. Carrega a sessão salva no dispositivo ao abrir o app
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await storage.getItem(STORAGE_KEYS.USER);
        const token = await storage.getItem(STORAGE_KEYS.TOKEN);
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsReady(true);
      }
    }
    loadStorageData();
  }, []);

  // 2. Token expirado (401 em qualquer chamada autenticada): encerra a sessão e volta ao login
  useEffect(() => {
    registrarExpiracaoDeSessao(async () => {
      if (expirando.current) return;
      expirando.current = true;
      await limparSessao();
      Alert.alert('Sessão expirada', 'Por segurança, faça login novamente.');
      router.replace('/(auth)/login');
      expirando.current = false;
    });
  }, [limparSessao, router]);

  // 3. Login: valida as credenciais na API e persiste token e dados da sessão
  const logIn = async ({ login, senha }: { login: string; senha: string }) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.login(login, senha);
      const userSession: UserSession = {
        ...response.usuario,
        nomeFicticio: response.nomeFicticio,
        perfilId: response.perfilId,
      };
      await storage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER, JSON.stringify(userSession));
      setUser(userSession);
      router.replace('/(protected)/home/page');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Logout: remove os dados da sessão do dispositivo
  const logOut = async () => {
    try {
      await limparSessao();
      router.replace('/firstpage');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isReady, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
