// src/app/(auth)/centros/styled.ts
'use client';
import styled from "styled-components";
import media from "@/lib/media"; // Importa seu helper

// --- Reutiliza estilos da Home ---
import { 
    PageContainer as BasePageContainer, 
    ContentContainer as BaseContentContainer,
    PageTitle as BasePageTitle,
    SearchInputWrapper as BaseSearchInputWrapper,
    SearchInput as BaseSearchInput,
    SearchButton as BaseSearchButton,
} from '../styled';

export const PageContainer = BasePageContainer;
export const ContentContainer = BaseContentContainer;
export const PageTitle = BasePageTitle;

// --- Novos Estilos para a Barra de Filtro ---

export const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; // Permite quebrar linha em telas pequenas
  gap: 1.5rem;
  width: 100%;
  max-width: 900px; 
  margin: 0 auto;
`;

// Sobrescreve o SearchInputWrapper para ser flexível
export const SearchInputWrapper = styled(BaseSearchInputWrapper)`
  flex-grow: 1; // Permite que o input cresça
  min-width: 300px; // Largura mínima antes de quebrar

  ${media.xsOnly`
    min-width: 100%; // Ocupa 100% em telas muito pequenas
  `}
`;
export const SearchInput = BaseSearchInput;
export const SearchButton = BaseSearchButton;


export const SortWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  min-width: 330px;
  justify-content: space-evenly;
`;

export const SortLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
`;

export const SortSelect = styled.select`
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #107569;
    box-shadow: 0 0 0 2px rgba(16, 117, 105, 0.2);
  }
`;

export const NoResultsText = styled.p`
  font-size: 1rem;
  color: #6c757d;
  text-align: center;
  padding: 3rem 0;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 colunas por linha
  gap: 1.5rem;
  width: 100%;

  /* 2 colunas em tablets */
  ${media.mdOnly`
    grid-template-columns: repeat(2, 1fr);
  `}
  
  /* 1 coluna em celulares */
  ${media.smOnly`
    grid-template-columns: 1fr;
  `}
  ${media.xsOnly`
    grid-template-columns: 1fr;
  `}
`;