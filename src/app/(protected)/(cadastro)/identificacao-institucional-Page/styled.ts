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

export const ColorAddressComponent = styled.div`
  background-color: #E9ECEF;
  border-radius: 10px;
  padding: 1rem;
`;

export const FormSection = styled.section`
  /* Um wrapper para agrupar campos de uma seção (ex: Endereço) */
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espaço entre os grupos de input */
  margin-bottom: 2rem;
  /* background-color: #E9ECEF; */
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

export const FormGrid = styled.div`
  /* Use este para um grid automático de 2 ou 3 colunas */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  /* Use este para campos lado a lado com larguras customizadas */
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  /* Você pode controlar a largura dos filhos (InputGroup) assim: */
  & > * {
    flex-grow: 1;
    flex-basis: 200px; // Largura base
  }
 
`;

export const InputGroup = styled.div`
  /* Um wrapper para Label + Input + ErrorText */
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%; /* Ocupa todo o espaço do pai (FormRow ou FormGrid) */
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 0.5rem;
`;

export const Input = styled.input`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  background-color: #fff;
  border-radius: 4px;
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
  color: #dc3545; /* Vermelho de erro */
  margin: 0;
`;

export const FileUploadBox = styled.div`
  /* O container cinza claro da imagem */
  background-color: #E9ECEF;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: start;

  & > ${InputGroup} {
    flex: 1 1 300px;
  }
`;

export const UploadButton = styled.button`
  /* Botão de "Upload" */
  width: 150px;
  background-color: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  
  &:hover {
    background-color: #5a6268;
  }
`;

export const FieldArrayRow = styled.div`
  /* Para alinhar Input + Botão Remover */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  & > ${Input} {
    flex-grow: 1; /* Input ocupa o espaço */
  }
`;

export const AddButton = styled.button`
  /* Botão "Adicionar outro e-mail" */
  background-color: transparent;
  color: #007bff;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start; /* Alinha à esquerda */

  &:hover {
    text-decoration: underline;
  }
`;

export const RemoveButton = styled.button`
  /* Botão "Remover" */
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background-color: #f1b0b7;
  }
`;

export const Button = styled.button`
  /* Botão "Avançar" */
  background-color: #107569;
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