import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 1. Defina um tipo para o objeto do usuário ---
type User = {
    id: string; // Exemplo de dados do usuário
    name: string;
    userType: 'VOLUNTARIO' | 'PESQUISADOR'; // Tipo de usuário
};

// --- 2. Atualize o tipo do estado de autenticação ---
type AuthState = {
    user: User | null; // Armazena o objeto do usuário ou nulo
    logIn: (userData: User) => void; // logIn agora espera receber os dados do usuário
    logOut: () => void;
    isReady?: boolean;
};

// --- 3. Atualize o valor inicial do contexto ---
export const AuthContext = createContext<AuthState>({
    user: null,
    isReady: false,
    logIn: () => {},
    logOut: () => {},
});

// Chave para o AsyncStorage
const USER_KEY = 'userData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- 4. Mude o estado de 'isAuthenticated' para 'user' ---
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

    // --- 5. Atualize a função logIn para aceitar dados do usuário ---
    const logIn = (userData: User) => {
        setUser(userData);
        storeUserState(userData);
        // A rota correta geralmente não inclui /page
        router.replace('/(protected)/home/page'); 
    };

    const logOut = () => {
        setUser(null);
        storeUserState(null); // Limpa o estado armazenado
        router.replace('/firstpage');
    };

    // --- 6. Atualize o useEffect para carregar o objeto do usuário ---
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

    // --- 7. Exponha o 'user' no provedor do contexto ---
    return (
        <AuthContext.Provider value={{ user, isReady, logIn, logOut }}>
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