// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define a estrutura de um usuário
interface User {
  id: string;
  nome: string;
}

// Define o que o contexto irá fornecer
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (nome: string) => void;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Cria o Provedor (Componente que envolve a aplicação)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para verificar o estado inicial

  // Simula a verificação de um usuário logado (ex: de um token) ao carregar
  useEffect(() => {
    // Tente buscar um usuário salvo no sessionStorage, por exemplo.
    // Por enquanto, apenas definimos que terminou de carregar.
    setIsLoading(false); 
  }, []);

  // Função de login (simulada)
  const login = (nome: string) => {
    const mockUser: User = { id: '1', nome: nome };
    setUser(mockUser);
    // Você poderia salvar isso no sessionStorage/localStorage aqui
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    // Você removeria o usuário do sessionStorage/localStorage aqui
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};