'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext';
import { formSchema, FormData } from '@/lib/schema';
import Stepper from '@/components/FormComponents/forms/Stepper';
import { FaPlus, FaTrash } from 'react-icons/fa'; 

// Importa estilos
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
  FormRowYear,
  RepetibleSection, // Para Orçamento Anual
  SubSectionTitle,
  FileUploadBox, // Para fundo do Orçamento Anual
  ModelagemContainer, // Reutilizado para Práticas
  ModelagemInputRow, // Reutilizado para Práticas
  ModelagemList, // Reutilizado para Práticas
  ModelagemListItem, // Reutilizado para Práticas
  IconButton, // Reutilizado para Práticas
} from './styled';

// --- Dados para Práticas Sustentáveis (Exemplo - buscaria do DB) ---
const praticasFinanceirasExemplo = ["Prática Financeira 1", "Prática Financeira 2", "Outra Prática Financeira"];
const praticasAmbientaisExemplo = ["Prática Ambiental A", "Prática Ambiental B", "Outra Prática Ambiental"];
const praticasSociaisExemplo = ["Prática Social X", "Prática Social Y", "Outra Prática Social"];
// ---

// --- Helper para gerar o seletor de anos ---
const generateYearOptions = (startOffset = 0, endOffset = 5) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear + startOffset;
  const endYear = currentYear - endOffset;
  const years = [];
  for (let year = startYear; year >= endYear; year--) {
    years.push(year.toString());
  }
  return years;
};
// ---

// Extrai a "fatia" do schema
type StepData = Pick<FormData, 'financiamentoSustentabilidade'>;
const stepSchema = formSchema.pick({ financiamentoSustentabilidade: true });

export default function FinanciamentoSustentabilidadePage() {
  const router = useRouter();
  const { state, dispatch } = useFormState();
  const availableYears = generateYearOptions(0, 10); // Anos: atual até 10 anos atrás

  // Estados locais para os selects de práticas
  const [currentPraticaFin, setCurrentPraticaFin] = useState('');
  const [currentPraticaAmb, setCurrentPraticaAmb] = useState('');
  const [currentPraticaSoc, setCurrentPraticaSoc] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      financiamentoSustentabilidade: state.financiamentoSustentabilidade,
    },
  });

  // Hook para Orçamentos Anuais
  const {
    fields: orcamentoFields,
    append: appendOrcamento,
    remove: removeOrcamento,
  } = useFieldArray({
    control,
    name: 'financiamentoSustentabilidade.orcamentosAnuais',
  });

   // Hooks para Práticas Sustentáveis
  const { fields: finFields, append: appendFin, remove: removeFin } = useFieldArray({ control, name: 'financiamentoSustentabilidade.praticasFinanceiras' });
  const { fields: ambFields, append: appendAmb, remove: removeAmb } = useFieldArray({ control, name: 'financiamentoSustentabilidade.praticasAmbientais' });
  const { fields: socFields, append: appendSoc, remove: removeSoc } = useFieldArray({ control, name: 'financiamentoSustentabilidade.praticasSociais' });


  // Handlers para adicionar práticas
  const handleAddPratica = (
      tipo: 'Financeira' | 'Ambiental' | 'Social',
      appendFn: (value: { nome: string }) => void, 
      currentValue: string, 
      setCurrentValue: (value: string) => void
    ) => {
      if (currentValue) {
        appendFn({ nome: currentValue });
        setCurrentValue(''); // Limpa o select
      } else {
        alert(`Selecione uma prática ${tipo.toLowerCase()} antes de adicionar.`);
      }
  };

  const onSubmit = (data: StepData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    // Aqui você pode redirecionar para uma página de sucesso,
    // fazer a submissão final para o backend, etc.
    alert('Formulário enviado com sucesso!'); 
    // Exemplo: router.push('/formulario-concluido'); 
  };

  // Helper de erro
  const getError = (fieldName: string) => {
    let error: any = errors.financiamentoSustentabilidade;
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
      <Stepper currentStep={6} />

      {/* ============================================= */}
      {/* SEÇÃO FINANCEIRO                             */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Financeiro</SectionTitle>
        {getError('orcamentosAnuais')} {/* Erro geral do array */}
        
        {orcamentoFields.map((field, index) => (
          // Usando FileUploadBox pelo estilo de fundo cinza
          <FileUploadBox key={field.id}> 
            {orcamentoFields.length > 1 && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
                  <RemoveButton type="button" onClick={() => removeOrcamento(index)}>
                    Remover Ano
                  </RemoveButton>
                </div>
              )}
            <FormRowYear>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Ano</Label>
                <Select {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.ano`)}>
                  <option value="">Escolha</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </Select>
                 {getError(`orcamentosAnuais.${index}.ano`)}
              </InputGroup>
              <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Orçamento</Label>
                <Input
                  type="number"
                  placeholder="9999"
                  {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.orcamento`)}
                />
                 {getError(`orcamentosAnuais.${index}.orcamento`)}
              </InputGroup>
            </FormRowYear>

            <SubSectionTitle style={{ marginTop: '0.5rem', fontSize: '1rem', border: 'none' }}>
                Composição do Orçamento anual
            </SubSectionTitle>
             {getError(`orcamentosAnuais.${index}.percentual_pesquisa_clinica`)} {/* Erro da soma dos percentuais */}
             
            <FormRow style={{ gap: '0.8rem' }}> {/* Gap menor para percentuais */}
                <InputGroup>
                  <Label style={{color: '#212529', fontWeight: '300'}}>% pesquisa clínica, incluindo pessoal</Label>
                  <Input type="number" step="0.1" placeholder="%" {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.percentual_pesquisa_clinica`)} />
                </InputGroup>
                 <InputGroup>
                  <Label style={{color: '#212529', fontWeight: '300'}}>% capital</Label>
                  <Input type="number" step="0.1" placeholder="%" {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.percentual_capital`)} />
                </InputGroup>
                 <InputGroup>
                  <Label style={{color: '#212529', fontWeight: '300'}}>% custeio</Label>
                  <Input type="number" step="0.1" placeholder="%" {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.percentual_custeio`)} />
                </InputGroup>
                 <InputGroup>
                  <Label style={{color: '#212529', fontWeight: '300'}}>% de financiamento privado</Label>
                  <Input type="number" step="0.1" placeholder="%" {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.percentual_financiamento_privado`)} />
                </InputGroup>
                 <InputGroup>
                  <Label style={{color: '#212529', fontWeight: '300'}}>% de financiamento público</Label>
                  <Input type="number" step="0.1" placeholder="%" {...register(`financiamentoSustentabilidade.orcamentosAnuais.${index}.percentual_financiamento_publico`)} />
                </InputGroup>
            </FormRow>
          </FileUploadBox>
        ))}
         <AddButton 
            type="button" 
            onClick={() => appendOrcamento({ 
                ano: '', orcamento: '', percentual_pesquisa_clinica: '', percentual_capital: '', 
                percentual_custeio: '', percentual_financiamento_privado: '', percentual_financiamento_publico: ''
             })}
        >
          Adicionar outro ano
        </AddButton>
      </FormSection>

     {/* ============================================= */}
      {/* SEÇÃO SUSTENTABILIDADE                       */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Sustentabilidade</SectionTitle>

        {/* --- Práticas Financeiras --- */}
        <ModelagemContainer>
          <Label>Quais das práticas financeiramente sustentáveis o CPEC adota?</Label>
          <ModelagemInputRow>
            <InputGroup style={{ flexGrow: 3 }}> {/* Ocupa mais espaço */}
              <Select value={currentPraticaFin} onChange={(e) => setCurrentPraticaFin(e.target.value)}>
                <option value="">Escolha</option>
                {praticasFinanceirasExemplo.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </InputGroup>
            <IconButton type="button" onClick={() => handleAddPratica('Financeira', appendFin, currentPraticaFin, setCurrentPraticaFin)} title="Adicionar Prática Financeira">
              <FaPlus />
            </IconButton>
          </ModelagemInputRow>
          {finFields.length > 0 && (
            <ModelagemList>
              {finFields.map((field, index) => (
                <ModelagemListItem key={field.id} $isSingleItem> {/* Estilo para item único */}
                  <input type="hidden" {...register(`financiamentoSustentabilidade.praticasFinanceiras.${index}.nome`)} />
                  <span>{field.nome}</span>
                  <IconButton type="button" onClick={() => removeFin(index)} title="Remover Prática" $isDelete> <FaTrash /> </IconButton>
                </ModelagemListItem>
              ))}
            </ModelagemList>
          )}
        </ModelagemContainer>

        {/* --- Práticas Ambientais --- */}
         <ModelagemContainer>
          <Label>Quais das práticas ambientalmente sustentáveis o CPEC adota?</Label>
          <ModelagemInputRow>
            <InputGroup style={{ flexGrow: 3 }}>
              <Select value={currentPraticaAmb} onChange={(e) => setCurrentPraticaAmb(e.target.value)}>
                <option value="">Escolha</option>
                 {praticasAmbientaisExemplo.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </InputGroup>
            <IconButton type="button" onClick={() => handleAddPratica('Ambiental', appendAmb, currentPraticaAmb, setCurrentPraticaAmb)} title="Adicionar Prática Ambiental">
              <FaPlus />
            </IconButton>
          </ModelagemInputRow>
           {ambFields.length > 0 && (
            <ModelagemList>
              {ambFields.map((field, index) => (
                <ModelagemListItem key={field.id} $isSingleItem>
                  <input type="hidden" {...register(`financiamentoSustentabilidade.praticasAmbientais.${index}.nome`)} />
                  <span>{field.nome}</span>
                  <IconButton type="button" onClick={() => removeAmb(index)} title="Remover Prática" $isDelete> <FaTrash /> </IconButton>
                </ModelagemListItem>
              ))}
            </ModelagemList>
          )}
        </ModelagemContainer>

        {/* --- Práticas Sociais --- */}
         <ModelagemContainer>
          <Label>Quais das práticas socialmente sustentáveis o CPEC adota?</Label>
          <ModelagemInputRow>
            <InputGroup style={{ flexGrow: 3 }}>
              <Select value={currentPraticaSoc} onChange={(e) => setCurrentPraticaSoc(e.target.value)}>
                <option value="">Escolha</option>
                 {praticasSociaisExemplo.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </InputGroup>
            <IconButton type="button" onClick={() => handleAddPratica('Social', appendSoc, currentPraticaSoc, setCurrentPraticaSoc)} title="Adicionar Prática Social">
              <FaPlus />
            </IconButton>
          </ModelagemInputRow>
           {socFields.length > 0 && (
            <ModelagemList>
              {socFields.map((field, index) => (
                <ModelagemListItem key={field.id} $isSingleItem>
                  <input type="hidden" {...register(`financiamentoSustentabilidade.praticasSociais.${index}.nome`)} />
                  <span>{field.nome}</span>
                  <IconButton type="button" onClick={() => removeSoc(index)} title="Remover Prática" $isDelete> <FaTrash /> </IconButton>
                </ModelagemListItem>
              ))}
            </ModelagemList>
          )}
        </ModelagemContainer>

      </FormSection>


      {/* Botões de Navegação */}
      <ButtonRow>
        <Button type="button" onClick={() => router.back()} $variant="secondary">
          Anterior
        </Button>
        {/* Botão final é 'Enviar' */}
        <Button type="submit" onClick={() => router.push("/confirmacao")}> 
          Avançar
        </Button>
      </ButtonRow>
    </FormContainer>
  );
}