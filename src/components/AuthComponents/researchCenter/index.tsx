'use client';

import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa'; // Importando o ícone
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CardConsults from '@/components/HomeComponents/consults'
import Footer from '@/components/HomeComponents/footer';

// Importando os componentes estilizados
import {
  PageWrapper,
  Banner,
  BannerTitle,
  ContentArea,
  TextBlock,
  FormsSection,
  PrimeiroAcessoCard,
  CardTitle,
  RegisterButton,
  LoginFormCard,
  Input,
  ForgotPasswordLink,
  FlexRow,
  FlexColumn,
} from './styled';

// Importando o texto do arquivo de conteúdo
import { descriptionText } from './content';
// import { Ca } from 'zod/v4/locales';

// Reutilizamos o componente de Login que já existe ou o criamos aqui
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento (se fosse um form)
    if (username) {
      login(username); // Chama a função de login com o nome
      router.push("/dashboard"); // Redireciona para o dashboard
    } else {
      alert("Por favor, insira um nome de usuário.");
    }
  };
  
  return(
        <LoginFormCard as="form" onSubmit={handleLogin}>
          <CardTitle>Já tem cadastro?</CardTitle>
          <Input 
            type="text" 
            placeholder="Nome de usuário" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ForgotPasswordLink href="#">Esqueci a senha</ForgotPasswordLink>
          <RegisterButton style={{ alignSelf: 'flex-start' }} type="submit">
              Entrar <FaArrowRight />
          </RegisterButton>
        </LoginFormCard>
  )
}

const CentroPesquisaPage: React.FC = () => {
  const router = useRouter();

  return (
    <PageWrapper>
      <Banner>
        <BannerTitle>Centro de Pesquisa</BannerTitle>
      </Banner>

      <ContentArea>
        <TextBlock>{descriptionText}</TextBlock>
        
        <FormsSection>
          {/* ROW */}
          <FlexRow>
            <CardConsults />
          
          {/* Column */}
            <FlexColumn>
              <PrimeiroAcessoCard>
                <CardTitle>Quer cadastrar um Centro de Pesquisa em nossa base?</CardTitle>
                <RegisterButton onClick={() => router.push("/register")}>
                  Cadastre <FaArrowRight />
                </RegisterButton>
              </PrimeiroAcessoCard>
              <LoginForm />
            </FlexColumn>
          </FlexRow>

        </FormsSection>
      </ContentArea>
      <Footer />
    </PageWrapper>
  );
};

export default CentroPesquisaPage;