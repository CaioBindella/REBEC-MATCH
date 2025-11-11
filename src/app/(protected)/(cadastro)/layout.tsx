// src/app/(protected)/(cadastro)/layout.tsx
'use client';

import { FormProvider } from '@/contexts/FormContext'; 
import StyledComponentsRegistry from "@/lib/registry";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 5. Crie o efeito de proteção
  useEffect(() => {
    // Se o carregamento terminou (isLoading = false) e NÃO HÁ usuário
    if (!isLoading && !user) {
      // Redireciona para a página de login
      router.replace('/loginPage'); 
    }
  }, [user, isLoading, router]); // Dependências do efeito


  if (isLoading || !user) {
    return <div>Carregando...</div>; 
  }

  return (
    <StyledComponentsRegistry>
      <FormProvider>{children}</FormProvider>
    </StyledComponentsRegistry>
  );
}