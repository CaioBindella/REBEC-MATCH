// Tipos que espelham os DTOs da API principal (Java/Spring Boot) e do serviço de chat (Node.js).

// --- ENUMS ---
export type TipoEspecifico = 'PESQUISADOR' | 'VOLUNTARIO';
export type Sexo = 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_INFORMADO';
export type GeneroElegivel = 'MASCULINO' | 'FEMININO' | 'AMBOS';
export type TipoQuestao = 'TEXTO' | 'OPCOES';
export type StatusCandidatura = 'PENDENTE' | 'ACEITO_PELO_PESQUISADOR' | 'CONCLUIDO' | 'RECUSADO';

// Rótulos ICTRP gravados em estudo.recruitment_status
export type StatusRecrutamento =
  | 'Recruiting'
  | 'Not yet recruiting'
  | 'Recruitment completed'
  | 'Data analysis completed'
  | 'Suspended'
  | 'Terminated'
  | 'Withdrawn'
  | 'Other';

// Corpo de erro padronizado pelo RestExceptionHandler
export interface ApiErrorDTO {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
}

// --- AUTH ---
export interface LoginResponseDTO {
  token: string;
  usuario: UsuarioResponseDTO;
  nomeFicticio: string | null;
  perfilId: number | null;
}

// --- USUÁRIO ---
export interface UsuarioCreateDTO {
  nome?: string;
  sobrenome?: string;
  login: string;
  email: string;
  senha: string;
  tipoEspecifico: TipoEspecifico;
  sexo?: Sexo;
  dataNascimento?: string; // AAAA-MM-DD
  telefone?: string;
  cep?: string;            // 8 dígitos
  endereco?: string;
  documento?: string;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string | null;
  sobrenome: string | null;
  login: string;
  email: string;
  tipoEspecifico: TipoEspecifico;
  sexo: Sexo | null;
  tester: boolean;
}

export interface ChangePasswordDTO {
  senhaAtual: string;
  novaSenha: string;
}

// --- PERFIS (pseudonimizados) ---
export interface PesquisadorResponseDTO {
  id: number;
  usuarioId: number;
  nomeFicticio: string;
}

// --- ESTUDO ---
export interface EstudoCreateDTO {
  publicTitle: string;
  scientificTitle: string;
  recruitmentStatus: StatusRecrutamento;
  studyType?: string;
  phase?: string;
  dateRegistration: string;  // AAAA-MM-DD
  dateEnrolment?: string | null;
  url?: string;
  primarySponsor?: string;
  hcFreetext?: string;
  iFreetext?: string;
  approvalDate?: string | null;
  secId?: string | null;
  trialId: string;
}

export type EstudoUpdateDTO = EstudoCreateDTO;

export interface EstudoResponseDTO {
  id: number;
  pesquisadorId: number;
  pesquisador: PesquisadorResponseDTO | null;
  publicTitle: string;
  scientificTitle: string;
  recruitmentStatus: string;
  studyType: string;
  phase: string;
  dateRegistration: string;
  dateEnrolment: string | null;
  url: string;
  primarySponsor: string;
  hcFreetext: string;
  iFreetext: string;
  approvalDate: string | null;
  secId: string | null;
  trialId: string;
  criterios: CriterioResponseDTO[];
  nomesDoencas: string[];
}

// --- CRITÉRIO ---
export interface CriterioCreateDTO {
  estudo_id: number;
  inclusion_criteria: string;
  agemin: string;  // formato ICTRP: número + unidade (Y, M, W, D, H). Ex.: 18Y
  agemax: string;
  gender: GeneroElegivel;
  exclusion_criteria: string;
}

export type CriterioUpdateDTO = Omit<CriterioCreateDTO, 'estudo_id'>;

export interface CriterioResponseDTO {
  id: number;
  estudo_id: number;
  inclusion_criteria: string;
  agemin: string;
  agemax: string;
  gender: GeneroElegivel;
  exclusion_criteria: string;
}

// --- DOENÇAS (vocabulário controlado) ---
export interface DoencaResponseDTO {
  id: number;
  codigo: string;
  nomeCientifico: string;
  nomePopular: string;
  vocabulario: string;
}

// --- FORMULÁRIO & QUESTÕES ---
export interface QuestaoResponseDTO {
  id: number;
  formularioId: number;
  texto: string;
  tipo: TipoQuestao;
  opcoes: string | null; // JSON com a lista de opções (questões OPCOES)
  obrigatorio: boolean;
  secao: string | null;
}

// --- RESPOSTAS ---
export interface RespostaIndividualDTO {
  questao_id: number;
  conteudo: string;
  marcado: boolean;
}

export interface RespostasBatchCreateDTO {
  formulario_id: number;
  respostas: RespostaIndividualDTO[];
}

export interface RespostaResponseDTO {
  id: number;
  voluntarioId: number;
  questaoId: number;
  questaoTexto: string;
  conteudo: string;
  marcado: boolean;
}

// --- CANDIDATURA ---
export interface CandidaturaCreateDTO {
  estudoId: number;
}

export interface CandidaturaResponseDTO {
  id: number;
  voluntarioId: number;
  voluntarioUsuarioId: number;
  voluntarioNome: string;
  estudoId: number;
  estudoTitulo: string;
  pesquisadorId: number;
  pesquisadorUsuarioId: number;
  pesquisadorNomeFicticio: string;
  status: StatusCandidatura;
  dataCandidatura: string;
}

export interface CandidatoDetalhadoDTO {
  candidaturaId: number;
  voluntarioId: number;
  voluntarioUsuarioId: number;
  nomeFicticio: string;
  idade: number | null;
  sexo: Sexo | null;
  localizacao: string | null; // cinco primeiros dígitos do CEP
  estudoId: number;
  estudoTitulo: string;
  status: StatusCandidatura;
}

// --- MATCH ---
export interface MatchResultResponseDTO {
  id: number;
  voluntarioId: number;
  voluntarioUsuarioId: number;
  voluntarioNomeFicticio: string;
  estudoId: number;
  estudoPublicTitle: string;
  pesquisadorUsuarioId: number;
  pesquisadorNomeFicticio: string;
  criteriosAtendidos: number;
  dataMatch: string;
  justificativa: string;
}

// --- NOTIFICAÇÕES ---
export interface NotificacaoResponseDTO {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: string; // 'info' | 'success'
  lida: boolean;
  dataCriacao: string;
  usuarioId: number;
}

// --- CHAT (serviço Node.js) ---
export interface MensagemDTO {
  id: number;
  autor_id: number;
  leitor_id: number;
  estudo_id: number;
  conteudo: string;
  data_envio: string;
  data_leitura: string | null;
}

export interface MensagemCreateDTO {
  leitorId: number;
  estudoId: number;
  conteudo: string;
}
