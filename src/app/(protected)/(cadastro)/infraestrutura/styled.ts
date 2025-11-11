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
  gap: 1.5rem;
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
  align-items: flex-start;
  
  & > ${'${InputGroup}'} { 
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%; 
  flex-grow: 1; 
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
`;

export const Select = styled.select`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 100%;
  background-color: #fff;
`;

export const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc3545;
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

export const RepetibleSection = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #fdfdfd;
`;

// --- NOVOS ESTILOS PARA 'infraestrutura-Page' ---

export const TextArea = styled.textarea`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  width: 100%;
  min-height: 100px; /* Altura mínima */
  resize: vertical; /* Permite redimensionar verticalmente */

  &::placeholder {
    color: #adb5bd;
  }
`;

export const RadioButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RadioButtonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const RadioButtonInput = styled.input.attrs({ type: 'radio' })`
  width: 1.15rem;
  height: 1.15rem;
  accent-color: #107569; /* Cor do radio selecionado */
`;

export const RadioButtonLabel = styled.label`
  font-size: 0.95rem;
  color: #495057;
`;

// --- Estilos para Modelagem CPEC x ORPC ---

export const ModelagemContainer = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModelagemInputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end; /* Alinha o botão '+' com a base dos selects */
`;

export const IconButton = styled.button<{ $isDelete?: boolean }>`
  background-color: ${({ $isDelete }) => $isDelete ? '#f8d7da' : '#cfe2ff'};
  color: ${({ $isDelete }) => $isDelete ? '#721c24' : '#004085'};
  border: 1px solid ${({ $isDelete }) => $isDelete ? '#f5c6cb' : '#b8daff'};
  width: 40px; /* Tamanho fixo */
  height: 40px; /* Tamanho fixo */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  flex-shrink: 0; /* Impede que encolha */

  &:hover {
    opacity: 0.8;
  }
`;

export const ModelagemList = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
`;

export const ModelagemListItem = styled.div<{ $isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 50px; /* Colunas para Serviço, Tipo, Ação */
  gap: 1rem;
  padding: ${({ $isHeader }) => $isHeader ? '0.5rem 0' : '0.75rem 0'};
  align-items: center;
  border-bottom: ${({ $isHeader }) => $isHeader ? '2px solid #dee2e6' : '1px solid #e9ecef'};

  &:last-child {
    border-bottom: none;
  }

  span {
    font-size: ${({ $isHeader }) => $isHeader ? '0.8rem' : '0.95rem'};
    font-weight: ${({ $isHeader }) => $isHeader ? '600' : '500'};
    color: ${({ $isHeader }) => $isHeader ? '#6c757d' : '#343a40'};
    text-transform: ${({ $isHeader }) => $isHeader ? 'uppercase' : 'none'};
  }

  /* Centraliza o botão de deletar */
  ${IconButton} {
    justify-self: center;
  }
`;