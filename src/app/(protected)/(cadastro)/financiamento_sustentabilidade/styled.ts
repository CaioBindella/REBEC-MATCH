'use client';
import styled, { css } from 'styled-components';

// Importa estilos reutilizados das páginas anteriores
import { 
    FormContainer as BaseFormContainer,
    SectionTitle as BaseSectionTitle,
    Button as BaseButton,
    FormSection as BaseFormSection,
    Label as BaseLabel,
    Input as BaseInput,
    Select as BaseSelect,
    ErrorText as BaseErrorText,
    FormRow as BaseFormRow,
    AddButton as BaseAddButton,
    RemoveButton as BaseRemoveButton,
    ButtonRow as BaseButtonRow,
    RepetibleSection as BaseRepetibleSection, 
    SubSectionTitle as BaseSubSectionTitle,
} from '../capacidade_conformidade/styled';

import { 
    FileUploadBox as BaseFileUploadBox 
} from '../identificacao-institucional-Page/styled';

import {
    ModelagemContainer as BaseModelagemContainer,
    ModelagemInputRow as BaseModelagemInputRow,
    ModelagemList as BaseModelagemList,
    ModelagemListItem as BaseModelagemListItem,
    IconButton as BaseIconButton,
} from '../infraestrutura/styled';


// Exporta os componentes reutilizados com os mesmos nomes
export const FormContainer = BaseFormContainer;
export const SectionTitle = BaseSectionTitle;
export const Button = BaseButton;
export const FormSection = BaseFormSection;
export const Label = BaseLabel;
export const Select = BaseSelect;
export const ErrorText = BaseErrorText;
export const AddButton = BaseAddButton;
export const RemoveButton = BaseRemoveButton;
export const ButtonRow = BaseButtonRow;
export const RepetibleSection = BaseRepetibleSection;
export const SubSectionTitle = BaseSubSectionTitle;
export const ModelagemContainer = BaseModelagemContainer; // Usado para Práticas
export const ModelagemInputRow = BaseModelagemInputRow; // Usado para Práticas
export const ModelagemList = BaseModelagemList; // Usado para Práticas
export const IconButton = BaseIconButton; // Usado para Práticas


export const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FormRowYear = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
`;

export const Input = styled(BaseInput)`
  /* Garante que o fundo seja branco */
  background-color: #fff;
  /* Garante a borda padrão */
  border: 1px solid #ced4da;
  border-radius: 4px;

  /* Garante que as setas do number input apareçam (remove estilos que podem escondê-las) */
  -moz-appearance: number-input; /* Padrão para Firefox */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: auto; /* Padrão para Chrome/Safari/Edge */
    margin: 0; /* Remove margem extra se houver */
  }

  &:focus {
    outline: none;
    border-color: #107569; // Mantém o foco
    box-shadow: 0 0 0 2px rgba(16, 117, 105, 0.2); // Mantém o foco
  }
`;

export const FileUploadBox = styled(BaseFileUploadBox)`
  background-color: #E9ECEF;
  border: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
`;

// Modifica o ModelagemListItem para aceitar uma prop $isSingleItem
export const ModelagemListItem = styled(BaseModelagemListItem)<{ 
  $isSingleItem?: boolean;
  $isHeader?: boolean;
}>`
  ${({ $isSingleItem, $isHeader }) => $isSingleItem && css`
    /* Se for item único (prática), ajusta o grid */
    grid-template-columns: 1fr auto; /* Coluna do nome flexível, botão tamanho auto */
    
    /* Remove a borda inferior padrão para não ter linha dupla */
    border-bottom: 1px solid #e9ecef;
    
    &:last-child {
      border-bottom: none;
    }

    span {
      font-weight: 500; /* Peso normal para itens da lista */
      color: #343a40;
    }
    
    /* Botão fica alinhado à direita */
    ${IconButton} {
      justify-self: end;
    }
  `}

  /* Oculta o cabeçalho se for item único (não precisamos de título de coluna) */
  ${({ $isHeader }) => $isHeader && css`
    display: none; 
  `}
`; 