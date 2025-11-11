'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext';
import { formSchema, FormData } from '@/lib/schema';
import Stepper from '@/components/FormComponents/forms/Stepper';

// Importa estilos (reutiliza muitos)
import {
  FormContainer,
  SectionTitle,
  Button,
  FormSection,
  InputGroup,
  Label,
  Input,
  Select,
  ErrorText,
  FormRow,
  AddButton,
  RemoveButton,
  ButtonRow,
  RepetibleSection,
  RadioButtonGroup,
  RadioButtonItem,
  RadioButtonInput,
  RadioButtonLabel,
  SubSectionTitle,
  FileUploadBox, // Reutilizado para o fundo cinza das certificações
} from './styled';

// --- Dados para Certificações (Exemplo) ---
const certificacoesNacionaisExemplo = ["Certificação A (BR)", "Certificação B (BR)", "Certificação C (BR)"];
const certificacoesInternacionaisExemplo = ["Certificação X (INT)", "Certificação Y (INT)", "Certificação Z (INT)"];
// ---

// Extrai a "fatia" do schema para esta página
type StepData = Pick<FormData, 'capacitacaoConformidade'>;
const stepSchema = formSchema.pick({ capacitacaoConformidade: true });

export default function CapacitacaoConformidadePage() {
  const router = useRouter();
  const { state, dispatch } = useFormState();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      capacitacaoConformidade: state.capacitacaoConformidade,
    },
  });

  // Hook para Certificações Nacionais
  const {
    fields: nacionaisFields,
    append: appendNacional,
    remove: removeNacional,
  } = useFieldArray({
    control,
    name: 'capacitacaoConformidade.certificacoesNacionais',
  });

  // Hook para Certificações Internacionais
  const {
    fields: internacionaisFields,
    append: appendInternacional,
    remove: removeInternacional,
  } = useFieldArray({
    control,
    name: 'capacitacaoConformidade.certificacoesInternacionais',
  });

  const onSubmit = (data: StepData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    router.push('/financiamento-sustentabilidade'); // Navega para o próximo passo
  };

  // Helper de erro
  const getError = (fieldName: string) => {
    let error: any = errors.capacitacaoConformidade;
    const keys = fieldName.split('.');
    for (const key of keys) {
      if (!error) break;
      error = (error as Record<string, any>)[key];
    }
    const message = error?.message || error?.root?.message;
    return message && <ErrorText>{message}</ErrorText>;
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Stepper currentStep={5} />

      {/* ============================================= */}
      {/* SEÇÃO CONFORMIDADE                           */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Conformidade</SectionTitle>
        {/* Adicionei um parágrafo de exemplo */}
        <p style={{color: '#6c757d', marginTop: '-1rem'}}>Lorem ipsum dolor sit amet</p> 

        <FormRow>
            <InputGroup style={{ flex: '1 1 200px' }}>
                <Label>Quantas inspeções você recebeu nos últimos 5 anos?</Label>
                <Input 
                    type="number"
                    min="0"
                    placeholder="9999"
                    {...register('capacitacaoConformidade.numero_inspecoes_5anos')}
                />
                 {getError('numero_inspecoes_5anos')}
            </InputGroup>

            <InputGroup style={{ flex: '1 1 300px' }}>
                <Label>Possui profissionais responsáveis pelas questões regulatórias?</Label>
                 <RadioButtonGroup>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="Sim" 
                          {...register('capacitacaoConformidade.possui_profissionais_regulatorios')} 
                        />
                        <RadioButtonLabel>Sim</RadioButtonLabel>
                    </RadioButtonItem>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="Nao" 
                          {...register('capacitacaoConformidade.possui_profissionais_regulatorios')} 
                        />
                        <RadioButtonLabel>Não</RadioButtonLabel>
                    </RadioButtonItem>
                </RadioButtonGroup>
                 {getError('possui_profissionais_regulatorios')}
            </InputGroup>
        </FormRow>
      </FormSection>

      {/* ============================================= */}
      {/* SEÇÃO CERTIFICAÇÕES                          */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Certificações</SectionTitle>

        {/* --- Nacionais --- */}
        <SubSectionTitle>Nacionais</SubSectionTitle>
        {getError('certificacoesNacionais')} {/* Erro geral do array */}
        {nacionaisFields.map((field, index) => (
            <FileUploadBox key={field.id} style={{ alignItems: 'flex-end', gap: '1rem' }}> {/* Reutiliza o estilo de fundo */}
                <InputGroup style={{ flex: '2 1 300px' }}>
                    <Label>Certificações nacionais que o CPC possui</Label>
                    <Select {...register(`capacitacaoConformidade.certificacoesNacionais.${index}.nome`)}>
                        <option value="">Escolha</option>
                        {certificacoesNacionaisExemplo.map(cert => <option key={cert} value={cert}>{cert}</option>)}
                    </Select>
                    {getError(`certificacoesNacionais.${index}.nome`)}
                </InputGroup>
                <InputGroup style={{ flex: '2 1 300px' }}>
                    <Label>Inserir link dos certificados de treinamento</Label>
                    <Input 
                        type="text"
                        placeholder="https://..."
                        {...register(`capacitacaoConformidade.certificacoesNacionais.${index}.link_documento`)}
                    />
                     {getError(`certificacoesNacionais.${index}.link_documento`)}
                </InputGroup>
                 {nacionaisFields.length > 1 && (
                    <RemoveButton type="button" onClick={() => removeNacional(index)} style={{ height: 'fit-content', marginBottom: '0.8rem' }}>
                        Remover
                    </RemoveButton>
                 )}
            </FileUploadBox>
        ))}
        <AddButton type="button" onClick={() => appendNacional({ nome: '', link_documento: '' })}>
            Adicionar outra certificação
        </AddButton>

         {/* --- Internacionais --- */}
        <SubSectionTitle style={{ marginTop: '2rem' }}>Internacionais</SubSectionTitle>
        {getError('certificacoesInternacionais')} {/* Erro geral do array */}
        {internacionaisFields.map((field, index) => (
            <FileUploadBox key={field.id} style={{ alignItems: 'flex-end', gap: '1rem' }}> {/* Reutiliza o estilo de fundo */}
                <InputGroup style={{ flex: '2 1 300px' }}>
                    <Label>Certificações internacionais que o CPC possui</Label>
                    <Select {...register(`capacitacaoConformidade.certificacoesInternacionais.${index}.nome`)}>
                        <option value="">Escolha</option>
                         {certificacoesInternacionaisExemplo.map(cert => <option key={cert} value={cert}>{cert}</option>)}
                    </Select>
                     {getError(`certificacoesInternacionais.${index}.nome`)}
                </InputGroup>
                <InputGroup style={{ flex: '2 1 300px' }}>
                    <Label>Inserir link dos certificados de treinamento</Label>
                     <Input 
                        type="text"
                        placeholder="https://..."
                        {...register(`capacitacaoConformidade.certificacoesInternacionais.${index}.link_documento`)}
                    />
                     {getError(`certificacoesInternacionais.${index}.link_documento`)}
                </InputGroup>
                 {internacionaisFields.length > 1 && (
                     <RemoveButton type="button" onClick={() => removeInternacional(index)} style={{ height: 'fit-content', marginBottom: '0.8rem' }}>
                        Remover
                    </RemoveButton>
                 )}
            </FileUploadBox>
        ))}
         <AddButton type="button" onClick={() => appendInternacional({ nome: '', link_documento: '' })}>
            Adicionar outra certificação
        </AddButton>

      </FormSection>


      {/* Botões de Navegação */}
      <ButtonRow>
        <Button type="button" onClick={() => router.back()} $variant="secondary">
          Anterior
        </Button>
        <Button type="submit" onClick={() => router.push("/financiamento_sustentabilidade")}>
          Avançar
        </Button>
      </ButtonRow>
    </FormContainer>
  );
}