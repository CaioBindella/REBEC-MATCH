'use client';
import styled from 'styled-components';

export const FormContainer = styled.form`
  width: 65%;
  max-width: 70%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #F8F9FA;
  border-radius: 12px;
  margin-top: 3%;
  margin-bottom: 3%;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espaço entre os grupos de input */
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  color: #0D503C;
  border-bottom: 2px solid #107569;
  padding-bottom: 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start; /* Alinha os itens ao topo */
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%; /* Default width */
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
`;

export const Input = styled.input`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  width: 100%;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    outline: none;
    border-color: #107569;
    box-shadow: 0 0 0 2px rgba(16, 117, 105, 0.2);
  }
`;

export const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc3545; /* Vermelho de erro */
  margin: 0;
`;

export const AddButton = styled.button`
  background-color: transparent;
  color: #007bff;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
`;

export const RemoveButton = styled.button`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  
  &:hover {
    background-color: #f1b0b7;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
`;

// O tipo $variant é opcional, mas útil para estilizar o botão "Anterior"
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background-color: ${({ $variant }) => $variant === 'secondary' ? '#6c757d' : '#107569'};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// --- Componentes Específicos da Página "Pessoal" ---

export const RepetibleSection = styled.div`
  /* Wrapper para cada item do 'map' (representante ou equipe) */
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #fdfdfd;
`;

export const AvisoBox = styled.div`
  background-color: #fffbeb; /* Amarelo claro */
  border: 1px solid #ffe8a8;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* Ícone pode ser adicionado com ::before */
`;

export const AvisoTitle = styled.h4`
  font-weight: 700;
  color: #664d03; /* Marrom/amarelo escuro */
  margin: 0;
  font-size: 0.95rem;
`;

export const AvisoText = styled.p`
  font-size: 0.85rem;
  color: #594d2c;
  line-height: 1.5;
  margin: 0;
`;