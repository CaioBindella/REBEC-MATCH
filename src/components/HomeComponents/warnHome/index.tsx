import React from 'react';

// Importando os estilos
import {
  AvisosContainer,
  Title,
  Content,
  Paragraph,
  SubHeading,
  List
} from './styled';

// Importando o conteúdo do arquivo separado
import {
  intro,
  atendimentos,
  fastTracks,
  instrucoes,
  contatos,
  sobre
} from './content';

const Avisos: React.FC = () => {
  return (
    <AvisosContainer>
      <Title>Avisos</Title>
      <Content>
        {/* Seção Introdutória */}
        {intro.paragraphs.map((text, index) => (
          <Paragraph key={`intro-${index}`}>{text}</Paragraph>
        ))}

        {/* Seção Atendimentos */}
        <SubHeading>{atendimentos.title}</SubHeading>
        {atendimentos.paragraphs.map((text, index) => (
          <Paragraph key={`atendimentos-${index}`}>{text}</Paragraph>
        ))}

        {/* Seção Fast-Tracks */}
        <SubHeading>{fastTracks.title}</SubHeading>
        {fastTracks.items.map((text, index) => (
          <Paragraph key={`fast-track-${index}`}>{text}</Paragraph>
        ))}

        {/* Seção Instruções */}
        <SubHeading>{instrucoes.title}</SubHeading>
        <Paragraph>{instrucoes.intro}</Paragraph>
        <List>
          {instrucoes.items.map((text, index) => (
            <li key={`instrucoes-${index}`}>{text}</li>
          ))}
        </List>

        {/* Seção Contatos */}
        <SubHeading>{contatos.title}</SubHeading>
        {contatos.paragraphs.map((text, index) => (
          <Paragraph key={`contatos-${index}`}>{text}</Paragraph>
        ))}

        {/* Seção Sobre */}
        <SubHeading>{sobre.title}</SubHeading>
        {sobre.paragraphs.map((text, index) => (
          <Paragraph key={`sobre-${index}`}>{text}</Paragraph>
        ))}
      </Content>
    </AvisosContainer>
  );
};

export default Avisos;