'use client';
import styled from 'styled-components';

// NOVO: Este é o container cinza de largura total.
export const FullWidthWrapper = styled.section`
  width: 100%;
  padding: 0.5rem 0; /* Espaçamento vertical generoso */
  display: flex;
  justify-content: center; /* Centraliza o container de conteúdo */
  border-top: 1px solid #dee2e6;
`;

// Este é o container interno que alinha os cards e tem largura máxima.
export const CardsGrid = styled.div`
  width: 100%;
  padding: 0 0px;   /* Garante um respiro nas laterais em telas menores */
  
  display: grid;
  /* Cria 3 colunas de tamanhos iguais */
  grid-template-columns: repeat(3, 1fr); 
  gap: 0.5rem; /* Espaço entre os cards */

  /* Em telas menores (tablets e celulares), os cards ficam um abaixo do outro */
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;