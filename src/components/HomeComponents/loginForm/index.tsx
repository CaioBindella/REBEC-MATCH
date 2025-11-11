'use client';

import { useState } from 'react';
import * as S from './styled';

// Ícones da biblioteca react-icons
// Instale com: npm install react-icons
import { BsEye, BsEyeSlash, BsArrowRight } from 'react-icons/bs';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    alert(`Usuário: ${username}\nSenha: ${password}`);
    // Aqui você adicionaria a lógica de autenticação real
  };

  return (
    <S.PageContainer>
      <S.FormContainer>
        <S.Title>Acesso</S.Title>
        <S.StyledForm onSubmit={handleLogin}>
          
          <S.InputGroup>
            <S.Input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.PasswordWrapper>
              <S.Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <S.PasswordToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </S.PasswordToggleButton>
            </S.PasswordWrapper>
          </S.InputGroup>

          <S.ActionsContainer>
            <S.ForgotPasswordLink href="#">
              Esqueci a senha
            </S.ForgotPasswordLink>
            <S.LoginButton type="submit">
              Entrar
              <BsArrowRight />
            </S.LoginButton>
          </S.ActionsContainer>

        </S.StyledForm>
      </S.FormContainer>
    </S.PageContainer>
  );
}