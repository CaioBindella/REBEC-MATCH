'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useEffect } from 'react';

// Importa estilos (a serem criados, reutilizando os existentes)
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
  ButtonRow,
} from './styled';

// --- Schema de Validação com Zod para o formulário de usuário ---
const userRegistrationSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string(),
  cep: z.string().length(8, 'O CEP deve ter 8 dígitos'),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero_rua: z.string().min(1, 'Número é obrigatório'),
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'], // Onde o erro será exibido
});

type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
// ---

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
  });

  // Observa o campo CEP para preenchimento automático
  const cepValue = watch('cep');

  // Efeito para buscar o endereço quando o CEP tiver 8 dígitos
  useEffect(() => {
    if (cepValue && cepValue.length === 8) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
          if (!response.ok) throw new Error('CEP não encontrado');
          
          const data = await response.json();
          if (data.erro) {
            console.error('CEP não encontrado na base do ViaCEP');
            return;
          }
          
          // Preenche o campo 'rua' com o logradouro retornado
          setValue('rua', data.logradouro, { shouldValidate: true });

        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      };
      fetchAddress();
    }
  }, [cepValue, setValue]);

  const onSubmit = (data: UserRegistrationData) => {
    // Aqui você faria a chamada para sua API para registrar o usuário
    console.log("Dados do novo usuário:", data);
    alert('Cadastro realizado com sucesso! (Simulação)');
    router.push('/loginPage'); // Redireciona para a página de login
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <SectionTitle>Cadastro de Novo Usuário</SectionTitle>

      {/* --- Seção de Dados Pessoais --- */}
      <FormSection>
        <FormRow>
          <InputGroup>
            <Label>Nome</Label>
            <Input {...register('nome')} placeholder="Seu nome" />
            {errors.nome && <ErrorText>{errors.nome.message}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Sobrenome</Label>
            <Input {...register('sobrenome')} placeholder="Seu sobrenome" />
            {errors.sobrenome && <ErrorText>{errors.sobrenome.message}</ErrorText>}
          </InputGroup>
        </FormRow>
        <InputGroup>
          <Label>E-mail</Label>
          <Input {...register('email')} type="email" placeholder="email@exemplo.com" />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </InputGroup>
        <FormRow>
          <InputGroup>
            <Label>Senha</Label>
            <Input {...register('senha')} type="password" placeholder="Mínimo 6 caracteres" />
            {errors.senha && <ErrorText>{errors.senha.message}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Confirmar Senha</Label>
            <Input {...register('confirmarSenha')} type="password" placeholder="Repita a senha" />
            {errors.confirmarSenha && <ErrorText>{errors.confirmarSenha.message}</ErrorText>}
          </InputGroup>
        </FormRow>
      </FormSection>

      {/* --- Seção de Endereço --- */}
      <FormSection>
        <SectionTitle style={{fontSize: '1.2rem', border: 'none', paddingBottom: 0}}>Endereço</SectionTitle>
        <FormRow>
            <InputGroup style={{ flex: '1 1 150px' }}>
                <Label>CEP</Label>
                <Input {...register('cep')} placeholder="Apenas números" maxLength={8} />
                {errors.cep && <ErrorText>{errors.cep.message}</ErrorText>}
            </InputGroup>
        </FormRow>
        <FormRow>
            <InputGroup style={{ flex: '3 1 300px' }}>
                <Label>Rua</Label>
                <Input {...register('rua')} placeholder="Sua rua" />
                {errors.rua && <ErrorText>{errors.rua.message}</ErrorText>}
            </InputGroup>
            <InputGroup style={{ flex: '1 1 100px' }}>
                <Label>Número</Label>
                <Input {...register('numero_rua')} placeholder="Nº" />
                {errors.numero_rua && <ErrorText>{errors.numero_rua.message}</ErrorText>}
            </InputGroup>
        </FormRow>
      </FormSection>

      {/* --- Botão de Envio --- */}
      <ButtonRow style={{justifyContent: 'flex-end'}}>
        <Button type="submit">
          Cadastrar
        </Button>
      </ButtonRow>
    </FormContainer>
  );
}