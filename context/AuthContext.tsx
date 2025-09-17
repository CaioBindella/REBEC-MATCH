import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; 

import userService, { LoginCredentials } from '@/services/userService';
import Constants from 'expo-constants';
// import { USER_KEY, TOKEN_KEY } from '@env';

const USER_KEY = Constants.expoConfig?.extra?.USER_KEY;
const TOKEN_KEY = Constants.expoConfig?.extra?.TOKEN_KEY

type User = {
    id: string;
    name: string;
    userType: 'VOLUNTARIO' | 'PESQUISADOR';
    nomeFicticio?: string;
};

type AuthState = {
    user: User | null;
    logIn: (credentials: LoginCredentials) => Promise<void>;
    logOut: () => void;
    isReady?: boolean;
    userType?: 'VOLUNTARIO' | 'PESQUISADOR';
};

export const AuthContext = createContext<AuthState>({
    user: null,
    isReady: false,
    logIn: async () => {},
    logOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    // Função para salvar o objeto do usuário no AsyncStorage
    async function storeUserState(newUser: User | null) {
        try {
            if (newUser) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
            } else {
                // Se o usuário for nulo (logout), remove a chave
                await AsyncStorage.removeItem(USER_KEY);
            }
        } catch (error) {
            console.error('Erro ao armazenar o estado do usuário:', error);
        }
    }

    const logIn = async (credentials: LoginCredentials) => {
        try {
            const response = await userService.login(credentials);
            const { token } = response;

            await AsyncStorage.setItem(TOKEN_KEY, token);

            const decodedToken: any = jwtDecode(token);

            const userData: User = {
                id: decodedToken.sub,
                name: decodedToken.nome,
                userType: decodedToken.tipoEspecifico,
                nomeFicticio: decodedToken.nomeFicticio,
            };

            setUser(userData);
            await storeUserState(userData);
            
            router.replace('/(protected)/home/page');

        } catch (error) {
            console.error('Falha no login:', error);
            throw new Error('Login ou senha inválidos.');
        }
    };

    const logOut = async () => {
        setUser(null);
        await storeUserState(null); // Limpa o estado armazenado
        await AsyncStorage.removeItem(TOKEN_KEY);
        router.replace('/firstpage');
    };

    useEffect(() => {
        async function loadUserState() {
            try {
                const userString = await AsyncStorage.getItem(USER_KEY);
                if (userString) {
                    setUser(JSON.parse(userString));
                }
            }
            catch (error) {
                console.error('Erro ao carregar o estado do usuário:', error);
            } finally {
                setIsReady(true);
            }
        }
        loadUserState();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isReady, logIn, logOut, userType: user?.userType }}>
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