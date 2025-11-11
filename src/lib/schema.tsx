import { z } from 'zod';

// Schema para um único endereço, para ser reutilizado
const EnderecoSchema = z.object({
  cep: z.string().min(8, 'CEP inválido'),
  tipoLogradouro: z.string().optional(),
  logradouro: z.string().min(1, 'Endereço é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  uf: z.string().min(2, 'UF é obrigatório'),
});

// --- Schemas Pessoal ---
const DirecaoClinicaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  lattes: z.string().url('Link do Lattes inválido').optional().or(z.literal('')),
  documento: z.string().url('Link do documento inválido').optional().or(z.literal('')),
});

const RepresentanteLegalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  lattes: z.string().url('Link do Lattes inválido').optional().or(z.literal('')),
  documento: z.string().url('Link do documento inválido').optional().or(z.literal('')),
});

// --- Schema Equipe ---
const EquipeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  formacao: z.string().min(1, 'Formação é obrigatória'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  lattes: z.string().url('Link do Lattes inválido').optional().or(z.literal('')),
  documento: z.string().url('Link do documento inválido').optional().or(z.literal('')),
});

// --- Schemas Atuação ---
const AtividadePesquisaSchema = z.object({
  codigoPrefixo: z.string().optional(),
  codigoNumeracao: z.string().optional(),
  titulo: z.string().min(1, 'Título é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  especialidade: z.string().min(1, 'Especialidade é obrigatória'),
  ano: z.string().min(4, 'Ano inválido (ex: 2024)').optional().or(z.literal('')),
});

const EquipamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  modelo: z.string().optional(),
  quantidade: z.string().min(1, 'Selecione a quantidade'), // Usando string pois o input type="number" pode retornar string
});

const ModelagemOrpcSchema = z.object({
  servico: z.string().min(1, 'Selecione um serviço'),
  tipo: z.enum(['Contrata', 'Oferece'])
  .refine((val) => !!val, { message: 'Selecione Contrata ou Oferece' }),
});

const CertificacaoSchema = z.object({
  nome: z.string().min(1, 'Selecione a certificação'),
  link_documento: z.string().url('Insira um link válido para o certificado').optional().or(z.literal('')),
});

const OrcamentoAnualSchema = z.object({
  ano: z.string().min(1, 'Selecione o ano'),
  orcamento: z.string().min(1, 'Informe o orçamento'), // Usar string para input number
  percentual_pesquisa_clinica: z.string().optional().or(z.literal('')),
  percentual_capital: z.string().optional().or(z.literal('')),
  percentual_custeio: z.string().optional().or(z.literal('')),
  percentual_financiamento_privado: z.string().optional().or(z.literal('')),
  percentual_financiamento_publico: z.string().optional().or(z.literal('')),
}).refine(data => {
  // Validação opcional para garantir que os percentuais somem 100% se preenchidos
  const percentages = [
    parseFloat(data.percentual_pesquisa_clinica || '0'),
    parseFloat(data.percentual_capital || '0'),
    parseFloat(data.percentual_custeio || '0'),
    parseFloat(data.percentual_financiamento_privado || '0'),
    parseFloat(data.percentual_financiamento_publico || '0'),
  ];
  const sum = percentages.reduce((acc, val) => acc + val, 0);
  // Permite 0 ou 100 (com uma pequena margem para erros de ponto flutuante)
  return sum === 0 || (sum > 99.9 && sum < 100.1); 
}, {
  message: 'A soma dos percentuais da composição deve ser 100% (ou todos devem estar vazios)',
  path: ['percentual_pesquisa_clinica'], // Onde mostrar o erro
});

// Schema para um item de prática sustentável adicionado (apenas o nome/ID)
const PraticaSustentavelAdicionadaSchema = z.object({
  nome: z.string(), // Assume que vamos armazenar o nome (ou ID) da prática selecionada
});


export const formSchema = z.object({
  // --- TELA 1: Identificação Institucional ---
  identificacaoInstitucional: z.object({
    // (O conteúdo de identificacaoInstitucional permanece o mesmo)
    centro: z.object({
      razaoSocial: z.string().min(1, 'Campo obrigatório'),
      nomeCpec: z.string().min(1, 'Campo obrigatório'),
      cnpj: z.string().min(14, 'CNPJ inválido'),
      documentoCnpj: z.string().url('Por favor, insira um link válido').optional().or(z.literal('')),
      cnes: z.string().min(1, 'Campo obrigatório'),
      endereco: EnderecoSchema,
      emails: z.array(z.object({ value: z.string().email('E-mail inválido') })).min(1, 'Adicione pelo menos um e-mail'),
      telefones: z.array(z.object({ value: z.string() })).max(2, 'Máximo de 2 telefones').optional(),
      website: z.string().url('URL inválida').optional().or(z.literal('')),
      midiasSociais: z
        .array(
          z.object({
            tipo: z.enum(['linkedin', 'instagram', 'website']),
            url: z.string().url('URL inválida'),
          })
        )
        .max(3, 'Máximo de 3 mídias sociais')
        .optional(),
      documentoCriacao: z.string().url('Por favor, insira um link válido').optional().or(z.literal('')),
      anoFundacao: z.string().optional(),
    }),
    vinculacao: z.object({
      comiteEtica: z.string().min(1, 'Campo obrigatório'),
      nomeInstituicao: z.string().min(1, 'Campo obrigatório'),
      cnpjInstituicao: z.string().min(14, 'CNPJ inválido'),
      documentoCnpjInstituicao: z.string().url('Por favor, insira um link válido').optional().or(z.literal('')),
      cnesInstituicao: z.string().min(1, 'Campo obrigatório'),
      enderecoInstituicao: EnderecoSchema,
      emailInstituicao: z.string().email('E-mail inválido').min(1, 'Campo obrigatório'),
    }),
  }),

  // --- TELA 2: Pessoal ---
  pessoal: z.object({
    direcaoClinica: DirecaoClinicaSchema,
    representanteLegal: RepresentanteLegalSchema,
  }),

  // --- TELA 2: Equipe ---
  equipe: z.array(EquipeSchema).min(1, 'Adicione pelo menos um membro à equipe'),

  // --- TELA 3: Atuação ---
  atuacao: z.object({
    tiposEstudo: z.array(z.string()).min(1, 'Selecione ao menos um tipo de estudo'),
    atividadesPesquisa: z.array(AtividadePesquisaSchema).optional(),
    especialidadesSaude: z.array(z.string()).optional(),
    outrasEspecialidades: z.array(z.string()).optional(),
  }).refine(data => 
    (data.especialidadesSaude && data.especialidadesSaude.length > 0) || 
    (data.outrasEspecialidades && data.outrasEspecialidades.length > 0), {
    message: 'Selecione ao menos uma especialidade (Saúde ou Outras)',
    path: ['especialidadesSaude'], // Onde o erro vai aparecer
  }),

  infraestrutura: z.object({  
  equipamentos: z.array(EquipamentoSchema).optional(),  
  relacao_orpc: z  
      .enum(['sin_sempre', 'sin_eventualmente', 'nao', 'atuamos_como'])  
      .optional()  
      .refine((val) => val !== undefined, {
        message: 'Selecione uma opção'
      }),  
    instalacoes_especificas: z.string().optional(),  
    modelagem_orpc: z.array(ModelagemOrpcSchema).optional(),  
  }),
  capacitacaoConformidade: z.object({
    numero_inspecoes_5anos: z.string().optional().or(z.literal('')), // String por causa do input number
    possui_profissionais_regulatorios: 
      z.enum(['Sim', 'Nao'])
      .optional()
      .refine((val) => val !== undefined, {
        message: 'Selecione Sim ou Não'
      }),
    certificacoesNacionais: z.array(CertificacaoSchema).optional(),
    certificacoesInternacionais: z.array(CertificacaoSchema).optional(),
  }),
  financiamentoSustentabilidade: z.object({
     orcamentosAnuais: z.array(OrcamentoAnualSchema).min(1, 'Adicione pelo menos um orçamento anual'),
     praticasFinanceiras: z.array(PraticaSustentavelAdicionadaSchema).optional(),
     praticasAmbientais: z.array(PraticaSustentavelAdicionadaSchema).optional(),
     praticasSociais: z.array(PraticaSustentavelAdicionadaSchema).optional(),
   }),
});

export type FormData = z.infer<typeof formSchema>;