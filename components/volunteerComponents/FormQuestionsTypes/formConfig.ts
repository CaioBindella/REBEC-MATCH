// Interface para as opções de uma pergunta
interface FormOption {
  label: string;
  value: string;
}

// Interface para uma única pergunta
interface FormQuestion {
  id: number; // Agora é number e os dados respeitam isso
  label: string;
  type: 'text' | 'radio';
  placeholder?: string;
  options?: FormOption[];
  keyboardType?: 'default' | 'numeric';
}

// Interface para uma seção do formulário
interface FormSection {
  id: number; // Padronizei para number também
  title: string;
  questions: FormQuestion[];
}

export const volunteerFormConfig: FormSection[] = [
  {
    id: 1,
    title: '1. Dados Pessoais',
    questions: [
      { id: 1, label: '1.1. Data de nascimento', type: 'text', placeholder: 'DD/MM/AAAA' },
      { id: 2, label: '1.2. Idade (em anos)', type: 'text', keyboardType: 'numeric' },
      {
        id: 3,
        label: '1.3. Sexo biológico',
        type: 'radio',
        options: [
          { label: 'Masculino', value: 'MASCULINO' },
          { label: 'Feminino', value: 'FEMININO' },
          { label: 'Outro', value: 'OUTRO' },
          { label: 'Prefere não responder', value: 'NAO_INFORMADO' },
        ],
      },
      {
        id: 4,
        label: '1.4. Identidade de gênero',
        type: 'radio',
        options: [
            { label: 'Cisgênero', value: 'CISGENERO' },
            { label: 'Transgênero', value: 'TRANSGENERO' },
            { label: 'Não-binário', value: 'NAO_BINARIO' },
            { label: 'Outro', value: 'OUTRO' },
            { label: 'Prefere não responder', value: 'NAO_INFORMADO' },
        ],
      },
      {
        id: 5,
        label: '1.5. Estado civil',
        type: 'radio',
        options: [
            { label: 'Solteiro(a)', value: 'SOLTEIRO' },
            { label: 'Casado(a) / União estável', value: 'CASADO_UNIAO_ESTAVEL' },
            { label: 'Separado(a) / Divorciado(a)', value: 'SEPARADO_DIVORCIADO' },
            { label: 'Viúvo(a)', value: 'VIUVO' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: '2. Etnia/Raça',
    questions: [
      {
        id: 6,
        label: '2.1. Cor ou raça autodeclarada',
        type: 'radio',
        options: [
          { label: 'Branca', value: 'BRANCA' },
          { label: 'Preta', value: 'PRETA' },
          { label: 'Parda', value: 'PARDA' },
          { label: 'Amarela', value: 'AMARELA' },
          { label: 'Indígena', value: 'INDIGENA' },
          { label: 'Prefere não responder', value: 'NAO_INFORMADO' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: '3. Escolaridade',
    questions: [
        {
            id: 7,
            label: '3.1. Grau de instrução (mais alto concluído)',
            type: 'radio',
            options: [
                { label: 'Sem instrução formal', value: 'SEM_INSTRUCAO' },
                { label: 'Ensino fundamental incompleto', value: 'FUNDAMENTAL_INCOMPLETO' },
                { label: 'Ensino fundamental completo', value: 'FUNDAMENTAL_COMPLETO' },
                { label: 'Ensino médio incompleto', value: 'MEDIO_INCOMPLETO' },
                { label: 'Ensino médio completo', value: 'MEDIO_COMPLETO' },
                { label: 'Ensino superior incompleto', value: 'SUPERIOR_INCOMPLETO' },
                { label: 'Ensino superior completo', value: 'SUPERIOR_COMPLETO' },
                { label: 'Pós-graduação', value: 'POS_GRADUACAO' },
            ],
        },
    ],
  },
  {
    id: 4,
    title: '4. Ocupação e Renda',
    questions: [
        {
            id: 8,
            label: '4.1. Situação de trabalho atual',
            type: 'radio',
            options: [
                { label: 'Empregado(a) com carteira assinada', value: 'EMPREGADO_CLT' },
                { label: 'Autônomo(a)', value: 'AUTONOMO' },
                { label: 'Desempregado(a)', value: 'DESEMPREGADO' },
                { label: 'Estudante', value: 'ESTUDANTE' },
                { label: 'Aposentado(a)', value: 'APOSENTADO' },
                { label: 'Dona(o) de casa', value: 'DONA_CASA' },
                { label: 'Outro', value: 'OUTRO' },
            ],
        },
        { id: 9, label: '4.2. Profissão (se aplicável)', type: 'text' },
        {
            id: 10,
            label: '4.3. Renda familiar mensal',
            type: 'radio',
            options: [
                { label: 'Sem renda', value: 'SEM_RENDA' },
                { label: 'Até 1 salário mínimo', value: 'ATE_1_SM' },
                { label: '1 a 2 salários mínimos', value: '1_A_2_SM' },
                { label: '2 a 5 salários mínimos', value: '2_A_5_SM' },
                { label: '5 a 10 salários mínimos', value: '5_A_10_SM' },
                { label: 'Acima de 10 salários mínimos', value: 'ACIMA_10_SM' },
                { label: 'Prefere não responder', value: 'NAO_INFORMADO' },
            ],
        },
    ],
  },
  {
    id: 5,
    title: '5. Condições de Moradia',
    questions: [
        {
            id: 11,
            label: '5.1. Tipo de moradia',
            type: 'radio',
            options: [
                { label: 'Própria', value: 'PROPRIA' },
                { label: 'Alugada', value: 'ALUGADA' },
                { label: 'Cedida', value: 'CEDIDA' },
                { label: 'Outra', value: 'OUTRA' },
            ],
        },
        { id: 12, label: '5.2. Quantas pessoas moram na mesma casa?', type: 'text', keyboardType: 'numeric' },
        { id: 13, label: '5.3. Acesso a água encanada', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 14, label: '5.4. Acesso a esgotamento sanitário', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 15, label: '5.5. Acesso a coleta de lixo regular', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 16, label: '5.6. Acesso a eletricidade', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
    ],
  },
  {
    id: 6,
    title: '6. Outras Informações',
    questions: [
        { id: 17, label: '6.1. Nacionalidade', type: 'text' },
        { id: 18, label: '6.2. País de nascimento', type: 'text' },
        { id: 19, label: '6.3. Religião (se desejar informar)', type: 'text' },
        { id: 20, label: '6.4. Língua principal falada em casa', type: 'text' },
    ],
  },
  {
    id: 7,
    title: '7. Informações de Acesso e Inclusão Social',
    questions: [
        { id: 21, label: '7.1. Possui acesso regular à internet?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 22, label: '7.2. Possui telefone celular com WhatsApp?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 23, label: '7.3. Você já participou de algum estudo clínico?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Não sabe / Não lembra', value: 'NAO_SABE' }] },
    ],
  },
  {
    id: 9,
    title: '9. Informações sobre Estilo de Vida',
    questions: [
      { id: 24, label: '9.1. Você pratica atividade física regularmente?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
      { id: 25, label: '9.2. Você fuma atualmente?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Já fumou, mas parou', value: 'EX_FUMANTE' }] },
      { id: 26, label: '9.3. Você consome bebidas alcoólicas?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Raramente', value: 'RARAMENTE' }] },
      { id: 27, label: '9.4. Você é gestante?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
      { id: 28, label: '9.5. Como você avaliaria sua saúde geral?', type: 'radio', options: [{ label: 'Excelente', value: 'EXCELENTE' }, { label: 'Boa', value: 'BOA' }, { label: 'Regular', value: 'REGULAR' }, { label: 'Ruim', value: 'RUIM' }, { label: 'Muito ruim', value: 'MUITO_RUIM' }] },
    ],
  },
  {
    id: 10,
    title: '10. Apoio Social e Saúde Mental',
    questions: [
        { id: 29, label: 'Você sente que pode contar com alguém em momentos difíceis?', type: 'radio', options: [{ label: 'Sempre', value: 'SEMPRE' }, { label: 'Às vezes', value: 'AS_VEZES' }, { label: 'Raramente', value: 'RARAMENTE' }, { label: 'Nunca', value: 'NUNCA' }] },
        { id: 30, label: 'Nos últimos 30 dias, você sentiu-se triste ou desanimado na maior parte do tempo?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
    ],
  },
];