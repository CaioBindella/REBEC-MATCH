"use client";
import styled from 'styled-components';

export const Container = styled.div`
  background-color: #0D503C; /* Cor de fundo principal */
  color: #ffffff;
  padding: 24px;
  max-width: 70%;
  border-radius: 16px; /* Bordas arredondadas */
  display: flex;
  flex-direction: column;
  gap: 16px; /* Espaço entre as seções */
  font-family: sans-serif; /* Use a fonte do seu projeto */
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const IconWrapper = styled.div`
  font-size: 48px;
  color: #E0E0E0;
`;

export const TopContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  opacity: 0.9;
`;

export const TotalNumber = styled.p`
  font-size: 3.5rem; /* Fonte grande para o número total */
  font-weight: 700;
  margin: 0;
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E0E0E0;
  opacity: 0.3;
`;

export const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite que os itens quebrem para a próxima linha */
  row-gap: 20px; /* Espaço vertical entre as linhas */
`;

export const StatBlock = styled.div`
  width: 50%; /* Cada bloco ocupa 50% da largura para criar a grade 2x2 */
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatLabel = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
`;

export const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
`;