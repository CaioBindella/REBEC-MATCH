'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Para navegação programática
import { FaPlusCircle } from 'react-icons/fa';

// Importa estilos (a serem criados)
import { 
    PageContainer, 
    ContentWrapper, 
    Title, 
    LoadingText, 
    NoFormContainer, 
    RegisterButton,
    ExistingFormContainer, // Placeholder para exibir o formulário
    FormDetailsPlaceholder   // Placeholder para exibir o formulário
} from './styled';

// --- Placeholder ---
// Substitua esta função pela sua lógica real para verificar 
// se o usuário atual já tem um formulário cadastrado.
// Pode envolver uma chamada de API.
const checkExistingForm = async (): Promise<boolean> => {
    // Simulação: Espera 1 segundo e retorna false (sem formulário)
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // Mude para 'true' para testar o caso de formulário existente
    return false; 
};
// --- Fim Placeholder ---


export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasFormulario, setHasFormulario] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const exists = await checkExistingForm();
            setHasFormulario(exists);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleRegisterClick = () => {
        // Redireciona para a primeira página do fluxo de cadastro
        router.push('/instructionPage'); 
        // Ou '/sumaryPage' se preferir pular as instruções
    };

    return (
        <PageContainer>
            <ContentWrapper>
                <Title>Meu Centro de Pesquisa</Title>

                {isLoading ? (
                    <LoadingText>Verificando cadastro...</LoadingText>
                ) : hasFormulario ? (
                    // --- Exibe o formulário existente ---
                    // Substitua este placeholder pela renderização 
                    // real do formulário ou um resumo dele.
                    <ExistingFormContainer>
                        <SubTitle>Formulário Cadastrado</SubTitle>
                        <FormDetailsPlaceholder>
                           <p>Aqui você mostraria os detalhes do formulário já preenchido.</p>
                           <p>Poderia ser um resumo, ou links para editar cada seção.</p>
                           {/* Exemplo: <Link href="/identificacao-institucional-Page">Editar Identificação</Link> */}
                        </FormDetailsPlaceholder>
                    </ExistingFormContainer>
                ) : (
                    // --- Exibe o botão para cadastrar ---
                    <NoFormContainer>
                        <p>Você ainda não cadastrou um Centro de Pesquisa.</p>
                        <RegisterButton onClick={handleRegisterClick}>
                            <FaPlusCircle />
                            Cadastrar Centro de Pesquisa
                        </RegisterButton>
                    </NoFormContainer>
                )}
            </ContentWrapper>
        </PageContainer>
    );
}

// Componente SubTitle para usar dentro do ExistingFormContainer (opcional)
const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#343a40', marginBottom: '1.5rem', borderBottom: '1px solid #dee2e6', paddingBottom: '0.5rem' }}>
        {children}
    </h2>
);