'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/contexts/FormContext';
import { formSchema, FormData } from '@/lib/schema';
import Link from 'next/link';
import Stepper from '@/components/FormComponents/forms/Stepper';

// Importa os novos estilos
import {
  FormContainer,
  SectionTitle,
  Button,
  FormSection,
  InputGroup,
  Label,
  Input,
  ErrorText,
  FormRow,
  AddButton,
  RemoveButton,
  ButtonRow,
  RepetibleSection,
  AvisoBox,
  AvisoTitle,
  AvisoText,
} from './styled'; // Importando do seu arquivo de estilos

// ATUALIZADO: A página agora controla 'pessoal' E 'equipe'
type StepData = Pick<FormData, 'pessoal' | 'equipe'>;
const stepSchema = formSchema.pick({ pessoal: true, equipe: true });

export default function PessoalPage() {
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
      pessoal: state.pessoal, // Carrega do contexto
      equipe: state.equipe,   // Carrega do contexto
    },
  });

  // Hook para Equipe (Mantido)
  const {
    fields: equipeFields,
    append: appendEquipe,
    remove: removeEquipe,
  } = useFieldArray({
    control,
    name: 'equipe', // ATUALIZADO: Caminho agora é 'equipe'
  });

  const onSubmit = (data: StepData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    router.push('/atuacao'); // Navega para o próximo passo
  };

  // ATUALIZADO: Helper de erro para lidar com 'pessoal' e 'equipe'
  const getError = (fieldName: string) => {
    let error: any = errors;
    const keys = fieldName.split('.');
    
    // Verifica se o erro está em 'pessoal' ou 'equipe'
    const topLevelKey = keys[0] as 'pessoal' | 'equipe';
    if (!errors[topLevelKey]) return null;

    error = errors;
    for (const key of keys) {
      if (!error) break;
      error = error[key];
    }
    
    const message = error?.message || error?.root?.message;
    return message && <ErrorText>{message}</ErrorText>;
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Stepper currentStep={2} />

      {/* SEÇÃO DIREÇÃO CLÍNICA/GESTÃO (Dados de `pessoal`) */}
      <FormSection>
        <SectionTitle>Direção Clínica/Gestão</SectionTitle>
        <Label as="h3" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          Profissional responsável pelo CPEC
        </Label>
        
        <FormRow>
          <InputGroup style={{ flex: 1 }}>
            <Label>Nome completo do profissional</Label>
            <Input
              {...register('pessoal.direcaoClinica.nome')}
              placeholder="Preencha nome do profissional"
            />
            {getError('pessoal.direcaoClinica.nome')}
          </InputGroup>
          <InputGroup style={{ flex: 1 }}>
            <Label>Link do Currículo Lattes</Label>
            <Input
              {...register('pessoal.direcaoClinica.lattes')}
              placeholder="Envie link do Lattes"
            />
            {getError('pessoal.direcaoClinica.lattes')}
          </InputGroup>
        </FormRow>
        
        <FormRow>
          <InputGroup style={{ flex: 1 }}>
            <Label>Documentação comprobatória (Link)</Label>
            <Input
              {...register('pessoal.direcaoClinica.documento')}
              placeholder="Envie link do documento com tamanho máximo 2MB"
            />
            {getError('pessoal.direcaoClinica.documento')}
          </InputGroup>
          <AvisoBox style={{ flex: 1 }}>
            <AvisoTitle>Aviso sobre Documentação comprobatória</AvisoTitle>
            <AvisoText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque posuere sem at metus venenatis tincidunt. Fusce at sapien elit.
            </AvisoText>
          </AvisoBox>
        </FormRow>
      </FormSection>

      {/* SEÇÃO REPRESENTANTE LEGAL (Dados de `pessoal`) */}
      <FormSection>
        <Label as="h3" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          Representante legal da instituição à qual o CPEC está vinculado
        </Label>

        <FormRow>
          <InputGroup style={{ flex: 1 }}>
            <Label>Nome completo do profissional</Label>
            <Input
              {...register('pessoal.representanteLegal.nome')}
              placeholder="Preencha nome do representante"
            />
            {getError('pessoal.representanteLegal.nome')}
          </InputGroup>
          <InputGroup style={{ flex: 1 }}>
            <Label>Link do Currículo Lattes</Label>
            <Input
              {...register('pessoal.representanteLegal.lattes')}
              placeholder="Envie link do Lattes"
            />
            {getError('pessoal.representanteLegal.lattes')}
          </InputGroup>
        </FormRow>
        
        <FormRow>
          <InputGroup style={{ flex: 1 }}>
            <Label>Documentação comprobatória (Link)</Label>
            <Input
              {...register('pessoal.representanteLegal.documento')}
              placeholder="Envie link do documento com tamanho máximo 2MB"
            />
            {getError('pessoal.representanteLegal.documento')}
          </InputGroup>
          <AvisoBox style={{ flex: 1 }}>
            <AvisoTitle>Aviso sobre Documentação comprobatória</AvisoTitle>
            <AvisoText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque posuere sem at metus venenatis tincidunt. Fusce at sapien elit.
            </AvisoText>
          </AvisoBox>
        </FormRow>
      </FormSection>
      
      {/* SEÇÃO EQUIPE (Dados de `equipe`) */}
      <FormSection>
        <SectionTitle>Equipe</SectionTitle>
        {getError('equipe')} {/* Para erros globais do array, ex: "mínimo de 1" */}
        
        {equipeFields.map((field, index) => (
           <RepetibleSection key={field.id}>
            {equipeFields.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RemoveButton type="button" onClick={() => removeEquipe(index)}>
                  Remover Profissional
                </RemoveButton>
              </div>
            )}
            <FormRow>
               <InputGroup style={{ flex: '1 1 200px' }}>
                <Label>Nome completo do profissional</Label>
                <Input
                  {...register(`equipe.${index}.nome`)} // ATUALIZADO
                  placeholder="Preencha nome"
                />
                {getError(`equipe.${index}.nome`)}
              </InputGroup>
              <InputGroup style={{ flex: '1 1 200px' }}>
                <Label>Formação profissional</Label>
                <Input
                  {...register(`equipe.${index}.formacao`)} // ATUALIZADO
                  placeholder="Preencha formação"
                />
                {getError(`equipe.${index}.formacao`)}
              </InputGroup>
               <InputGroup style={{ flex: '1 1 200px' }}>
                <Label>Função CPEC</Label>
                <Input
                  {...register(`equipe.${index}.funcao`)} // ATUALIZADO
                  placeholder="Preencha função"
                />
                {getError(`equipe.${index}.funcao`)}
              </InputGroup>
            </FormRow>
            <FormRow>
              <InputGroup style={{ flex: 1 }}>
                <Label>Anexar documento comprobatório (Link)</Label>
                <Input
                  {...register(`equipe.${index}.documento`)} // ATUALIZADO
                  placeholder="Envie link do documento com tamanho máximo 2MB"
                />
                {getError(`equipe.${index}.documento`)}
              </InputGroup>
               <InputGroup style={{ flex: 1 }}>
                <Label>Link do Currículo Lattes</Label>
                <Input
                  {...register(`equipe.${index}.lattes`)} // ATUALIZADO
                  placeholder="Envie link do Lattes"
                />
                {getError(`equipe.${index}.lattes`)}
              </InputGroup>
            </FormRow>
          </RepetibleSection>
        ))}
         <AddButton type="button" onClick={() => appendEquipe({ nome: '', formacao: '', funcao: '', lattes: '', documento: '' })}>
          Adicionar outro profissional
        </AddButton>
      </FormSection>

      {/* Botões de Navegação */}
      <ButtonRow>
        <Button type="button" onClick={() => router.back()} $variant="secondary">
          Anterior
        </Button>
        <Link href="atuacao">
          <Button type="submit">
            Avançar
          </Button>
        </Link>
      </ButtonRow>
    </FormContainer>
  );
}