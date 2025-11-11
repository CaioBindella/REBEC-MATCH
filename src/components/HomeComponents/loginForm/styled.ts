"use client";
import styled from 'styled-components';

// Container para a página, para centralizar o formulário
export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  font-family: sans-serif;
`;

// O contêiner principal do formulário
export const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 500;
  color: #333;
  text-align: left;
  margin-bottom: 32px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px; // Espaço entre os campos
`;

export const InputGroup = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  font-size: 1rem;
  
  &::placeholder {
    color: #A8ABB2;
  }

  &:focus {
    outline: none;
    border-color: #0A3D34; // Cor de destaque ao focar
  }
`;

// Wrapper para posicionar o ícone de olho dentro do campo de senha
export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

// Container para o link e o botão de entrar
export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

export const ForgotPasswordLink = styled.a`
  color: #007BFF;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoginButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #0D503C; // Verde escuro do botão
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0A3D34; // Um tom mais escuro no hover
  }
`;