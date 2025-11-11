// src/app/(auth)/centros/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Footer from "@/components/HomeComponents/footer";
import RegisteredCenterCard from "@/components/HomeComponents/registeredCenterCard"; 
import { FaSearch } from 'react-icons/fa';

// Importa os novos estilos
import * as S from "./styled";

// --- Dados Mock (Exemplo) ---
// Na página "Ver Todos", usamos a lista completa
const todosCentros = [
  { id: 1, nome: "Centro de Pesquisa Clínica Avançada", dataCadastro: "28/10/2025" },
  { id: 2, nome: "Instituto de Oncologia Translacional", dataCadastro: "25/10/2025" },
  { id: 3, nome: "Unidade de Estudos Pediátricos", dataCadastro: "22/10/2025" },
  { id: 4, nome: "Centro Cardiovascular Experimental", dataCadastro: "20/10/2025" },
  { id: 5, nome: "Núcleo de Pesquisa em Doenças Raras", dataCadastro: "19/10/2025" },
  { id: 6, nome: "Instituto de Pesquisa em Saúde Coletiva", dataCadastro: "18/10/2025" },
  { id: 7, nome: "Centro de Estudos em Vacinas (CEV)", dataCadastro: "17/10/2025" },
  { id: 8, nome: "Laboratório de Pesquisa em Neurociências", dataCadastro: "15/10/2025" },
  { id: 9, nome: "Unidade de Pesquisa Dermatológica", dataCadastro: "14/10/2025" },
  { id: 10, nome: "Centro Integrado de Pesquisa (CIP)", dataCadastro: "12/10/2025" },
  { id: 11, nome: "Centro de Pesquisa Oftalmológica", dataCadastro: "11/10/2025" },
  { id: 12, nome: "Instituto de Pesquisa Metabólica", dataCadastro: "10/10/2025" },
];
// --- Fim Dados Mock ---


export default function TodosCentrosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filtra e ordena os centros
  const filteredAndSortedCentros = useMemo(() => {
    // 1. Filtra por nome
    const filtered = todosCentros.filter(centro => 
      centro.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Ordena por data
    const sorted = filtered.sort((a, b) => {
      // Converte a data DD/MM/YYYY para YYYY-MM-DD para comparação correta
      const dateA = new Date(a.dataCadastro.split('/').reverse().join('-'));
      const dateB = new Date(b.dataCadastro.split('/').reverse().join('-'));
      
      if (sortOrder === 'newest') {
        return dateB.getTime() - dateA.getTime(); // Mais novo primeiro
      } else {
        return dateA.getTime() - dateB.getTime(); // Mais antigo primeiro
      }
    });

    return sorted;
  }, [searchTerm, sortOrder]);

  return (
    <S.PageContainer>
      <S.ContentContainer>
        <S.PageTitle>Todos os Centros de Pesquisa</S.PageTitle>

        <S.FilterBar>
          <S.SearchInputWrapper>
            <S.SearchInput 
              placeholder="Pesquise por nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <S.SearchButton>
              <FaSearch />
            </S.SearchButton>
          </S.SearchInputWrapper>

          <S.SortWrapper>
            <S.SortLabel htmlFor="sort-order">Ordenar por:</S.SortLabel>
            <S.SortSelect 
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </S.SortSelect>
          </S.SortWrapper>
        </S.FilterBar>

        <S.CardGrid>
          {filteredAndSortedCentros.length > 0 ? (
            filteredAndSortedCentros.map((centro) => (
              <RegisteredCenterCard
                key={centro.id}
                nome={centro.nome}
                dataCadastro={centro.dataCadastro}
                centroId={centro.id} 
              />
            ))
          ) : (
            <S.NoResultsText>
              Nenhum centro encontrado com os filtros aplicados.
            </S.NoResultsText>
          )}
        </S.CardGrid>

      </S.ContentContainer>
      <Footer/>
    </S.PageContainer>
  );
}