'use client';
import styled from 'styled-components';
import media from "@/lib/media";

// Reutilizando estilos de uma página de formulário existente
// para manter a consistência.
import { 
    FormContainer as BaseFormContainer,
    SectionTitle as BaseSectionTitle,
    Button as BaseButton,
    FormSection as BaseFormSection,
    InputGroup as BaseInputGroup,
    Label as BaseLabel,
    Input as BaseInput,
    ErrorText as BaseErrorText,
    FormRow as BaseFormRow,
    ButtonRow as BaseButtonRow,
} from '../../(protected)/(cadastro)/pessoal/styled'; // Ajuste o caminho se necessário


// Exporta os componentes reutilizados
export const FormContainer = styled(BaseFormContainer)`
    margin-top: 3rem;
    margin-bottom: 3rem;
    max-width: 800px;

    ${
        media.xsOnly`
            width: 90%;
        `
    }

    ${  
        media.smOnly`
            width: 90%;
        `
    }

    ${  
        media.mdOnly`
            width: 90%;
        `
    }
`;

export const SectionTitle = BaseSectionTitle;
export const FormSection = BaseFormSection;
export const InputGroup = BaseInputGroup;
export const Label = BaseLabel;
export const Input = BaseInput;
export const ErrorText = BaseErrorText;
export const FormRow = BaseFormRow;
export const ButtonRow = BaseButtonRow;
export const Button = BaseButton;