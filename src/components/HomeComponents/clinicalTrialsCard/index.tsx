import React from 'react';

import {
  TrialsContainer,
  MainTitle,
  TrialCard,
  TrialTitle,
  MetadataGrid,
  OpenButton,
  ViewAllLink,
} from './styled';

import { trialsData, Trial } from './content';
import { FaPlusCircle } from 'react-icons/fa';

const TrialItem: React.FC<{ trial: Trial }> = ({ trial }) => (
  <TrialCard>
    <TrialTitle>{trial.title}</TrialTitle>
    <MetadataGrid>
      <div><span>Registro:</span> {trial.registro}</div>
      <div><span>Última revisão:</span> {trial.ultimaRevisao}</div>
      <div><span>Última aprovação:</span> {trial.ultimaAprovacao}</div>
      <div><span>Tipo de estudo:</span> {trial.tipoEstudo}</div>
    </MetadataGrid>
    <OpenButton>Abrir</OpenButton>
  </TrialCard>
);


const ClinicalTrials: React.FC = () => {
  return (
    <TrialsContainer>
      <MainTitle>Ensaios Clínicos</MainTitle>
      <div>
        {trialsData.map(trial => (
          <TrialItem key={trial.id} trial={trial} />
        ))}
      </div>
      <ViewAllLink href="#">
        <FaPlusCircle />
        <span>Veja todos</span>
      </ViewAllLink>
    </TrialsContainer>
  );
};

export default ClinicalTrials;