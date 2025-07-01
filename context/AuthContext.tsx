import { createContext, use, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
    isAuthenticated: boolean;
    logIn: () => void;
    logOut: () => void;
    isReady?: boolean; // Adiciona isReady para indicar se o estado foi carregado
};

export const AuthContext = createContext<AuthState>({
    isAuthenticated: false,
    isReady: false, // Inicializa isReady como false
    logIn: () => {},
    logOut: () => {},
});

const AUTH_STATE_KEY = 'authState';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    async function storeAuthenticationState(newState: { isAuthenticated: boolean}) {
        try {
            await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(newState));
        } catch (error) {
            console.error('Erro ao armazenar o estado de autenticação:', error);
        }
    }

    const logIn = () => {
        setIsAuthenticated(true);
        storeAuthenticationState({ isAuthenticated: true }); // Armazena o estado de autenticação
        router.replace('/(protected)/home'); // Redireciona para a página protegida após o login
    };

    const logOut = () => {
        setIsAuthenticated(false);
        storeAuthenticationState({ isAuthenticated: false }); // Armazena o estado de autenticação
        router.replace('/firstpage'); // Redireciona para a página de login após o logout
    };

    useEffect(() => {
        async function loadAuthenticationState() {
            try {
                const authState = await AsyncStorage.getItem(AUTH_STATE_KEY);
                if (authState) {
                    setIsAuthenticated(JSON.parse(authState).isAuthenticated);
                }
            }
            catch (error) {
                console.error('Erro ao carregar o estado de autenticação:', error);
            } finally {
                setIsReady(true); // Marca que o carregamento do estado está completo
            }
        }
        loadAuthenticationState();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isReady, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
