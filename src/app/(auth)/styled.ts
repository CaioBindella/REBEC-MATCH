// src/app/(auth)/styled.ts
'use client';
import styled from "styled-components";
import media from "@/lib/media";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #f8f9fa;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1100px; // Define a largura máxima do conteúdo
  padding: 3rem 1.5rem; // Espaçamento interno
  display: flex;
  flex-direction: column;
  gap: 2.5rem; // Espaço entre as seções (título, texto, pesquisa, cards)

  ${media.xsOnly`
    padding: 1.5rem 1rem;
    gap: 2rem;
  `}
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  color: #0D503C;
`;

export const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  color: black;
`;

export const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: #0D503C; // Verde escuro
  border-bottom: 2px solid #107569;
  padding-bottom: 0.5rem;
  margin: 0;

  ${media.smOnly`
    font-size: 1.8rem;
  `}
`;

export const DescriptionText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #495057;
  text-align: justify; // Como solicitado
  margin: 0;

  ${media.smOnly`
    font-size: 0.95rem;
  `}
`;

export const SearchSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 700px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  overflow: hidden; // Para os cantos do botão ficarem corretos
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  color: #343a40;
  
  &::placeholder {
    color: #adb5bd;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(16, 117, 105, 0.2);
  }
`;

export const SearchButton = styled.button`
  flex-shrink: 0;
  background-color: #107569; // Verde principal
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;


export const CardGrid = styled.div`
  display: grid; // Alterado de flex
  grid-template-columns: repeat(2, 1fr); // 2 colunas por linha
  gap: 1.5rem; /* Espaço entre os cards */
  width: 100%; /* Ocupa a largura do container */

  /* 1 coluna em telas médias e pequenas */
  ${media.mdOnly`
    grid-template-columns: 1fr;
  `}
  ${media.smOnly`
    grid-template-columns: 1fr;
  `}
  ${media.xsOnly`
    grid-template-columns: 1fr;
  `}
`;

export const ViewAllWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem; // Espaço acima do botão
`;

export const ViewAllLink = styled.a` // Estilizado como 'a' (âncora)
  background-color: #107569; // Verde principal
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.8rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 15px rgba(16, 117, 105, 0.3);
    transform: translateY(-2px);
  }
`;

export const ConteinerConsults = styled.div`
  width: 100%;
`;

// ==== ANTIGO ESTILO DA HOME PAGE =====
// export const Container = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
// `;

// export const AlignItens = styled.div`
//     width: 100%;
//     max-width: 1200px;
//     padding: 0 24px;   /* Espaçamento nas laterais */
//     display: flex;
//     flex-direction: column;
//     gap: 32px;
// `;

// export const NumberInputSection = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     gap: 24px;

//     & > * {
//         flex: 1 1 300px;  // mínimo de 300px e flexível para crescer
//     }
// `;


// export const InformationSection = styled.div`
//     display: grid;
//     grid-template-columns: 1.5fr 1fr; /* Mesma proporção da seção de cima */
//     align-items: start;
//     padding: 16px 0;
// `;

// export const LeftSection = styled.div`
//     /* O 'width' é definido pelo grid-template-columns do pai (InformationSection) */
//     /* Não precisa de width: 100% aqui */
// `;

// export const RightSection = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 24px; /* Espaço entre o card de Ensaios Clínicos e o de Notícias */
    
//     /* Não precisa de width: 100% aqui */
// `;