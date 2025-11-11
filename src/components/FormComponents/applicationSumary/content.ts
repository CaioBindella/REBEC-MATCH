import { FaList, FaCheck, FaHourglassHalf } from 'react-icons/fa';

export type StepStatus = 'completed' | 'pending' | 'active';

// Itens para a barra de progresso visual (Stepper)
export const stepperItems = [
  { id: 0, name: 'Sumário', status: 'active', icon: FaList },
  { id: 1, name: 'Identificação Institucional', status: 'completed', icon: FaCheck },
  { id: 2, name: 'Pessoal', status: 'pending', icon: FaHourglassHalf },
  { id: 3, name: 'Atuação', status: 'pending', icon: FaHourglassHalf },
  { id: 4, name: 'Infraestrutura', status: 'pending', icon: FaHourglassHalf },
  { id: 5, name: 'Capacitação e conformidade', status: 'pending', icon: FaHourglassHalf },
  { id: 6, name: 'Financiamento e sustentabilidade', status: 'pending', icon: FaHourglassHalf },
] as const;

// Itens para a tabela de status
export const tableSteps = [
  { id: 1, name: 'Identificação Institucional', status: 'completed' },
  { id: 2, name: 'Pessoal', status: 'pending' },
  { id: 3, name: 'Atuação', status: 'pending' },
  { id: 4, name: 'Infraestrutura', status: 'pending' },
  { id: 5, name: 'Capacitação e conformidade', status: 'pending' },
  { id: 6, name: 'Financiamento e sustentabilidade', status: 'pending' },
] as const;