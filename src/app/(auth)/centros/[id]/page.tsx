// src/app/(auth)/centros/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

// Importa o tipo de dados do nosso formulário
import { FormData } from '@/lib/schema'; 

// Importa os novos estilos
import * as S from './styled';
import Footer from '@/components/HomeComponents/footer';

// --- SIMULAÇÃO DE DADOS ---
// No mundo real, você faria uma chamada de API
// ex: const response = await fetch(`/api/centros/${id}`);
// const data = await response.json();
import { getInitialState } from '@/contexts/FormContext'; // Usaremos a estrutura default

// Esta função simula a busca dos dados no banco
const fetchCentroData = async (id: string): Promise<FormData | null> => {
  console.log(`Buscando dados para o centro ID: ${id}`);
  // Simula um delay de rede
  await new Promise(res => setTimeout(res, 300));

  // Pega a estrutura de dados vazia para garantir que todos os campos existam
  const baseData = getInitialState(); 

  // Simulação: Se o ID for '1', retorna dados preenchidos
  if (id === '1') {
    return {
      ...baseData, // Começa com a estrutura completa
      identificacaoInstitucional: {
        centro: {
          razaoSocial: 'Centro de Pesquisa Clínica Avançada',
          nomeCpec: 'CPCA',
          cnpj: '12.345.678/0001-99',
          documentoCnpj: 'https://link.para/documento.pdf',
          cnes: '1234567',
          endereco: { cep: '22222-000', tipoLogradouro: 'Rua', logradouro: 'Rua da Pesquisa', numero: '100', complemento: 'Sala 101', bairro: 'Centro', municipio: 'Rio de Janeiro', uf: 'RJ' },
          emails: [{ value: 'contato@cpca.com.br' }],
          telefones: [{ value: '(21) 99999-8888' }],
          website: 'https://cpca.com.br',
          midiasSociais: [{ tipo: 'linkedin', url: 'https://linkedin.com/cpca' }],
          documentoCriacao: 'https://link.para/criacao.pdf',
          anoFundacao: '2010',
        },
        vinculacao: {
          comiteEtica: 'CEP Fiocruz',
          nomeInstituicao: 'Fundação Oswaldo Cruz',
          cnpjInstituicao: '98.765.432/0001-00',
          documentoCnpjInstituicao: 'https://link.para/doc-fiocruz.pdf',
          cnesInstituicao: '7654321',
          enderecoInstituicao: { cep: '21040-900', tipoLogradouro: 'Avenida', logradouro: 'Avenida Brasil', numero: '4365', complemento: '', bairro: 'Manguinhos', municipio: 'Rio de Janeiro', uf: 'RJ' },
          emailInstituicao: 'presidencia@fiocruz.br',
        },
      },
      pessoal: {
        direcaoClinica: { nome: 'Dra. Ana Silva', lattes: 'https://lattes.cnpq.br/123', documento: 'https://link.para/doc-ana.pdf' },
        representanteLegal: { nome: 'Dr. Bruno Costa', lattes: 'https://lattes.cnpq.br/456', documento: 'https://link.para/doc-bruno.pdf' },
      },
      equipe: [
        { nome: 'Dr. Carlos Mendes', formacao: 'Farmacêutico', funcao: 'Coordenador de Farmácia', lattes: 'https://lattes.cnpq.br/789', documento: 'https://link.para/doc-carlos.pdf' },
        { nome: 'Enf. Daniela Lima', formacao: 'Enfermeira Chefe', funcao: 'Coordenadora de Enfermagem', lattes: 'https://lattes.cnpq.br/101', documento: 'https://link.para/doc-daniela.pdf' },
      ],
      atuacao: {
        tiposEstudo: ['Estudos de fase II', 'Estudos de fase III', 'Estudos observacionais'],
        atividadesPesquisa: [
          { codigoPrefixo: 'NCT', codigoNumeracao: '123456', titulo: 'Estudo sobre novo tratamento para Diabetes Tipo 2', tipo: 'Intervenção', especialidade: 'Endocrinologia', ano: '2024' }
        ],
        especialidadesSaude: ['Endocrinologia e metabologia', 'Cardiologia'],
        outrasEspecialidades: ['Nutrição'],
      },
      infraestrutura: {
        equipamentos: [{ nome: 'Centrífuga Refrigerada', modelo: 'Modelo X', quantidade: '2' }],
        relacao_orpc: 'nao',
        instalacoes_especificas: 'Possui farmácia de manipulação com capela de fluxo laminar.',
        modelagem_orpc: [{ servico: 'Assuntos Laboratoriais', tipo: 'Oferece' }],
      },
      capacitacaoConformidade: {
        numero_inspecoes_5anos: '3',
        possui_profissionais_regulatorios: 'Sim',
        certificacoesNacionais: [{ nome: 'Certificação A (BR)', link_documento: 'https://link.para/cert-a.pdf' }],
        certificacoesInternacionais: [],
      },
      financiamentoSustentabilidade: {
        orcamentosAnuais: [
          { ano: '2024', orcamento: '1500000', percentual_pesquisa_clinica: '40', percentual_capital: '20', percentual_custeio: '40', percentual_financiamento_privado: '60', percentual_financiamento_publico: '40' }
        ],
        praticasFinanceiras: [{ nome: 'Prática Financeira 1' }],
        praticasAmbientais: [{ nome: 'Prática Ambiental A' }],
        praticasSociais: [],
      },
    };
  }
  return null; // Retorna null se não encontrar
};

// Componente auxiliar para renderizar linhas de dados
const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (!value) return null; // Não renderiza se o valor for nulo ou vazio
  return (
    <S.InfoRow>
      <S.InfoLabel>{label}</S.InfoLabel>
      <S.InfoValue>{value}</S.InfoValue>
    </S.InfoRow>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function CentroDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [centroData, setCentroData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setIsLoading(true);
        const data = await fetchCentroData(id);
        setCentroData(data);
        setIsLoading(false);
      };
      loadData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingText>Carregando dados do centro...</S.LoadingText>
      </S.PageContainer>
    );
  }

  if (!centroData) {
    return (
      <S.PageContainer>
        <S.PageTitle>Centro não encontrado</S.PageTitle>
        <S.BackButton onClick={() => router.push('/centros')}>
          <FaArrowLeft />
          Voltar para a lista
        </S.BackButton>
      </S.PageContainer>
    );
  }

  // Mapeia valores-chave para texto legível
  const mapRelacaoOrpc = (key?: string) => {
    const map: Record<string, string> = {
      sim_sempre: 'Sim, sempre utilizamos serviços ORPC',
      sim_eventualmente: 'Sim, eventualmente utilizamos serviços ORPC',
      nao: 'Não, não utilizamos serviços ORPC',
      atuamos_como: 'Atuamos como ORPC',
    };
    return key ? map[key] : 'Não informado';
  };

  const {
    identificacaoInstitucional: ident,
    pessoal,
    equipe,
    atuacao,
    infraestrutura,
    capacitacaoConformidade: cap,
    financiamentoSustentabilidade: fin,
  } = centroData;

  return (
    <>
      <S.PageContainer>
        <S.BackButton onClick={() => router.push('/centros')}>
          <FaArrowLeft />
          Voltar para a lista
        </S.BackButton>

        <S.PageTitle>{ident.centro.razaoSocial}</S.PageTitle>

        {/* ============================================= */}
        {/* SEÇÃO IDENTIFICAÇÃO INSTITUCIONAL            */}
        {/* ============================================= */}
        <S.Section>
          <S.SectionTitle>Identificação Institucional</S.SectionTitle>
          
          <S.SubSectionTitle>Centro</S.SubSectionTitle>
          <InfoRow label="Nome CPEC" value={ident.centro.nomeCpec} />
          <InfoRow label="CNPJ" value={ident.centro.cnpj} />
          <InfoRow label="CNES" value={ident.centro.cnes} />
          <InfoRow label="Website" value={ident.centro.website} />
          <InfoRow label="Ano de Fundação" value={ident.centro.anoFundacao} />
          <InfoRow label="E-mails" value={ident.centro.emails.map(e => e.value).join(', ')} />
          <InfoRow label="Telefones" value={ident.centro.telefones?.map(t => t.value).join(', ')} />
          <S.SubSectionTitle as="h4">Endereço do Centro</S.SubSectionTitle>
          <InfoRow label="Endereço" value={`${ident.centro.endereco.logradouro}, ${ident.centro.endereco.numero} ${ident.centro.endereco.complemento || ''}`} />
          <InfoRow label="Bairro/CEP" value={`${ident.centro.endereco.bairro} - CEP: ${ident.centro.endereco.cep}`} />
          <InfoRow label="Município/UF" value={`${ident.centro.endereco.municipio} / ${ident.centro.endereco.uf}`} />

          <S.SubSectionTitle>Vinculação</S.SubSectionTitle>
          <InfoRow label="Comitê de Ética" value={ident.vinculacao.comiteEtica} />
          <InfoRow label="Instituição Vinculada" value={ident.vinculacao.nomeInstituicao} />
          <InfoRow label="CNPJ Instituição" value={ident.vinculacao.cnpjInstituicao} />
          <InfoRow label="E-mail Instituição" value={ident.vinculacao.emailInstituicao} />
        </S.Section>

        {/* ============================================= */}
        {/* SEÇÃO PESSOAL                                */}
        {/* ============================================= */}
        <S.Section>
          <S.SectionTitle>Pessoal</S.SectionTitle>
          
          <S.SubSectionTitle>Direção Clínica/Gestão</S.SubSectionTitle>
          <InfoRow label="Responsável" value={pessoal.direcaoClinica.nome} />
          <InfoRow label="Lattes" value={pessoal.direcaoClinica.lattes} />

          <S.SubSectionTitle>Representante Legal</S.SubSectionTitle>
          <InfoRow label="Nome" value={pessoal.representanteLegal.nome} />
          <InfoRow label="Lattes" value={pessoal.representanteLegal.lattes} />

          <S.SubSectionTitle>Equipe</S.SubSectionTitle>
          {equipe.map((membro, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Nome" value={membro.nome} />
              <InfoRow label="Formação" value={membro.formacao} />
              <InfoRow label="Função" value={membro.funcao} />
              <InfoRow label="Lattes" value={membro.lattes} />
            </S.ItemCard>
          ))}
        </S.Section>

        {/* ============================================= */}
        {/* SEÇÃO ATUAÇÃO                                */}
        {/* ============================================= */}
        <S.Section>
          <S.SectionTitle>Atuação</S.SectionTitle>

          <S.SubSectionTitle>Tipos de Estudo Admitidos</S.SubSectionTitle>
          <S.TagContainer>
            {atuacao.tiposEstudo.map(tipo => <S.Tag key={tipo}>{tipo}</S.Tag>)}
          </S.TagContainer>

          <S.SubSectionTitle>Especialidades da Saúde</S.SubSectionTitle>
          <S.TagContainer>
            {atuacao.especialidadesSaude?.map(esp => <S.Tag key={esp}>{esp}</S.Tag>)}
          </S.TagContainer>

          <S.SubSectionTitle>Outras Especialidades</S.SubSectionTitle>
          <S.TagContainer>
            {atuacao.outrasEspecialidades?.map(esp => <S.Tag key={esp}>{esp}</S.Tag>)}
          </S.TagContainer>

          <S.SubSectionTitle>Atividades de Pesquisa</S.SubSectionTitle>
          {atuacao.atividadesPesquisa?.map((ativ, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Título" value={ativ.titulo} />
              <InfoRow label="Código" value={`${ativ.codigoPrefixo || ''} ${ativ.codigoNumeracao || ''}`} />
              <InfoRow label="Tipo" value={ativ.tipo} />
              <InfoRow label="Especialidade" value={ativ.especialidade} />
              <InfoRow label="Ano" value={ativ.ano} />
            </S.ItemCard>
          ))}
        </S.Section>
        
        {/* ============================================= */}
        {/* SEÇÃO INFRAESTRUTURA                         */}
        {/* ============================================= */}
        <S.Section>
          <S.SectionTitle>Infraestrutura</S.SectionTitle>
          <InfoRow label="Relação com ORPC" value={mapRelacaoOrpc(infraestrutura.relacao_orpc)} />
          <InfoRow label="Instalações Específicas" value={infraestrutura.instalacoes_especificas} />

          <S.SubSectionTitle>Equipamentos</S.SubSectionTitle>
          {infraestrutura.equipamentos?.map((eq, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Equipamento" value={eq.nome} />
              <InfoRow label="Modelo" value={eq.modelo} />
              <InfoRow label="Quantidade" value={eq.quantidade} />
            </S.ItemCard>
          ))}

          <S.SubSectionTitle>Modelagem CPEC x ORPC</S.SubSectionTitle>
          {infraestrutura.modelagem_orpc?.map((mod, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Serviço" value={mod.servico} />
              <InfoRow label="Tipo" value={mod.tipo} />
            </S.ItemCard>
          ))}
        </S.Section>

        {/* ============================================= */}
        {/* SEÇÃO CAPACITAÇÃO E CONFORMIDADE             */}
        {/* ============================================= */}
        <S.Section>
          <S.SectionTitle>Capacitação e Conformidade</S.SectionTitle>
          <InfoRow label="Inspeções nos últimos 5 anos" value={cap.numero_inspecoes_5anos} />
          <InfoRow label="Possui Profissionais Regulatórios?" value={cap.possui_profissionais_regulatorios} />
          
          <S.SubSectionTitle>Certificações Nacionais</S.SubSectionTitle>
          {cap.certificacoesNacionais?.filter(c => c.nome).map((cert, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Nome" value={cert.nome} />
              <InfoRow label="Documento" value={cert.link_documento} />
            </S.ItemCard>
          ))}
          
          <S.SubSectionTitle>Certificações Internacionais</S.SubSectionTitle>
           {cap.certificacoesInternacionais?.filter(c => c.nome).map((cert, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Nome" value={cert.nome} />
              <InfoRow label="Documento" value={cert.link_documento} />
            </S.ItemCard>
          ))}
        </S.Section>

        {/* ============================================= */}
        {/* SEÇÃO FINANCIAMENTO E SUSTENTABILIDADE       */}
        {/* ============================================= */}
         <S.Section>
          <S.SectionTitle>Financiamento e Sustentabilidade</S.SectionTitle>

          <S.SubSectionTitle>Orçamentos Anuais</S.SubSectionTitle>
           {fin.orcamentosAnuais.map((orc, index) => (
            <S.ItemCard key={index}>
              <InfoRow label="Ano" value={orc.ano} />
              <InfoRow label="Orçamento Total" value={`R$ ${orc.orcamento}`} />
              <InfoRow label="% Pesquisa Clínica" value={`${orc.percentual_pesquisa_clinica || 0}%`} />
              <InfoRow label="% Capital" value={`${orc.percentual_capital || 0}%`} />
              <InfoRow label="% Custeio" value={`${orc.percentual_custeio || 0}%`} />
              <InfoRow label="% Financiamento Privado" value={`${orc.percentual_financiamento_privado || 0}%`} />
              <InfoRow label="% Financiamento Público" value={`${orc.percentual_financiamento_publico || 0}%`} />
            </S.ItemCard>
          ))}

          <S.SubSectionTitle>Práticas Financeiras</S.SubSectionTitle>
          <S.TagContainer>
            {fin.praticasFinanceiras?.map(p => <S.Tag key={p.nome}>{p.nome}</S.Tag>)}
          </S.TagContainer>

          <S.SubSectionTitle>Práticas Ambientais</S.SubSectionTitle>
          <S.TagContainer>
            {fin.praticasAmbientais?.map(p => <S.Tag key={p.nome}>{p.nome}</S.Tag>)}
          </S.TagContainer>

          <S.SubSectionTitle>Práticas Sociais</S.SubSectionTitle>
          <S.TagContainer>
            {fin.praticasSociais?.map(p => <S.Tag key={p.nome}>{p.nome}</S.Tag>)}
          </S.TagContainer>
        </S.Section>

      </S.PageContainer>
      <Footer />
    </>
  );
}