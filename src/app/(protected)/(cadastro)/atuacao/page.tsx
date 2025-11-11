'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext';
import { formSchema, FormData } from '@/lib/schema';
import Stepper from '@/components/FormComponents/forms/Stepper';
import Link from 'next/link';

// Importa os novos estilos
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
  CheckboxGrid,
  CheckboxItem,
  CheckboxInput,
  CheckboxLabel,
  SubSectionTitle,
} from './styled'; // Importando do seu arquivo de estilos

// --- Dados para os Checkboxes (Extraídos do V1__CPEC-schema.sql) ---
const tiposDeEstudo = [
  "Estudos de fase I", "Estudos de fase II", "Estudos de fase III", "Estudos de fase IV",
  "Estudos de bioequivalência", "Estudos observacionais", "Teste de diagnóstico",
  "Quase-experimentos", "Estudo de Causa/Fatores relativos", "Estudos de Ciência Básica",
  "Estudo de tratamento", "Estudo de prognóstico", "Pesquisa epidemiológica",
  "Estudos de prevenção", "Pesquisas de serviços de saúde"
]; //

const especialidadesSaude = [
  "Acupuntura", "Alergia e imunologia", "Anestesiologia", "Angiologia", "Cardiologia", 
  "Cirurgia cardiovascular", "Cirurgia da mão", "Cirurgia de cabeça e pescoço", 
  "Cirurgia do aparelho digestivo", "Cirurgia geral", "Cirurgia oncológica", "Cirurgia pediátrica", 
  "Cirurgia plástica", "Cirurgia torácica", "Cirurgia vascular", "Clínica médica", 
  "Coloproctologia", "Dermatologia", "Endocrinologia e metabologia", "Endoscopia", 
  "Gastroenterologia", "Genética médica", "Geriatria", "Ginecologia e obstetrícia", 
  "Hematologia e hemoterapia", "Homeopatia", "Infectologia", "Mastologia", 
  "Medicina de emergência", "Medicina de família e comunidade", "Medicina do trabalho", 
  "Medicina do tráfego", "Medicina esportiva", "Medicina física e reabilitação", 
  "Medicina intensiva", "Medicina legal e perícia médica", "Medicina nuclear", 
  "Medicina preventiva e social", "Nefrologia", "Neurocirurgia", "Neurologia", 
  "Nutrologia", "Oftalmologia", "Oncologia clínica", "Ortopedia e traumatologia", 
  "Otorrinolaringologia", "Patologia", "Patologia clínica/medicina laboratorial", 
  "Pediatria", "Pneumologia", "Psiquiatria", "Radiologia e diagnóstico por imagem", 
  "Radioterapia", "Reumatologia", "Urologia"
]; //

const outrasEspecialidades = [
  "Biomedicina", "Educação Física", "Enfermagem", "Farmácia", "Fisioterapia", 
  "Fonoaudiologia", "Nutrição", "Odontologia", "Psicologia", 
  "Técnicas coletivas",
  "Terapia ocupacional"
]; //
// --- Fim dos Dados ---

// Extrai a "fatia" do schema para esta página
type StepData = Pick<FormData, 'atuacao'>;
const stepSchema = formSchema.pick({ atuacao: true });

export default function AtuacaoPage() {
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
      atuacao: state.atuacao, 
    },
  });

  // Hook para Atividades de Pesquisa
  const {
    fields: atividadeFields,
    append: appendAtividade,
    remove: removeAtividade,
  } = useFieldArray({
    control,
    name: 'atuacao.atividadesPesquisa',
  });

  const onSubmit = (data: StepData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    router.push('/infraestrutura'); // Navega para o próximo passo
  };

  // Helper para pegar erros aninhados
  const getError = (fieldName: string) => {
    let error: any = errors.atuacao;
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
      <Stepper currentStep={3} />

      {/* SEÇÃO TIPOS/DESENHOS DE ESTUDO               */}
      <FormSection>
        <SectionTitle>Tipos/Desenhos de Estudo</SectionTitle>
        <Label>Quais os tipos de estudos admitidos no CPEC? (Classificação ICTRP)</Label>
        
        <CheckboxGrid>
          {tiposDeEstudo.map((tipo) => (
            <CheckboxItem key={tipo}>
              <CheckboxInput
                type="checkbox"
                value={tipo}
                {...register('atuacao.tiposEstudo')}
              />
              <CheckboxLabel>{tipo}</CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGrid>
        {getError('tiposEstudo')}
      </FormSection>
      
      {/* SEÇÃO ATIVIDADE DE PESQUISA (LAYOUT ATUALIZADO) */}
      <FormSection>
        <SectionTitle>Atividade de Pesquisa</SectionTitle>
        <Label>Cadastre as informações sobre os estudos conduzidos ou em andamento e código de registro primário</Label>
        <Label>(Classificação ICTRP/Clinical Trials USA).</Label>
        
        {atividadeFields.map((field, index) => (
          <RepetibleSection key={field.id}>
             {atividadeFields.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <RemoveButton type="button" onClick={() => removeAtividade(index)}>
                    Remover Atividade
                  </RemoveButton>
                </div>
              )}
            
            {/* Título (Linha 1) */}
            <InputGroup>
              <Label>Título</Label>
              <Input 
                {...register(`atuacao.atividadesPesquisa.${index}.titulo`)}
                placeholder="Digite o título"
              />
              {getError(`atividadesPesquisa.${index}.titulo`)}
            </InputGroup>

            {/* Campos restantes (Linha 2) */}
            <FormRow>
              {/* Grupo de Código (Prefixo + Numeração) */}
              <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Código</Label>
                {/* Sub-linha para os dois campos de código */}
                <FormRow style={{ gap: '0.5rem' }}> 
                  <Select 
                    {...register(`atuacao.atividadesPesquisa.${index}.codigoPrefixo`)}
                    style={{ flex: '1 0 80px' }} // Não cresce, base de 80px
                  >
                    <option value="">Prefixo</option>
                    <option value="NCT">NCT</option>
                    <option value="RBR">RBR</option>
                    <option value="Outro">Outro</option>
                  </Select>
                  <Input 
                    {...register(`atuacao.atividadesPesquisa.${index}.codigoNumeracao`)}
                    placeholder="Numeração"
                    style={{ flex: '2 1 120px' }} // Cresce 2x, base de 120px
                  />
                </FormRow>
                {getError(`atividadesPesquisa.${index}.codigoNumeracao`)}
              </InputGroup>

              {/* Tipo */}
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Tipo</Label>
                <Select {...register(`atuacao.atividadesPesquisa.${index}.tipo`)}>
                  <option value="">Escolha</option>
                  <option value="Tipo A">Tipo A</option>
                  <option value="Tipo B">Tipo B</option>
                </Select>
                {getError(`atuacao.atividadesPesquisa.${index}.tipo`)}
              </InputGroup>

              {/* Especialidade */}
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Especialidade</Label>
                <Select {...register(`atuacao.atividadesPesquisa.${index}.especialidade`)}>
                  <option value="">Escolha</option>
                  <option value="Pneumologia">Pneumologia</option>
                  <option value="Cardiologia">Cardiologia</option>
                </Select>
                {getError(`atividadesPesquisa.${index}.especialidade`)}
              </InputGroup>

              {/* Ano */}
              <InputGroup style={{ flex: '0 1 100px' }}>
                <Label>Ano</Label>
                <Input 
                  {...register(`atuacao.atividadesPesquisa.${index}.ano`)}
                  placeholder="Digite o ano"
                />
                {getError(`atividadesPesquisa.${index}.ano`)}
              </InputGroup>
            </FormRow>
          </RepetibleSection>
        ))}
        <AddButton 
          type="button" 
          onClick={() => appendAtividade({ 
            codigoPrefixo: '', codigoNumeracao: '', titulo: '', tipo: '', especialidade: '', ano: '' 
          })}
        >
          Adicionar outra atividade
        </AddButton>
      </FormSection>

      {/* SEÇÃO ESPECIALIDADES DA SAÚDE                */}
      <FormSection>
        <SectionTitle>Especialidades da Saúde</SectionTitle>
        <Label>Especialidades/áreas de pesquisas realizadas ou em andamento (Portaria CME nº 1/2024)</Label>
        
        <SubSectionTitle>Especialidades da Saúde</SubSectionTitle>
        <CheckboxGrid>
          {especialidadesSaude.map((esp) => (
            <CheckboxItem key={esp}>
              <CheckboxInput
                type="checkbox"
                value={esp}
                {...register('atuacao.especialidadesSaude')}
              />
              <CheckboxLabel>{esp}</CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGrid>
        
        <SubSectionTitle>Outras Especialidades</SubSectionTitle>
        <CheckboxGrid>
          {outrasEspecialidades.map((esp) => (
            <CheckboxItem key={esp}>
              <CheckboxInput
                type="checkbox"
                value={esp}
                {...register('atuacao.outrasEspecialidades')}
              />
              <CheckboxLabel>{esp}</CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGrid>
        {getError('especialidadesSaude')}
      </FormSection>

      <ButtonRow>
        <Button type="button" onClick={() => router.back()} $variant="secondary">
          Anterior
        </Button>
        <Link href="/infraestrutura">
          <Button type="submit">
            Avançar
          </Button>
        </Link>
      </ButtonRow>
    </FormContainer>
  );
}