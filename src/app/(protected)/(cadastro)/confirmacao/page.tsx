'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext'; // Para pegar os dados finais
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

// Importa estilos (a serem criados)
import { 
    PageContainer, 
    ContentWrapper, 
    IconWrapper, 
    Title, 
    Message, 
    ButtonRow, 
    ConfirmButton, 
    BackButton 
} from './styled';

export default function Confirmacao() {
    const router = useRouter();
    const { state } = useFormState(); // Pega o estado atual do formulário

    const handleConfirm = async () => {
        // --- Lógica de Envio Final ---
        console.log("Dados a serem enviados:", state);
        alert("Simulando envio dos dados para o backend...");
        
        try {
            // Exemplo: Chamar sua API para salvar os dados
            // const response = await fetch('/api/seu-endpoint-de-envio', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(state),
            // });

            // if (!response.ok) {
            //     throw new Error('Falha ao enviar formulário');
            // }

            // Limpa o localStorage após envio bem-sucedido (opcional)
            localStorage.removeItem('formData'); 

            // Redireciona para uma página de sucesso ou dashboard
            router.push('/dashboard?status=success'); // Exemplo
            
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Ocorreu um erro ao enviar o formulário. Tente novamente.");
            // Poderia redirecionar para uma página de erro ou mostrar mensagem
        }
        // --- Fim Lógica de Envio ---
    };

    const handleBack = () => {
        router.back(); // Volta para a página anterior (Financiamento e Sustentabilidade)
    };

    return (
        <PageContainer>
            <ContentWrapper>
                <IconWrapper>
                    <FaCheckCircle />
                </IconWrapper>
                <Title>Revisar e Enviar</Title>
                <Message>
                    Você preencheu todas as seções do formulário. Revise suas informações clicando em "Voltar" ou confirme o envio para finalizar o cadastro do seu Centro de Pesquisa.
                </Message>
                <ButtonRow>
                    <BackButton onClick={handleBack}>
                        <FaArrowLeft />
                        Voltar e Revisar
                    </BackButton>
                    <ConfirmButton onClick={handleConfirm}>
                        Confirmar Envio
                    </ConfirmButton>
                </ButtonRow>
            </ContentWrapper>
        </PageContainer>
    );
}