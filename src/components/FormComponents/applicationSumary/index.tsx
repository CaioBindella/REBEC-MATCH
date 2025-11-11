import React from 'react';

// Ícones
import { FaCheckCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

// Dados
import { stepperItems, tableSteps } from './content';

// Estilos
import {
  SummaryContainer,
  StepperContainer,
  StepItem,
  StepIcon,
  StepLabel,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  StatusCell,
  ButtonContainer,
  ProceedButton,
} from './styled';

const ApplicationSummary: React.FC = () => {
  return (
    <SummaryContainer>
      {/* Stepper de Progresso */}
      <StepperContainer>
        {stepperItems.map(item => (
          <StepItem key={item.id}>
            <StepIcon status={item.status}>
              <item.icon />
            </StepIcon>
            <StepLabel>{item.name}</StepLabel>
          </StepItem>
        ))}
      </StepperContainer>

      {/* Tabela de Status */}
      <Table>
        <Thead>
          <tr>
            <Th>Passo</Th>
            <Th>Nome</Th>
            <Th>Status</Th>
          </tr>
        </Thead>
        <tbody>
          {tableSteps.map(step => (
            <Tr key={step.id} status={step.status}>
              <Td>{step.id}</Td>
              <Td>{step.name}</Td>
              <Td>
                <StatusCell status={step.status}>
                  {step.status === 'completed' ? (
                    <>
                      <span>Completo</span>
                      <FaCheckCircle />
                    </>
                  ) : (
                    <>
                      <span>Incompleto</span>
                      <FaExclamationCircle />
                    </>
                  )}
                </StatusCell>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {/* Botão de Ação */}
      <ButtonContainer>
        <Link href="/identificacao-institucional-Page">
          <ProceedButton>
            Prossiga <FaArrowRight />
          </ProceedButton>
        </Link>
      </ButtonContainer>
    </SummaryContainer>
  );
};

export default ApplicationSummary;