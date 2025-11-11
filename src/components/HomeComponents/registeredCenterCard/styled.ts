// src/components/HomeComponents/RegisteredCenterCard/styled.ts
'use client';
import styled from 'styled-components';
import media from "@/lib/media"; // Importa seu helper

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  min-height: 180px; // Altura mínima para alinhamento

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  ${media.smOnly`
    min-height: unset; // Remove altura mínima em mobile
  `}
  ${media.xsOnly`
    min-height: unset;
  `}
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #107569;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

export const DateLabel = styled.p`
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0 0 1.5rem 0;
`;

export const DetailsButton = styled.a` // Estiliza como 'a' (âncora) para o Link
  background-color: #107569; // Verde escuro
  color: white;
  max-width: 200px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; // Centraliza o texto
  gap: 0.6rem;
  transition: opacity 0.2s;
  text-decoration: none; // Remove sublinhado do link
  align-self: flex-start; // Alinha o botão à esquerda

  &:hover {
    opacity: 0.9;
  }
`;