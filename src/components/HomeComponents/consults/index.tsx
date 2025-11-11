import React from 'react';
import Footer from "@/components/HomeComponents/footer";
import RegisteredCenterCard from "@/components/HomeComponents/registeredCenterCard";
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

// Importa os novos estilos
import * as hp from "@/app/(auth)/styled";

// --- Dados Mock (Exemplo) ---
const ultimosCentros = [
  { id: 1, nome: "FAKE - Centro de Pesquisa Clínica Avançada", dataCadastro: "28/10/2025" },
  { id: 2, nome: "FAKE - Instituto de Oncologia Translacional", dataCadastro: "25/10/2025" },
  { id: 3, nome: "Unidade de Estudos Pediátricos", dataCadastro: "22/10/2025" },
  { id: 4, nome: "Centro Cardiovascular Experimental", dataCadastro: "20/10/2025" },
  { id: 5, nome: "Núcleo de Pesquisa em Doenças Raras", dataCadastro: "19/10/2025" },
  { id: 6, nome: "Instituto de Pesquisa em Saúde Coletiva", dataCadastro: "18/10/2025" },
  { id: 7, nome: "Centro de Estudos em Vacinas (CEV)", dataCadastro: "17/10/2025" },
  { id: 8, nome: "Laboratório de Pesquisa em Neurociências", dataCadastro: "15/10/2025" },
  { id: 9, nome: "Unidade de Pesquisa Dermatológica", dataCadastro: "14/10/2025" },
  { id: 10, nome: "Centro Integrado de Pesquisa (CIP)", dataCadastro: "12/10/2025" },
  // Estes dois abaixo não devem aparecer (devido ao .slice(0, 10))
  { id: 11, nome: "Centro de Pesquisa Oftalmológica", dataCadastro: "11/10/2025" },
  { id: 12, nome: "Instituto de Pesquisa Metabólica", dataCadastro: "10/10/2025" },
];

export default function consults() {
 return (
   <div>
    <hp.ConteinerConsults>
      <hp.ContentContainer>
          <hp.Title>Quer consultar os Centros de Pesquisa em nossa base?</hp.Title>
          <hp.SearchSection>
            <hp.SearchInputWrapper>
              <hp.SearchInput placeholder="Pesquise por nome, especialidade ou localização..." />
              <hp.SearchButton>
                <FaSearch />
              </hp.SearchButton>
            </hp.SearchInputWrapper>
          </hp.SearchSection>

          <hp.SubTitle>Centros de Pesquisa cadastrados recentemente</hp.SubTitle>

          <hp.CardGrid>
            {ultimosCentros.slice(0, 2).map((centro) => (
              <RegisteredCenterCard
                key={centro.id}
                nome={centro.nome}
                dataCadastro={centro.dataCadastro}
                centroId={centro.id}
              />
            ))}
          </hp.CardGrid>

          <hp.ViewAllWrapper>
            <Link href="/centros" passHref>
              <hp.ViewAllLink>
                Ver todos os centros
                <FaArrowRight />
              </hp.ViewAllLink>
            </Link>
          </hp.ViewAllWrapper>

        </hp.ContentContainer>
      </hp.ConteinerConsults>
   </div>
 );
}