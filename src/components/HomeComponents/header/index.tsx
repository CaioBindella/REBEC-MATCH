// src/components/HomeComponents/header/index.tsx
"use client";
import React, { useState, useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';

import { 
  HeaderWrapper, 
  RightSection, 
  AccessButton, 
  ButtonText,
  UserInfo,
  LogoutButton,
} from './styled';

import { useAuth } from '@/contexts/AuthContext';

// ... (useOutsideClick import, se estiver usando) ...

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <HeaderWrapper>
      
      <Link href="/" passHref>
        <Image 
          src="/LogoRebec.png" 
          alt="Logo do Rebec" 
          width={200} 
          height={50} 
        />
      </Link>
      
      <RightSection>
        
        {user ? (
          // Se o usuário ESTIVER logado
          <>
            <UserInfo>Olá, {user.nome}</UserInfo>
            <LogoutButton onClick={logout}>Sair</LogoutButton>
          </>
        ) : (
          // Se o usuário NÃO ESTIVER logado
          <Link href="/" passHref>
            <AccessButton>
              <Image src="/AcesseLogo.svg" alt="Ícone de acesso" width={20} height={20}/>
              <ButtonText>Acesse</ButtonText>
            </AccessButton>
          </Link>
        )}

      </RightSection>
    </HeaderWrapper>
  );
};

export default Header;