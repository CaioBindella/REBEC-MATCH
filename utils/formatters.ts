import { GeneroElegivel, Sexo, StatusCandidatura, StatusRecrutamento } from '@/types/types';

// --- Status de recrutamento (rótulos ICTRP gravados pela API) ---
export const STATUS_RECRUTAMENTO: { value: StatusRecrutamento; label: string }[] = [
  { value: 'Recruiting', label: 'Recrutando' },
  { value: 'Not yet recruiting', label: 'Ainda não recrutando' },
  { value: 'Recruitment completed', label: 'Recrutamento encerrado' },
  { value: 'Data analysis completed', label: 'Análise de dados concluída' },
  { value: 'Suspended', label: 'Suspenso' },
  { value: 'Terminated', label: 'Encerrado' },
  { value: 'Withdrawn', label: 'Retirado' },
  { value: 'Other', label: 'Outro' },
];

export const STATUS_RECRUTANDO: StatusRecrutamento = 'Recruiting';

export const statusRecrutamentoLabel = (status?: string | null) =>
  STATUS_RECRUTAMENTO.find((s) => s.value.toLowerCase() === (status ?? '').toLowerCase())?.label ?? (status || '-');

export const estaRecrutando = (status?: string | null) =>
  (status ?? '').toLowerCase() === STATUS_RECRUTANDO.toLowerCase();

// --- Candidatura ---
export const statusCandidaturaLabel = (status: StatusCandidatura) =>
  ({
    PENDENTE: 'Aguardando análise do pesquisador',
    ACEITO_PELO_PESQUISADOR: 'Aprovada, aguardando sua confirmação',
    CONCLUIDO: 'Participação confirmada',
    RECUSADO: 'Não aprovada',
  })[status];

// --- Sexo ---
export const GENERO_ELEGIVEL: { value: GeneroElegivel; label: string }[] = [
  { value: 'AMBOS', label: 'Todos os sexos' },
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'MASCULINO', label: 'Masculino' },
];

export const generoElegivelLabel = (genero?: GeneroElegivel | null) =>
  GENERO_ELEGIVEL.find((g) => g.value === genero)?.label ?? 'Todos os sexos';

export const sexoLabel = (sexo?: Sexo | string | null) =>
  ({ MASCULINO: 'Masculino', FEMININO: 'Feminino', OUTRO: 'Outro', NAO_INFORMADO: 'Não informado' } as Record<string, string>)[
    sexo ?? ''
  ] ?? 'Não informado';

// --- Idade no formato ICTRP (número + unidade: Y, M, W, D, H; "0" ou vazio = sem limite) ---
const UNIDADES: Record<string, [string, string]> = {
  '': ['ano', 'anos'],
  Y: ['ano', 'anos'],
  M: ['mês', 'meses'],
  W: ['semana', 'semanas'],
  D: ['dia', 'dias'],
  H: ['hora', 'horas'],
};

export const IDADE_VALIDA = /^\s*\d+\s*[YMWDHymwdh]?\s*$/;

/** Converte "18Y" em "18 anos"; devolve null quando não há limite. */
export const formatIdade = (limite?: string | null): string | null => {
  const match = (limite ?? '').trim().match(/^(\d+)\s*([A-Za-z]?)$/);
  if (!match || Number(match[1]) === 0) return null;
  const valor = Number(match[1]);
  const [singular, plural] = UNIDADES[match[2].toUpperCase()] ?? UNIDADES[''];
  return `${valor} ${valor === 1 ? singular : plural}`;
};

export const faixaEtaria = (minimo?: string | null, maximo?: string | null) => {
  const min = formatIdade(minimo);
  const max = formatIdade(maximo);
  if (min && max) return `De ${min} a ${max}`;
  if (min) return `A partir de ${min}`;
  if (max) return `Até ${max}`;
  return 'Sem restrição de idade';
};

/** Normaliza a idade digitada pelo pesquisador para o formato ICTRP (ex.: "18" -> "18Y"). */
export const normalizarIdade = (texto: string) => {
  const limpo = texto.trim().toUpperCase().replace(/\s+/g, '');
  if (!limpo) return '';
  return /^\d+$/.test(limpo) ? `${limpo}Y` : limpo;
};

// --- Datas (a API devolve ISO 8601: "2026-01-10" ou "2026-01-10T14:30:00") ---
export const formatDate = (iso?: string | null) => {
  if (!iso) return '-';
  const [ano, mes, dia] = iso.substring(0, 10).split('-');
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso;
};

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return '';
  const data = new Date(iso);
  return isNaN(data.getTime())
    ? iso
    : data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export const formatTime = (iso?: string | null) => {
  if (!iso) return '';
  const data = new Date(iso);
  return isNaN(data.getTime()) ? '' : data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

/** Converte "DD/MM/AAAA" digitado pelo usuário em "AAAA-MM-DD"; devolve null se inválida. */
export const dataBrParaIso = (texto: string): string | null => {
  const match = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dia, mes, ano] = match;
  const data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  if (isNaN(data.getTime()) || data.getDate() !== Number(dia) || data.getMonth() + 1 !== Number(mes)) return null;
  return `${ano}-${mes}-${dia}`;
};

export const isoParaDataBr = (iso?: string | null) => (iso ? formatDate(iso) : '');

// --- CEP -> UF (faixas dos Correios pelos cinco primeiros dígitos) ---
const FAIXAS_CEP: [number, number, string][] = [
  [1000, 19999, 'SP'], [20000, 28999, 'RJ'], [29000, 29999, 'ES'], [30000, 39999, 'MG'],
  [40000, 48999, 'BA'], [49000, 49999, 'SE'], [50000, 56999, 'PE'], [57000, 57999, 'AL'],
  [58000, 58999, 'PB'], [59000, 59999, 'RN'], [60000, 63999, 'CE'], [64000, 64999, 'PI'],
  [65000, 65999, 'MA'], [66000, 68899, 'PA'], [68900, 68999, 'AP'], [69000, 69299, 'AM'],
  [69300, 69399, 'RR'], [69400, 69899, 'AM'], [69900, 69999, 'AC'], [70000, 72799, 'DF'],
  [72800, 72999, 'GO'], [73000, 73699, 'DF'], [73700, 76799, 'GO'], [76800, 76999, 'RO'],
  [77000, 77999, 'TO'], [78000, 78899, 'MT'], [79000, 79999, 'MS'], [80000, 87999, 'PR'],
  [88000, 89999, 'SC'], [90000, 99999, 'RS'],
];

export const cepParaUf = (cep?: string | null) => {
  const digitos = (cep ?? '').replace(/\D/g, '');
  if (digitos.length < 5) return 'BR';
  const prefixo = Number(digitos.substring(0, 5));
  return FAIXAS_CEP.find(([inicio, fim]) => prefixo >= inicio && prefixo <= fim)?.[2] ?? 'BR';
};

export const UFS = [
  { label: 'Acre', value: 'AC' }, { label: 'Alagoas', value: 'AL' }, { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' }, { label: 'Bahia', value: 'BA' }, { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' }, { label: 'Espírito Santo', value: 'ES' }, { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' }, { label: 'Mato Grosso', value: 'MT' }, { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' }, { label: 'Pará', value: 'PA' }, { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' }, { label: 'Pernambuco', value: 'PE' }, { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' }, { label: 'Rio Grande do Norte', value: 'RN' }, { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' }, { label: 'Roraima', value: 'RR' }, { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' }, { label: 'Sergipe', value: 'SE' }, { label: 'Tocantins', value: 'TO' },
];

/** Lê a lista de opções (JSON) de uma questão do tipo OPCOES. */
export const parseOpcoes = (opcoes?: string | null): string[] => {
  if (!opcoes) return [];
  try {
    const lista = JSON.parse(opcoes);
    return Array.isArray(lista) ? lista.map(String) : [];
  } catch {
    return [];
  }
};
