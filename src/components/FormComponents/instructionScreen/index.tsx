'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

import Link from 'next/link';

// Importa os componentes estilizados do arquivo local
import {
  PageContainer,
  ContentWrapper,
  Title,
  HeaderSeparator,
  Subtitle,
  InstructionsBox,
  InstructionsList,
  ListItem,
  ButtonContainer,
  NextButton,
} from './styled';

const InstructionScreen: React.FC = () => {
  const instructions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Quisque posuere sem at metus venenatis tincidunt. Fusce at sapien elit.',
    'Vivamus non nisl at dolor pulvinar tempor. Integer congue.',
    'Lorem ut euismod facilisis. Curabitur mollis purus vel lacus placerat.',
    'Fames ac turpis egestas.',
    'Sed dignissim dolor sit amet sodales efficitur.',
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <Title>Cadastro de Centros de Pesquisa Clínica</Title>
        <HeaderSeparator />
        
        <Subtitle>Instruções para os usuários</Subtitle>

        <InstructionsBox>
          <InstructionsList>
            {instructions.map((text, index) => (
              <ListItem key={index}>{text}</ListItem>
            ))}
          </InstructionsList>
        </InstructionsBox>
        
        <ButtonContainer>
            <Link href="/sumaryPage">
                <NextButton>
                    Prossiga
                    <FaArrowRight />
                </NextButton>    
            </Link>
        </ButtonContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default InstructionScreen;