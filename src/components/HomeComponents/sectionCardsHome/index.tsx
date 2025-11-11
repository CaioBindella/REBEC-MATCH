import React from 'react';
import Card from "@/components/HomeComponents/firstCard"; 

// Importando nossos containers estilizados
import { FullWidthWrapper, CardsGrid } from './styled';

const SectionCards: React.FC = () => {
  return (
    // O wrapper externo que ocupa 100% da largura com fundo cinza
    <FullWidthWrapper>
      {/* O grid interno que alinha os cards com o resto do conteúdo */}
      <CardsGrid>
        <Card 
          image="/Search.svg" 
          color="#0A3D34" 
          title="Ensaio Clínico" 
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae suscipit sem." 
          buttonText="Saiba mais"
          backgroundImage="/EnsaioCard.jpg"
        />
        <Card 
          image="/Paper.png" 
          color="#128195" 
          title="Centro de Pesquisa" 
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae suscipit sem." 
          buttonText="Saiba mais"
          backgroundImage="/CentroPesquisaCard.jpg" 
        />
        <Card 
          image="/Track.png" 
          color="#125A95" 
          title="Fast track" 
          text="Confira aqui se sua pesquisa é elegível para aprovação expressa." 
          buttonText="Saiba mais"
          backgroundImage="/FastTrackCard.jpg"
        />
      </CardsGrid>
    </FullWidthWrapper>
  );
};

export default SectionCards;