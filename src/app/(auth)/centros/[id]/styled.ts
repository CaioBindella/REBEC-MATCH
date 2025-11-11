// src/app/(auth)/centros/[id]/styled.ts
'use client';

import styled from "styled-components";
import media from "@/lib/media"; // Importa seu helper

// Reutiliza o container principal
export const PageContainer = styled.div`
  width: 100%;
  max-width: 900px; 
  margin: 0 auto;
  padding: 3rem 1.5rem; 
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 

  ${media.xsOnly`
    padding: 1.5rem 1rem;
  `}
`;

export const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  padding: 4rem 0;
`;

export const BackButton = styled.button`
  background-color: transparent;
  color: #107569;
  border: 1px solid #107569;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;
  align-self: flex-start; // Alinha à esquerda

  &:hover {
    background-color: rgba(16, 117, 105, 0.05);
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: #0D503C;
  margin: 0;
  
  ${media.smOnly`
    font-size: 1.8rem;
  `}
  ${media.xsOnly`
    font-size: 1.6rem;
  `}
`;

// Container para cada seção principal (Ex: "Identificação", "Pessoal")
export const Section = styled.section`
  width: 100%;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  
  /* Adiciona espaço entre os elementos filhos */
  display: flex;
  flex-direction: column;
  gap: 1rem; 
`;

export const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  color: #343a40;
  border-bottom: 2px solid #107569;
  padding-bottom: 0.5rem;
  margin: 0 0 1rem 0;
`;

export const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #107569;
  margin: 0.5rem 0 0 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #dee2e6;
`;

// Container para um par de Label/Value
export const InfoRow = styled.div`
  display: flex;
  flex-direction: column; /* Label em cima, valor embaixo */
  gap: 0.25rem;
  padding: 0.25rem 0;

  /* Em telas maiores, coloca lado a lado */
  ${media.smUp`
    display: grid;
    grid-template-columns: 200px 1fr; // Label com largura fixa
    gap: 1rem;
    align-items: center;
  `}
`;

export const InfoLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d; // Cinza
  text-transform: uppercase;
`;

export const InfoValue = styled.p`
  font-size: 1rem;
  color: #212529; // Preto
  margin: 0;
  word-break: break-word; // Quebra links longos
`;

// Card para itens de um array (Equipe, Equipamentos, etc.)
export const ItemCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // Espaço entre os InfoRows dentro do card
`;

// Container para tags (Tipos de Estudo, Especialidades)
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

export const Tag = styled.span`
  background-color: #E9ECEF;
  color: #495057;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
`;