'use client';
import styled from 'styled-components';

// Reutiliza o PageContainer do Dashboard ou cria um similar
export const PageContainer = styled.main`
  display: flex;
  justify-content: center;
  align-items: center; /* Centraliza verticalmente */
  min-height: calc(100vh - 80px); 
  background-color: #f8f9fa; 
  padding: 3rem 2rem;
  font-family: Arial, Helvetica, sans-serif;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 700px; /* Mais estreito para confirmação */
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const IconWrapper = styled.div`
  font-size: 4rem;
  color: #107569; /* Verde principal */
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 1rem;
`;

export const Message = styled.p`
  font-size: 1.1rem;
  color: #495057;
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between; /* Botões nas extremidades */
  align-items: center;
  width: 100%;
  gap: 1rem; /* Espaço entre botões */

  @media (max-width: 500px) { /* Em telas pequenas, botões um abaixo do outro */
    flex-direction: column;
    align-items: stretch; /* Faz botões ocuparem largura total */
  }
`;

// Estilos base para os botões
const BaseButton = styled.button`
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.8rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza conteúdo do botão */
  gap: 0.75rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export const ConfirmButton = styled(BaseButton)`
  background-color: #107569; // Verde principal
  color: white;

  &:hover {
    box-shadow: 0 4px 15px rgba(16, 117, 105, 0.3);
  }
`;

export const BackButton = styled(BaseButton)`
  background-color: #6c757d; // Cinza secundário
  color: white;

   &:hover {
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
  }
`;