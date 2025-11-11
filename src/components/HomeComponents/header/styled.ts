'use client';
import styled from 'styled-components';
import media from "@/lib/media";

// Substitui: <div className="flex items-center justify-between p-4 bg-white shadow-md">
export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem; /* 16px */
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* Sombra padrão do Tailwind (shadow-md) */
  border-bottom: 1px solid #e2e8f0;

  ${media.xsOnly`
    flex-direction: column;
  `}

  ${media.smOnly`
    flex-direction: column;
  `}
`;

// Substitui: <div className="flex items-center gap-4">
export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* 16px */
`;

// Substitui: <div className="buttonAcess">
export const AccessButton = styled.button`
  /* Estilos do seu arquivo .css */
  border-radius: 4.421px;
  border: 1.105px solid #13795B;
  background-color: transparent;
  padding: 5px 15px;
  width: 150px;
  
  /* Propriedades flex */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  
  /* Melhorias de usabilidade */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(19, 121, 91, 0.05);
  }
`;

// Substitui: <p className="text">
export const ButtonText = styled.p`
  color: #13795B;
  font-weight: 600;
  margin: 0;
`;

export const LanguageSelectorWrapper = styled.div`
  position: relative; /* Essencial para o posicionamento do menu dropdown */
  cursor: pointer;
`;

// NOVO: O menu dropdown que aparece/desaparece
export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%; /* Posiciona logo abaixo do seletor */
  right: 0;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  margin: 0.5rem 0 0 0;
  list-style: none;
  z-index: 10;
  width: max-content; /* Largura baseada no conteúdo */
`;

// NOVO: Cada item do menu
export const DropdownItem = styled.li`
  padding: 0.75rem 1.5rem;
  color: #343a40;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const UserInfo = styled.span`
  color: #343a40;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap; // Impede que o nome quebre a linha
`;

export const LogoutButton = styled.button`
  background-color: transparent;
  color: #6c757d; // Cinza
  border: 1px solid #ced4da;
  border-radius: 4.421px;
  padding: 5px 15px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa; // Fundo leve ao passar o mouse
    color: #343a40;
  }
`;