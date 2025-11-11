// src/components/HomeComponents/RegisteredCenterCard/index.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import * as S from './styled';

interface CardProps {
  nome: string;
  dataCadastro: string;
  centroId: number; // Para construir o link
}

const RegisteredCenterCard: React.FC<CardProps> = ({ nome, dataCadastro, centroId }) => {
  return (
    <S.CardContainer>
      <S.CardTitle>{nome}</S.CardTitle>
      <S.DateLabel>Cadastrado em: {dataCadastro}</S.DateLabel>
      
      {/* O link aponta para uma página dinâmica, ex: /centros/1 */}
      <Link href={`/centros/${centroId}`} passHref>
        <S.DetailsButton>
          Saiba Mais
          <FaArrowRight />
        </S.DetailsButton>
      </Link>
    </S.CardContainer>
  );
};

export default RegisteredCenterCard;