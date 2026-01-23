import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Importa o serviço centralizado e os tipos
import { api } from '@/services/api/apiClient';
import { apiService } from '@/services/api/apiClient';
import { UsuarioResponseDTO, LoginResponseDTO } from '@/types/types';

// Chaves para o armazenamento seguro
const USER_KEY = 'user_data';
const TOKEN_KEY = 'user_token';

// Extendemos o DTO do backend para incluir 'nomeFicticio' que vem separado no LoginResponseDTO
// Isso facilita o acesso no frontend (ex: user.nomeFicticio)
export type UserSession = UsuarioResponseDTO & { nomeFicticio?: string | null };

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

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    // 1. Carregar dados salvos ao abrir o App
    useEffect(() => {
        async function loadStorageData() {
            try {
                const storedUser = await SecureStore.getItemAsync(USER_KEY);
                const token = await SecureStore.getItemAsync(TOKEN_KEY);

                if (storedUser && token) {
                    // Configura o token no Axios para requisições imediatas
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

    // 2. Função de Login
    const logIn = async ({ login, senha }: { login: string; senha: string }) => {
        setIsLoading(true);
        try {
            // Chama a API usando o serviço centralizado
            // O Backend retorna: { token: string, usuario: DTO, nomeFicticio: string }
            const response: LoginResponseDTO = await apiService.auth.login(login, senha);

            // Cria a sessão unindo os dados do usuário + nome fictício (se houver)
            const userSession: UserSession = {
                ...response.usuario,
                nomeFicticio: response.nomeFicticio
            };

            // Salva no Estado
            setUser(userSession);

            // Salva no SecureStore para persistência
            if (response.token) {
                await SecureStore.setItemAsync(TOKEN_KEY, response.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
            }
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userSession));

            // Redireciona para a área protegida
            router.replace('/(protected)/home/page');

        } catch (error: any) {
            console.error('Falha no login:', error);
            // Lança o erro para ser tratado na tela de Login (ex: exibir Alert)
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Função de Logout
    const logOut = async () => {
        try {
            setUser(null);
            // Remove dados do dispositivo
            await SecureStore.deleteItemAsync(USER_KEY);
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            
            // Limpa o header do Axios
            delete api.defaults.headers.common['Authorization'];

            // Redireciona para a tela inicial
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
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};