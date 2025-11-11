// src/app/(auth)/page.tsx
'use client';

import React from 'react';
import Footer from "@/components/HomeComponents/footer";
import TopHomePage from '@/components/AuthComponents/researchCenter'

// Importa os novos estilos
import * as hp from "./styled";


export default function Home() {
  return (
    <hp.PageContainer>
      <TopHomePage />
      <Footer/>
    </hp.PageContainer>
  );
}



/*
 ANTIGA HOME PAGE

 return (
    <hp.Container>
      <CardsSection />
      
      <hp.AlignItens>
        <InputSection />
        <hp.NumberInputSection>
          <TotalTrialsCard />
          <LoginForm />
        </hp.NumberInputSection>
        
        
        <hp.InformationSection>
          <hp.LeftSection>
            <Avisos />
          </hp.LeftSection>
          
          <hp.RightSection>
            <ClinicalTrials />
            <NewsCard />
          </hp.RightSection>
        </hp.InformationSection>
        
      </hp.AlignItens>
     <Footer/>
    </hp.Container>
  );

*/