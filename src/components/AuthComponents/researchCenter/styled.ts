'use client';
import styled from 'styled-components';

export const PageWrapper = styled.main`
  background-color: #f8f9fa; /* Fundo cinza claro para a página toda */
  width: 100%;
`;

export const Banner = styled.header`
  width: 100%;
  padding: 4rem 1rem; /* Aumentei o padding para dar mais altura */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  background-image: url('/CentroPesquisaPage.png'); /* Caminho a partir da pasta public */
  background-size: cover; /* Faz a imagem cobrir todo o espaço do banner */
  background-position: center; /* Centraliza a imagem */
  background-repeat: no-repeat; /* Evita que a imagem se repita */
`;

export const BannerTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
  max-width: 1100px;
`;

export const ContentArea = styled.div`
  width: 100%;
  max-width: 1100px; /* Largura máxima do conteúdo */
  margin: 2rem auto; /* Centraliza e adiciona margem vertical */
  padding: 2rem;
`;

export const TextBlock = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 3rem;
  text-align: justify;
`;

export const FormsSection = styled.section`
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const PrimeiroAcessoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem;
`;

export const CardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
`;

export const RegisterButton = styled.button`
  background-color: #0A3D34;
  color: white;
  min-width: 140px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

export const LoginFormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #13795B;
  }
`;

export const ForgotPasswordLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  align-self: flex-end;

  &:hover {
    text-decoration: underline;
  }
`;