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
  FormGrid,
  Button,
  FormSection,
  InputGroup,
  Label,
  Input,
  Select,
  ErrorText,
  FormRow,
  FileUploadBox,
  UploadButton, // Mantido para o "Documento de Criação", mas você pode trocar se quiser
  FieldArrayRow,
  AddButton,
  RemoveButton,
  ColorAddressComponent,
} from './styled';

// Extrai a "fatia" do schema para esta página
type StepData = Pick<FormData, 'identificacaoInstitucional'>;
const stepSchema = formSchema.pick({ identificacaoInstitucional: true });

// --- Helper para gerar o seletor de anos ---
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  // Começa em 1900 (ou ajuste se necessário)
  const startYear = 1900;
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};
// ---

export default function IdentificacaoPage() {
  const router = useRouter();
  const { state, dispatch } = useFormState();
  const availableYears = generateYearOptions(); // Gera a lista de anos

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      identificacaoInstitucional: state.identificacaoInstitucional,
    },
  });

  // Hook para E-mails do Centro
  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'identificacaoInstitucional.centro.emails',
  });

  // Hook para Telefones do Centro
  const {
    fields: telefoneFields,
    append: appendTelefone,
    remove: removeTelefone,
  } = useFieldArray({
    control,
    name: 'identificacaoInstitucional.centro.telefones',
  });

  // Hook para Mídias Sociais do Centro
  const {
    fields: midiaFields,
    append: appendMidia,
    remove: removeMidia,
  } = useFieldArray({
    control,
    name: 'identificacaoInstitucional.centro.midiasSociais',
  });

  // ATUALIZADO: Removido o useFieldArray para emailVinculacaoFields

  const onSubmit = (data: StepData) => {
    // Limpa campos vazios de arrays opcionais antes de enviar
    // (Boa prática para não salvar telefones/mídias vazios)
    data.identificacaoInstitucional.centro.telefones =
      data.identificacaoInstitucional.centro.telefones?.filter((t) => t.value);
    data.identificacaoInstitucional.centro.midiasSociais =
      data.identificacaoInstitucional.centro.midiasSociais?.filter((m) => m.url);

    dispatch({ type: 'UPDATE_FORM', payload: data });
    router.push('/pessoal'); // Navega para o próximo passo
  };

  const getError = (path: string) => {
    const keys = path.split('.');
    let error: any = errors;
    for (const key of keys) {
      error = error ? error[key] : undefined;
      // Ajuste para lidar com mensagens de erro em arrays
      if (!error && keys.includes('midiasSociais') && errors.identificacaoInstitucional?.centro?.midiasSociais) {
        error = errors.identificacaoInstitucional.centro.midiasSociais[key as any];
      }
       if (key.match(/^\d+$/)) { 
         // Tenta pegar o erro do objeto (ex: url) ou da raiz do item (ex: value)
         error = error ? (error.value || error.url || error.tipo) : undefined;
       }
    }
    // Mensagem de erro global do array (ex: "Máximo de 2")
    const arrayError = errors.identificacaoInstitucional?.centro?.[keys[0] as 'telefones' | 'midiasSociais']?.message;
    
    if (error?.message) return <ErrorText>{error.message}</ErrorText>;
    if (arrayError && !path.includes('.')) return <ErrorText>{arrayError}</ErrorText>;
    return null;
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Stepper currentStep={1} />

      {/* ============================================= */}
      {/* SEÇÃO CENTRO                                */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Centro</SectionTitle>

        <InputGroup>
          <Label>Razão Social ou nome fantasia do CPEC</Label>
          <Input
            {...register('identificacaoInstitucional.centro.razaoSocial')}
            placeholder="Preencha a razão social"
          />
          {getError('identificacaoInstitucional.centro.razaoSocial')}
        </InputGroup>

        <InputGroup>
          <Label>Nome do CPEC (Nome de registro)</Label>
          <Input
            {...register('identificacaoInstitucional.centro.nomeCpec')}
            placeholder="Preencha nome do CPEC"
          />
          {getError('identificacaoInstitucional.centro.nomeCpec')}
        </InputGroup>

        {/* ATUALIZADO: Trocado Upload por Link */}
        <FileUploadBox>
          <InputGroup>
            <Label>Número do CNPJ do CPEC ou da instituição a qual está vinculado</Label>
            <Input
              {...register('identificacaoInstitucional.centro.cnpj')}
              placeholder="Preencha CNPJ"
            />
            {getError('identificacaoInstitucional.centro.cnpj')}
          </InputGroup>
          <InputGroup>
            <Label>Link do documento comprobatório (URL)</Label>
            <Input
              type="text"
              {...register('identificacaoInstitucional.centro.documentoCnpj')}
              placeholder="https://... (link para o documento)"
            />
            {getError('identificacaoInstitucional.centro.documentoCnpj')}
          </InputGroup>
        </FileUploadBox>

        <InputGroup>
          <Label>
            Número do cadastro nacional de estabelecimentos de saúde (CNES) do CPEC ou da instituição a qual está vinculado
          </Label>
          <Input
            {...register('identificacaoInstitucional.centro.cnes')}
            placeholder="Preencha CNES"
          />
          {getError('identificacaoInstitucional.centro.cnes')}
        </InputGroup>

        {/* Endereço do Centro */}
        <FormSection>
          <ColorAddressComponent>
            <Label as="h3" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Endereço do CPEC</Label>
            <FormRow>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>CEP</Label>
                <Input
                  {...register('identificacaoInstitucional.centro.endereco.cep')}
                  placeholder="Preencha CEP"
                />
                {getError('identificacaoInstitucional.centro.endereco.cep')}
              </InputGroup>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Tipo de logradouro</Label>
                <Select {...register('identificacaoInstitucional.centro.endereco.tipoLogradouro')}>
                  <option value="">Escolha</option>
                  <option value="Rua">Rua</option>
                  <option value="Avenida">Avenida</option>
                  <option value="Praça">Praça</option>
                </Select>
              </InputGroup>
            </FormRow>
            <InputGroup>
              <Label>Endereço</Label>
              <Input
                {...register('identificacaoInstitucional.centro.endereco.logradouro')}
                placeholder="Preencha Endereço"
              />
              {getError('identificacaoInstitucional.centro.endereco.logradouro')}
            </InputGroup>
            <FormRow>
              <InputGroup style={{ flex: '1 1 100px' }}>
                <Label>Número</Label>
                <Input
                  {...register('identificacaoInstitucional.centro.endereco.numero')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.centro.endereco.numero')}
              </InputGroup>
              <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Complemento</Label>
                <Input
                  {...register('identificacaoInstitucional.centro.endereco.complemento')}
                  placeholder="Preencha"
                />
              </InputGroup>
            </FormRow>
            <FormRow>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Bairro/Distrito</Label>
                <Input
                  {...register('identificacaoInstitucional.centro.endereco.bairro')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.centro.endereco.bairro')}
              </InputGroup>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Município</Label>
                <Input
                  {...register('identificacaoInstitucional.centro.endereco.municipio')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.centro.endereco.municipio')}
              </InputGroup>
              <InputGroup style={{ flex: '0 0 80px' }}>
                <Label>UF</Label>
                <Select {...register('identificacaoInstitucional.centro.endereco.uf')}>
                  <option value="">UF</option>
                  <option value="RJ">RJ</option>
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                </Select>
                {getError('identificacaoInstitucional.centro.endereco.uf')}
              </InputGroup>
            </FormRow>
          </ColorAddressComponent>
        </FormSection>

        {/* E-mails do Centro (Repetível) */}
        <InputGroup>
          <Label>E-mail(s) institucional(is) do CPEC</Label>
          {emailFields.map((field, index) => (
            <FieldArrayRow key={field.id}>
              <Input
                {...register(`identificacaoInstitucional.centro.emails.${index}.value`)}
                placeholder="email@exemplo.com"
              />
              {emailFields.length > 1 && (
                <RemoveButton type="button" onClick={() => removeEmail(index)}>
                  Remover
                </RemoveButton>
              )}
            </FieldArrayRow>
          ))}
          {getError(`identificacaoInstitucional.centro.emails`)}
          <AddButton type="button" onClick={() => appendEmail({ value: '' })}>
            Adicionar outro e-mail
          </AddButton>
        </InputGroup>

        {/* ATUALIZADO: Telefones do Centro (Máx 2) */}
        <InputGroup>
          <Label>Telefone(s) institucional(is) do CPEC (Máximo 2)</Label>
          {telefoneFields.map((field, index) => (
            <FieldArrayRow key={field.id}>
              <Input
                {...register(`identificacaoInstitucional.centro.telefones.${index}.value`)}
                placeholder="(00) 00000-0000"
              />
              <RemoveButton type="button" onClick={() => removeTelefone(index)}>
                Remover
              </RemoveButton>
            </FieldArrayRow>
          ))}
          {/* Mostra o erro geral do array, ex: "Máximo de 2 telefones" */}
          {getError('identificacaoInstitucional.centro.telefones')}
          {/* Oculta o botão se o limite for atingido */}
          {telefoneFields.length < 2 && (
            <AddButton type="button" onClick={() => appendTelefone({ value: '' })}>
              Adicionar outro telefone
            </AddButton>
          )}
        </InputGroup>

        <InputGroup>
          <Label>Website do CPEC</Label>
          <Input
            {...register('identificacaoInstitucional.centro.website')}
            placeholder="Preencha com o endereço do site"
          />
          {getError('identificacaoInstitucional.centro.website')}
        </InputGroup>

        {/* ATUALIZADO: Mídias Sociais (Máx 3 e tipos específicos) */}
        <InputGroup>
          <Label>Mídias sociais (Máximo 3)</Label>
          {midiaFields.map((field, index) => (
            <FieldArrayRow key={field.id}>
              <Select {...register(`identificacaoInstitucional.centro.midiasSociais.${index}.tipo`)}>
                <option value="">Escolha o tipo</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
              </Select>
              <Input
                {...register(`identificacaoInstitucional.centro.midiasSociais.${index}.url`)}
                placeholder="https://..."
              />
              <RemoveButton type="button" onClick={() => removeMidia(index)}>
                Remover
              </RemoveButton>
            </FieldArrayRow>
          ))}
          {/* Mostra o erro geral do array, ex: "Máximo de 3 mídias" */}
          {getError('identificacaoInstitucional.centro.midiasSociais')}
          {/* Oculta o botão se o limite for atingido */}
          {midiaFields.length < 3 && (
            <AddButton type="button" onClick={() => appendMidia({ tipo: 'linkedin', url: '' })}>
              Adicionar outra mídia
            </AddButton>
          )}
        </InputGroup>

        <FormRow>
          <InputGroup>
            <Label>Link do Documento de criação do CPEC (URL)</Label>
            {/* ATUALIZADO: Trocado para Input de texto */}
            <Input
              type="text"
              {...register('identificacaoInstitucional.centro.documentoCriacao')}
              placeholder="https://... (link para o documento)"
            />
            {getError('identificacaoInstitucional.centro.documentoCriacao')}
          </InputGroup>
          {/* ATUALIZADO: Seletor de ano dinâmico */}
          <InputGroup>
            <Label>Ano de fundação</Label>
            <Select {...register('identificacaoInstitucional.centro.anoFundacao')}>
              <option value="">Selecione o ano</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            {getError('identificacaoInstitucional.centro.anoFundacao')}
          </InputGroup>
        </FormRow>
      </FormSection>

      {/* ============================================= */}
      {/* SEÇÃO VINCULAÇÃO                           */}
      {/* ============================================= */}
      <FormSection>
        <SectionTitle>Vinculação</SectionTitle>

        <InputGroup>
          <Label>Comitê de Ética em Pesquisa ao qual o CPEC está vinculado</Label>
          <Input
            {...register('identificacaoInstitucional.vinculacao.comiteEtica')}
            placeholder="Preencha Comitê de Ética em Pesquisa"
          />
          {getError('identificacaoInstitucional.vinculacao.comiteEtica')}
        </InputGroup>

        <InputGroup>
          <Label>Nome da instituição à qual o CPEC está vinculado</Label>
          <Input
            {...register('identificacaoInstitucional.vinculacao.nomeInstituicao')}
            placeholder="Preencha nome da instituição"
          />
          {getError('identificacaoInstitucional.vinculacao.nomeInstituicao')}
        </InputGroup>

        {/* ATUALIZADO: Trocado Upload por Link */}
        <FileUploadBox>
          <InputGroup>
            <Label>Número do CNPJ da instituição à qual o CPEC está vinculado</Label>
            <Input
              {...register('identificacaoInstitucional.vinculacao.cnpjInstituicao')}
              placeholder="Preencha CNPJ"
            />
            {getError('identificacaoInstitucional.vinculacao.cnpjInstituicao')}
          </InputGroup>
          <InputGroup>
            <Label>Link do documento comprobatório (URL)</Label>
            <Input
              type="text"
              {...register('identificacaoInstitucional.vinculacao.documentoCnpjInstituicao')}
              placeholder="https://... (link para o documento)"
            />
            {getError('identificacaoInstitucional.vinculacao.documentoCnpjInstituicao')}
          </InputGroup>
        </FileUploadBox>

        <InputGroup>
          <Label>
            Número do cadastro nacional de estabelecimentos de saúde (CNES) do CPEC ou da instituição a qual está vinculado
          </Label>
          <Input
            {...register('identificacaoInstitucional.vinculacao.cnesInstituicao')}
            placeholder="Preencha CNES"
          />
          {getError('identificacaoInstitucional.vinculacao.cnesInstituicao')}
        </InputGroup>

        {/* Endereço da Vinculação */}
        <FormSection>
          <ColorAddressComponent>
            <Label as="h3" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Endereço da instituição ao qual o CPEC está vinculado</Label>
            <FormRow>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>CEP</Label>
                <Input
                  {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.cep')}
                  placeholder="Preencha CEP"
                />
                {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.cep')}
              </InputGroup>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Tipo de logradouro</Label>
                <Select {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.tipoLogradouro')}>
                  <option value="">Escolha</option>
                  <option value="Rua">Rua</option>
                  <option value="Avenida">Avenida</option>
                  <option value="Praça">Praça</option>
                  <option value="Praça">Rodovia</option>
                  <option value="Praça">Estrada</option>
                  <option value="Praça">Travessa</option>
                  <option value="Praça">Alameda</option>
                </Select>
              </InputGroup>
            </FormRow>
            <InputGroup>
              <Label>Endereço</Label>
              <Input
                {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.logradouro')}
                placeholder="Preencha Endereço"
              />
              {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.logradouro')}
            </InputGroup>
            <FormRow>
              <InputGroup style={{ flex: '1 1 100px' }}>
                <Label>Número</Label>
                <Input
                  {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.numero')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.numero')}
              </InputGroup>
              <InputGroup style={{ flex: '2 1 200px' }}>
                <Label>Complemento</Label>
                <Input
                  {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.complemento')}
                  placeholder="Preencha"
                />
              </InputGroup>
            </FormRow>
            <FormRow>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Bairro/Distrito</Label>
                <Input
                  {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.bairro')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.bairro')}
              </InputGroup>
              <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>Município</Label>
                <Input
                  {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.municipio')}
                  placeholder="Preencha"
                />
                {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.municipio')}
              </InputGroup>
              <InputGroup style={{ flex: '0 0 80px' }}>
                <Label>UF</Label>
                <Select {...register('identificacaoInstitucional.vinculacao.enderecoInstituicao.uf')}>
                  <option value="">UF</option>
                  <option value="RJ">RJ</option>
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                </Select>
                {getError('identificacaoInstitucional.vinculacao.enderecoInstituicao.uf')}
              </InputGroup>
            </FormRow>
          </ColorAddressComponent>
        </FormSection>

        <InputGroup>
          <Label>E-mail do órgão máximo da instituição ao qual está vinculado</Label>
          <Input
            {...register('identificacaoInstitucional.vinculacao.emailInstituicao')}
            placeholder="email@exemplo.com"
          />
          {getError('identificacaoInstitucional.vinculacao.emailInstituicao')}
        </InputGroup>

      </FormSection>

      {/* Botão de Avançar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Link href="/pessoal">
          <Button type="submit">Avançar</Button>
        </Link>
      </div>
    </FormContainer>
  );
}