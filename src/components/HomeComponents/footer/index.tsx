import React from 'react';

// Importando os componentes estilizados
import {
  FooterContainer,
  TopSection,
  LogoContainer,
  ColumnsContainer,
  Column,
  ColumnTitle,
  StyledLink,
  RegisterButton,
  BottomSection,
  Line,
} from './styled';

// Importando ícones
import {
  FaQuestionCircle,
  FaEnvelope,
  FaInfoCircle,
  FaUsers,
  FaNewspaper,
  FaBook,
  FaLink,
} from 'react-icons/fa';


const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <TopSection>
        <LogoContainer>
          <img src="/LogoRebecFooter.png" alt="Logo ReBEC" />
        </LogoContainer>
        <Line />
        <ColumnsContainer>
          <Column>
            <ColumnTitle>Precisa de ajuda?</ColumnTitle>
            <StyledLink href="#">
              <FaQuestionCircle /> <span>Ajuda</span>
            </StyledLink>
            <StyledLink href="#">
              <FaEnvelope /> <span>Contato</span>
            </StyledLink>
          </Column>
          {/* <Line /> */}
          <Column>
            <ColumnTitle>Conheça mais</ColumnTitle>
            <StyledLink href="#">
              <FaInfoCircle /> <span>Sobre</span>
            </StyledLink>
            <StyledLink href="#">
              <FaUsers /> <span>Equipe</span>
            </StyledLink>
          </Column>
          {/* <Line /> */}
          <Column>
            <ColumnTitle>Atualizações</ColumnTitle>
            <StyledLink href="#">
              <FaNewspaper /> <span>Notícias</span>
            </StyledLink>
            <StyledLink href="#">
              <FaBook /> <span>Glossário</span>
            </StyledLink>
          </Column>
          {/* <Line /> */}
          <Column>
            <ColumnTitle>Não perca</ColumnTitle>
            <StyledLink href="#">
              <FaLink /> <span>Links úteis</span>
            </StyledLink>
            <RegisterButton>Novo cadastro</RegisterButton>
          </Column>
        </ColumnsContainer>
      </TopSection>

      <BottomSection>
        <img src="/FooterLogos.png" alt="Logos dos Apoiadores: OPAS, OMS, Fiocruz, SUS, Ministério da Saúde, Governo Federal" />
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer;