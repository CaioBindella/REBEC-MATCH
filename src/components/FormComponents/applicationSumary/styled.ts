'use client';
import styled from 'styled-components';

interface StatusProps {
  status: 'completed' | 'pending' | 'active';
}

export const SummaryContainer = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  font-family: sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
`;

// -- Estilos do Stepper de Progresso --
export const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 2rem 0 4rem 0;
  position: relative;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;

  /* Linha conectora */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px; /* Alinha verticalmente com o centro do ícone */
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #e9ecef;
    transform: translateX(25px); /* Empurra a linha para começar depois do ícone */
  }
`;

export const StepIcon = styled.div<StatusProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${({ status }) => status === 'pending' ? '#adb5bd' : '#107569'};
  border: 2px solid ${({ status }) => status === 'pending' ? '#adb5bd' : '#107569'};
  z-index: 1; /* Para ficar sobre a linha conectora */
  font-size: 1.2rem;
`;

export const StepLabel = styled.span`
  margin-top: 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c757d;
  max-width: 100px;
`;

// -- Estilos da Tabela --
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

export const Thead = styled.thead`
  text-align: left;
  color: #495057;
`;

export const Th = styled.th`
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #dee2e6;
`;

export const Tr = styled.tr<{ status: 'completed' | 'pending' }>`
  background-color: ${({ status }) => status === 'completed' ? '#f8f9fa' : 'transparent'};
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #212529;
  font-weight: 500;
`;

export const StatusCell = styled.div<{ status: 'completed' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ status }) => status === 'completed' ? '#28a745' : '#fd7e14'};
`;

// -- Botão de Ação --
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export const ProceedButton = styled.button`
  background-color: #107569;
  color: white;
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

  &:hover {
    opacity: 0.9;
  }
`;