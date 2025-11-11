'use client';
import styled from 'styled-components';

// Interface para as props do nosso container
interface CardContainerProps {
  color: string;
  backgroundImage: string;
}

// O CardContainer agora tem a lógica do fundo
export const CardContainer = styled.div<CardContainerProps>`
    display: flex;
    padding: 2rem; /* Aumentado para melhor visual */
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    min-height: 20rem;
    border-radius: 8px;
    overflow: hidden; /* Importante para o border-radius funcionar com a imagem */

    /* Lógica do fundo em camadas */
    background: 
      /* Camada 1: Cor com 90% de opacidade */
      linear-gradient(0deg, ${({ color }) => `${color}E6`}, ${({ color }) => `${color}E6`}),
      /* Camada 2: Imagem de fundo */
      url(${({ backgroundImage }) => backgroundImage});

    background-size: cover;
    background-position: center;
`;

// Container para o conteúdo (título, texto, botão)
export const Card = styled.div`
    display: flex;  
    justify-content: space-evenly;
    align-items: start;
    flex-direction: column;
    width: 60%; /* Ajustado para dar mais espaço ao texto */
    height: 80%;
`;

export const Title = styled.h3` /* Alterado para h3 por semântica */
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
`;

export const Text = styled.p` /* Alterado para p por semântica */
    color: white;
    font-size: 1rem;
    font-weight: 400;
    margin: 10px 0 10px 0;
    flex-grow: 1; /* Faz o texto ocupar o espaço e empurrar o botão */
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 15px;
    color: white;
    background: transparent;
    border: 1px solid white;
    border-radius: 7px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
        background-color: white;
        /* Usa a cor principal do card, passada pelo ThemeProvider */
        color: ${(props) => props.theme.mainColor};
    }
`;