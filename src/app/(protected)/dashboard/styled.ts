'use client';
import styled from 'styled-components';

export const PageContainer = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px); /* Desconta altura do header, ajuste se necessário */
  background-color: #f8f9fa; /* Fundo cinza claro */
  padding: 3rem 2rem;
  font-family: Arial, Helvetica, sans-serif;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #343a40;
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem;
  width: 100%;
`;

export const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  padding: 2rem 0;
`;

// Container para quando NÃO há formulário
export const NoFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  padding: 2rem 0;

  p {
    font-size: 1.1rem;
    color: #495057;
  }
`;

export const RegisterButton = styled.button`
  background-color: #107569; // Verde principal
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 15px rgba(16, 117, 105, 0.3);
    transform: translateY(-2px);
  }
`;

// Container para quando HÁ formulário
export const ExistingFormContainer = styled.div`
  width: 100%;
  padding-top: 1rem;
`;

export const FormDetailsPlaceholder = styled.div`
  background-color: #f8f9fa;
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #6c757d;

  p {
    margin-bottom: 1rem;
  }
`;