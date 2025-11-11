'use client';
import React from 'react';
import { StepperContainer, Step, StepLabel } from './styled';

const steps = ["Sumário", "Identificação Institucional", "Pessoal", "Atuação", "Infraestrutura", "Capacitação e conformidade", "Financiamento e sustentabilidade"];

interface StepperProps {
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => (
  <StepperContainer>
    {steps.map((label, index) => (
      <Step key={index} $isActive={index === currentStep}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </StepperContainer>
);

export default Stepper;