// src/services/types.ts

// --- ENUMS ---
export type TipoUsuario = 'ADMIN' | 'USER';
export type TipoEspecifico = 'PESQUISADOR' | 'VOLUNTARIO';
export type Sexo = 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_INFORMADO';
export type TipoQuestao = 'TEXTO' | 'OPCOES';
export type StatusCandidatura = 'PENDENTE' | 'ACEITO_PELO_PESQUISADOR' | 'CONCLUIDO' | 'RECUSADO';

// --- AUTH ---
export interface LoginResponseDTO {
  token: string;
  usuario: UsuarioResponseDTO;
  nomeFicticio: string | null;
  perfilId: number;
}

// --- USUÁRIO ---
export interface UsuarioCreateDTO {
  nome: string;
  sobrenome: string;
  login: string;
  email: string;
  senha?: string;
  tipoEspecifico: TipoEspecifico;
  sexo: Sexo;
  dataNascimento: string; // YYYY-MM-DD
  telefone: string;
  cep: string;
  endereco: string;
  documento: string;
}

export interface UsuarioUpdateDTO {
  nome?: string;
  sobrenome?: string;
  login?: string;
  email?: string;
  senha?: string;
  tipoEspecifico?: TipoEspecifico;
  sexo?: Sexo;
  dataNascimento?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  documento?: string;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  sobrenome: string;
  login: string;
  email: string;
  tipo: TipoUsuario;
  tipoEspecifico: TipoEspecifico;
  sexo: Sexo;
  tester: boolean;
}

// --- PESQUISADOR ---
export interface PesquisadorCreateDTO {
  usuarioId: number;
  nomeFicticio: string;
}

export interface PesquisadorUpdateDTO {
  nomeFicticio: string;
}

export interface PesquisadorResponseDTO {
  id: number;
  usuario: UsuarioResponseDTO;
  nomeFicticio: string;
}

// --- VOLUNTÁRIO ---
export interface VoluntarioCreateDTO {
  usuarioId: number;
  distancia: number;
  nomeFicticio: string;
}

export interface VoluntarioUpdateDTO {
  distancia: number;
  nomeFicticio: string;
}

export interface VoluntarioResponseDTO {
  id: number;
  usuario: UsuarioResponseDTO;
  distancia: number;
  nomeFicticio: string;
}

// --- ESTUDO ---
export interface EstudoCreateDTO {
  pesquisador_id: number;
  publicTitle: string;
  scientificTitle: string;
  recruitmentStatus: string;
  studyType: string;
  phase: string;
  dateRegistration: string;
  dateEnrolment?: string;
  url: string;
  primarySponsor: string;
  hcFreetext: string;
  iFreetext: string;
  approvalDate?: string;
  secId?: string;
  trialId: string;
}

export interface EstudoUpdateDTO extends Partial<EstudoCreateDTO> {}

export interface EstudoResponseDTO {
  id: number;
  pesquisadorId: number;
  publicTitle: string;
  pesquisador: PesquisadorResponseDTO;
  scientificTitle: string;
  recruitmentStatus: string;
  studyType: string;
  phase: string;
  dateRegistration: string;
  dateEnrolment: string;
  url: string;
  primarySponsor: string;
  hcFreetext: string;
  iFreetext: string;
  approvalDate: string;
  secId: string;
  trialId: string;
  criterios: CriterioResponseDTO[];
}

// --- CRITÉRIO ---
export interface CriterioCreateDTO {
  estudo_id: number;
  inclusion_criteria: string;
  agemin: string;
  agemax: string;
  gender: string;
  exclusion_criteria: string;
}

export interface CriterioResponseDTO {
  id: number;
  estudo_id: number;
  inclusion_criteria: string;
  agemin: string;
  agemax: string;
  gender: string;
  exclusion_criteria: string;
}

// --- FORMULÁRIO & QUESTÕES ---
export interface FormularioResponseDTO {
  id: number;
  estudoId: number;
  titulo: string;
  textoParaRespostaLivre: string;
  dataCriacao: string;
}

export interface QuestaoResponseDTO {
  id: number;
  formularioId: number;
  texto: string;
  tipo: TipoQuestao;
  opcoes: string; // JSON String
  obrigatorio: boolean;
}

// --- RESPOSTAS ---
export interface RespostasBatchCreateDTO {
  voluntario_id: number;
  formulario_id: number;
  busca_id?: number;
  respostas: {
    questao_id: number;
    conteudo: string;
    marcado?: boolean;
  }[];
}

// --- MATCH ---
export interface MatchResultResponseDTO {
  id: number;
  voluntarioId: number;
  voluntarioNomeFicticio: string;
  estudoId: number;
  estudoPublicTitle: string;
  criteriosAtendidos: number;
  dataMatch: string;
  justificativa: string;
}

// --- CANDIDATURA (Novo Fluxo) ---
export interface CandidaturaCreateDTO {
  voluntarioId: number;
  estudoId: number;
}

export interface CandidaturaResponseDTO {
  id: number;
  voluntarioId: number;
  voluntarioNome: string;
  estudoId: number;
  estudoTitulo: string;
  status: StatusCandidatura;
  dataCandidatura: string;
}