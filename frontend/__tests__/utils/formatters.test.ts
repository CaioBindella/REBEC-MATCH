import {
  cepParaUf,
  dataBrParaIso,
  estaRecrutando,
  faixaEtaria,
  formatDate,
  formatIdade,
  generoElegivelLabel,
  IDADE_VALIDA,
  normalizarIdade,
  parseOpcoes,
  sexoLabel,
  statusCandidaturaLabel,
  statusRecrutamentoLabel,
} from '@/utils/formatters';

describe('status de recrutamento', () => {
  it.each([
    ['Recruiting', 'Recrutando'],
    ['recruiting', 'Recrutando'],
    ['Recruitment completed', 'Recrutamento encerrado'],
    ['Desconhecido', 'Desconhecido'],
    [null, '-'],
  ])('traduz %p como %p', (status, rotulo) => {
    expect(statusRecrutamentoLabel(status)).toBe(rotulo);
  });

  it('reconhece estudos em recrutamento sem diferenciar maiúsculas', () => {
    expect(estaRecrutando('RECRUITING')).toBe(true);
    expect(estaRecrutando('Not yet recruiting')).toBe(false);
    expect(estaRecrutando(undefined)).toBe(false);
  });
});

describe('rótulos de candidatura, sexo e gênero elegível', () => {
  it('descreve cada status da candidatura', () => {
    expect(statusCandidaturaLabel('PENDENTE')).toBe('Aguardando análise do pesquisador');
    expect(statusCandidaturaLabel('ACEITO_PELO_PESQUISADOR')).toBe('Aprovada, aguardando sua confirmação');
    expect(statusCandidaturaLabel('CONCLUIDO')).toBe('Participação confirmada');
    expect(statusCandidaturaLabel('RECUSADO')).toBe('Não aprovada');
  });

  it('traduz o sexo e trata valores ausentes', () => {
    expect(sexoLabel('FEMININO')).toBe('Feminino');
    expect(sexoLabel('XYZ')).toBe('Não informado');
    expect(sexoLabel(null)).toBe('Não informado');
  });

  it('considera "todos os sexos" quando o gênero elegível não é informado', () => {
    expect(generoElegivelLabel('MASCULINO')).toBe('Masculino');
    expect(generoElegivelLabel(null)).toBe('Todos os sexos');
  });
});

describe('idades no formato ICTRP', () => {
  it.each([
    ['18Y', '18 anos'],
    ['1Y', '1 ano'],
    ['6M', '6 meses'],
    ['2W', '2 semanas'],
    ['28D', '28 dias'],
    ['72H', '72 horas'],
    ['40', '40 anos'],
    ['0', null],
    ['', null],
    ['dezoito', null],
  ])('formata %p como %p', (limite, texto) => {
    expect(formatIdade(limite)).toBe(texto);
  });

  it('descreve a faixa etária conforme os limites informados', () => {
    expect(faixaEtaria('18Y', '65Y')).toBe('De 18 anos a 65 anos');
    expect(faixaEtaria('18Y', '0')).toBe('A partir de 18 anos');
    expect(faixaEtaria('', '2Y')).toBe('Até 2 anos');
    expect(faixaEtaria(null, null)).toBe('Sem restrição de idade');
  });

  it('normaliza a idade digitada pelo pesquisador', () => {
    expect(normalizarIdade(' 18 ')).toBe('18Y');
    expect(normalizarIdade('6m')).toBe('6M');
    expect(normalizarIdade('')).toBe('');
  });

  it('valida o formato da idade', () => {
    expect(IDADE_VALIDA.test('18Y')).toBe(true);
    expect(IDADE_VALIDA.test('40')).toBe(true);
    expect(IDADE_VALIDA.test('18X')).toBe(false);
  });
});

describe('datas', () => {
  it('formata datas ISO no padrão brasileiro', () => {
    expect(formatDate('2026-01-10')).toBe('10/01/2026');
    expect(formatDate('2026-01-10T14:30:00')).toBe('10/01/2026');
    expect(formatDate(null)).toBe('-');
  });

  it('converte datas digitadas e rejeita datas inexistentes', () => {
    expect(dataBrParaIso('10/01/2026')).toBe('2026-01-10');
    expect(dataBrParaIso('31/02/2026')).toBeNull();
    expect(dataBrParaIso('2026-01-10')).toBeNull();
  });
});

describe('outros utilitários', () => {
  it.each([
    ['28625-570', 'RJ'],
    ['01310100', 'SP'],
    ['90010000', 'RS'],
    ['69900000', 'AC'],
    ['123', 'BR'],
    [null, 'BR'],
  ])('associa o CEP %p à UF %p', (cep, uf) => {
    expect(cepParaUf(cep)).toBe(uf);
  });

  it('lê as opções JSON de uma questão e tolera conteúdo inválido', () => {
    expect(parseOpcoes('["Sim", "Não"]')).toEqual(['Sim', 'Não']);
    expect(parseOpcoes('não é json')).toEqual([]);
    expect(parseOpcoes('{"a": 1}')).toEqual([]);
    expect(parseOpcoes(null)).toEqual([]);
  });
});
