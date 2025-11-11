'use client';
import styled from 'styled-components';

// Importa estilos reutilizados das páginas anteriores
// Certifique-se que os caminhos estejam corretos se você os moveu
import { 
    FormContainer as BaseFormContainer,
    SectionTitle as BaseSectionTitle,
    Button as BaseButton,
    FormSection as BaseFormSection,
    InputGroup as BaseInputGroup,
    Label as BaseLabel,
    Input as BaseInput,
    Select as BaseSelect,
    ErrorText as BaseErrorText,
    FormRow as BaseFormRow,
    AddButton as BaseAddButton,
    RemoveButton as BaseRemoveButton,
    ButtonRow as BaseButtonRow,
    RepetibleSection as BaseRepetibleSection, // Pode não ser usado aqui, mas bom ter
    RadioButtonGroup as BaseRadioButtonGroup,
    RadioButtonItem as BaseRadioButtonItem,
    RadioButtonInput as BaseRadioButtonInput,
    RadioButtonLabel as BaseRadioButtonLabel,
} from '../infraestrutura/styled'; // Ou de outra página que os tenha

// Reutiliza o FileUploadBox para o fundo cinza das certificações
import { FileUploadBox as BaseFileUploadBox } from '../identificacao-institucional-Page/styled';


// Exporta os componentes reutilizados com os mesmos nomes
export const FormContainer = BaseFormContainer;
export const SectionTitle = BaseSectionTitle;
export const Button = BaseButton;
export const FormSection = BaseFormSection;
export const InputGroup = BaseInputGroup;
export const Label = BaseLabel;
export const Input = BaseInput;
export const Select = BaseSelect;
export const ErrorText = BaseErrorText;
export const FormRow = BaseFormRow;
export const AddButton = BaseAddButton;
export const RemoveButton = BaseRemoveButton;
export const ButtonRow = BaseButtonRow;
export const RepetibleSection = BaseRepetibleSection;
export const RadioButtonItem = BaseRadioButtonItem;
export const RadioButtonInput = BaseRadioButtonInput;
export const RadioButtonLabel = BaseRadioButtonLabel;
export const FileUploadBox = BaseFileUploadBox;


// --- NOVOS ESTILOS ESPECÍFICOS (SE NECESSÁRIO) ---

// Subtítulo para Nacionais/Internacionais
export const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 1rem;
  /* margin-bottom: 0.5rem; */ /* Removido para colar mais no item abaixo */
`;

export const RadioButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 0;
`;