'use client';

import { useState } from 'react'; // Para controlar os inputs da Modelagem
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext';
import { formSchema, FormData } from '@/lib/schema';
import Stepper from '@/components/FormComponents/forms/Stepper';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Ícones

// Importa os novos estilos (reutiliza muitos)
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
  TextArea, // Novo
  RadioButtonGroup, // Novo
  RadioButtonItem, // Novo
  RadioButtonInput, // Novo
  RadioButtonLabel, // Novo
  ModelagemContainer, // Novo
  ModelagemInputRow, // Novo
  ModelagemList, // Novo
  ModelagemListItem, // Novo
  IconButton, // Novo
} from './styled';

// --- Dados para Modelagem ORPC (do design) ---
const servicosORPC = [
  "Assuntos Laboratoriais", "TI", "Direito Regulatório", "Assuntos Aduaneiros", "Outros"
];
// ---

// Extrai a "fatia" do schema para esta página
type StepData = Pick<FormData, 'infraestrutura'>;
const stepSchema = formSchema.pick({ infraestrutura: true });

export default function InfraestruturaPage() {
  const router = useRouter();
  const { state, dispatch } = useFormState();

  // Estado local para os inputs da Modelagem antes de adicionar
  const [currentServico, setCurrentServico] = useState('');
  const [currentTipo, setCurrentTipo] = useState<'Contrata' | 'Oferece' | ''>('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      infraestrutura: state.infraestrutura,
    },
  });

  // Hook para Equipamentos
  const {
    fields: equipamentoFields,
    append: appendEquipamento,
    remove: removeEquipamento,
  } = useFieldArray({
    control,
    name: 'infraestrutura.equipamentos',
  });

  // Hook para Modelagem CPEC x ORPC
  const {
    fields: modelagemFields,
    append: appendModelagem,
    remove: removeModelagem,
  } = useFieldArray({
    control,
    name: 'infraestrutura.modelagem_orpc',
  });

  // Função para adicionar item na Modelagem
  const handleAddModelagem = () => {
    if (currentServico && currentTipo) {
      appendModelagem({ servico: currentServico, tipo: currentTipo });
      // Limpa os inputs locais
      setCurrentServico('');
      setCurrentTipo('');
    } else {
      // Poderia adicionar uma mensagem de erro aqui
      alert('Por favor, selecione um serviço e um tipo (Contrata/Oferece) antes de adicionar.');
    }
  };

  const onSubmit = (data: StepData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    router.push('/capacitacao-conformidade'); // Navega para o próximo passo
  };

  // Helper de erro
  const getError = (fieldName: string) => {
    let error: any = errors.infraestrutura;
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
      <Stepper currentStep={4} />

      {/* ============================================= */}
      {/* SEÇÃO EQUIPAMENTOS                           */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Equipamentos</SectionTitle>
        {getError('equipamentos')}
        
        {equipamentoFields.map((field, index) => (
          <RepetibleSection key={field.id}>
            {equipamentoFields.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RemoveButton type="button" onClick={() => removeEquipamento(index)}>
                  Remover Equipamento
                </RemoveButton>
              </div>
            )}
            <FormRow>
               <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Equipamento</Label>
                <Input
                  {...register(`infraestrutura.equipamentos.${index}.nome`)}
                  placeholder="Preencha nome do equipamento"
                />
                {getError(`equipamentos.${index}.nome`)}
              </InputGroup>
              <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Modelo</Label>
                <Input
                  {...register(`infraestrutura.equipamentos.${index}.modelo`)}
                  placeholder="Preencha modelo"
                />
                {getError(`equipamentos.${index}.modelo`)}
              </InputGroup>
               <InputGroup style={{ flex: '1 1 100px' }}>
                <Label>Quantidade</Label>
                  <Input
                      type="number"
                      min="1" // Opcional: Garante que o valor mínimo seja 1
                      {...register(`infraestrutura.equipamentos.${index}.quantidade`)}
                      placeholder="Qtd." // Placeholder opcional
                  />
                {getError(`equipamentos.${index}.quantidade`)}
              </InputGroup>
            </FormRow>
          </RepetibleSection>
        ))}
         <AddButton type="button" onClick={() => appendEquipamento({ nome: '', modelo: '', quantidade: '' })}>
          Adicionar outro equipamento
        </AddButton>
      </FormSection>

      {/* ============================================= */}
      {/* SEÇÃO INSTALAÇÕES                           */}
      {/* ============================================= */}
       <FormSection>
        <SectionTitle>Instalações</SectionTitle>
        <FormRow>
            {/* Relação ORPC */}
            <InputGroup style={{ flex: '1 1 400px' }}>
                <Label>Como identifica a relação do CPEC com o modelo Organização Representativa de Pesquisa Clínica (ORPC)?</Label>
                <RadioButtonGroup>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="sim_sempre" 
                          {...register('infraestrutura.relacao_orpc')} 
                        />
                        <RadioButtonLabel>sim, sempre utilizamos serviços ORPC</RadioButtonLabel>
                    </RadioButtonItem>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="sim_eventualmente" 
                          {...register('infraestrutura.relacao_orpc')} 
                        />
                        <RadioButtonLabel>sim, eventualmente utilizamos serviços ORPC</RadioButtonLabel>
                    </RadioButtonItem>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="nao" 
                          {...register('infraestrutura.relacao_orpc')} 
                        />
                        <RadioButtonLabel>não, não utilizamos serviços ORPC</RadioButtonLabel>
                    </RadioButtonItem>
                    <RadioButtonItem>
                        <RadioButtonInput 
                          type="radio" 
                          value="atuamos_como" 
                          {...register('infraestrutura.relacao_orpc')} 
                        />
                        <RadioButtonLabel>atuamos como ORPC</RadioButtonLabel>
                    </RadioButtonItem>
                </RadioButtonGroup>
                {getError('relacao_orpc')}
            </InputGroup>

            {/* Caixa de Texto */}
             <InputGroup style={{ flex: '1 1 300px' }}>
                <Label>Caso não esteja listada, especifique.</Label>
                <TextArea 
                    rows={5} 
                    placeholder="Especifique os itens se necessário"
                    {...register('infraestrutura.instalacoes_especificas')} 
                />
                 {getError('instalacoes_especificas')}
            </InputGroup>
        </FormRow>
       </FormSection>

      {/* ============================================= */}
      {/* SEÇÃO MODELAGEM CPEC x ORPC                  */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Modelagem CPEC x ORPC</SectionTitle>
        <ModelagemContainer>
            {/* Inputs para adicionar novo item */}
            <ModelagemInputRow>
                <InputGroup style={{ flex: '2 1 200px' }}>
                    <Label>Serviço</Label>
                    <Select value={currentServico} onChange={(e) => setCurrentServico(e.target.value)}>
                        <option value="">Escolha</option>
                        {servicosORPC.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </InputGroup>
                <InputGroup style={{ flex: '1 1 100px' }}>
                    <Label>Tipo</Label>
                     <Select value={currentTipo} onChange={(e) => setCurrentTipo(e.target.value as any)}>
                        <option value="">Escolha</option>
                        <option value="Contrata">Contrata</option>
                        <option value="Oferece">Oferece</option>
                    </Select>
                </InputGroup>
                <IconButton type="button" onClick={handleAddModelagem} title="Adicionar Serviço">
                    <FaPlus />
                </IconButton>
            </ModelagemInputRow>
            {getError('modelagem_orpc')} {/* Erro geral do array */}

            {/* Lista de itens adicionados */}
            {modelagemFields.length > 0 && (
                <ModelagemList>
                    {/* Cabeçalho Fixo */}
                    <ModelagemListItem $isHeader> 
                        <span>Serviço</span>
                        <span>Tipo</span>
                        <span>Ação</span>
                    </ModelagemListItem>
                    {/* Itens */}
                    {modelagemFields.map((field, index) => (
                        <ModelagemListItem key={field.id}>
                            {/* Inputs ocultos registrados com react-hook-form */}
                            <input type="hidden" {...register(`infraestrutura.modelagem_orpc.${index}.servico`)} />
                            <input type="hidden" {...register(`infraestrutura.modelagem_orpc.${index}.tipo`)} />
                            {/* Exibição */}
                            <span>{field.servico}</span>
                            <span>{field.tipo}</span>
                            <IconButton type="button" onClick={() => removeModelagem(index)} title="Remover Serviço" $isDelete>
                                <FaTrash />
                            </IconButton>
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
        <Button type="submit" onClick={() => router.push("/capacidade_conformidade")}>
          Avançar
        </Button>
      </ButtonRow>
    </FormContainer>
  );
}