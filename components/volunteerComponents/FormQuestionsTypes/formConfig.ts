// Interface para as opções de uma pergunta
interface FormOption {
  label: string;
  value: string;
}

// Interface para uma única pergunta
interface FormQuestion {
  id: string; // Corresponde ao `questao_id` no banco de dados
  label: string;
  type: 'text' | 'radio'; // Tipos de perguntas que suportamos
  placeholder?: string;
  options?: FormOption[];
  keyboardType?: 'default' | 'numeric'; // Para campos de texto numéricos
}

// Interface para uma seção do formulário
interface FormSection {
  id: string;
  title: string;
  questions: FormQuestion[];
}

// Exportamos a configuração completa do formulário
export const volunteerFormConfig: FormSection[] = [
  {
    id: 'dados_pessoais',
    title: '1. Dados Pessoais',
    questions: [
      { id: 'data_nascimento', label: '1.1. Data de nascimento', type: 'text', placeholder: 'DD/MM/AAAA' },
      { id: 'idade', label: '1.2. Idade (em anos)', type: 'text', keyboardType: 'numeric' },
      {
        id: 'sexo_biologico',
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
        id: 'identidade_genero',
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
        id: 'estado_civil',
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
    id: 'etnia_raca',
    title: '2. Etnia/Raça',
    questions: [
      {
        id: 'cor_raca',
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
    id: 'escolaridade',
    title: '3. Escolaridade',
    questions: [
        {
            id: 'grau_instrucao',
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
    id: 'ocupacao_renda',
    title: '4. Ocupação e Renda',
    questions: [
        {
            id: 'situacao_trabalho',
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
        { id: 'profissao', label: '4.2. Profissão (se aplicável)', type: 'text' },
        {
            id: 'renda_familiar',
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
    id: 'condicoes_moradia',
    title: '5. Condições de Moradia',
    questions: [
        {
            id: 'tipo_moradia',
            label: '5.1. Tipo de moradia',
            type: 'radio',
            options: [
                { label: 'Própria', value: 'PROPRIA' },
                { label: 'Alugada', value: 'ALUGADA' },
                { label: 'Cedida', value: 'CEDIDA' },
                { label: 'Outra', value: 'OUTRA' },
            ],
        },
        { id: 'pessoas_moradia', label: '5.2. Quantas pessoas moram na mesma casa?', type: 'text', keyboardType: 'numeric' },
        { id: 'acesso_agua_encanada', label: '5.3. Acesso a água encanada', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 'acesso_esgoto', label: '5.3. Acesso a esgotamento sanitário', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 'acesso_coleta_lixo', label: '5.3. Acesso a coleta de lixo regular', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 'acesso_eletricidade', label: '5.3. Acesso a eletricidade', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
    ],
  },
  {
    id: 'outras_informacoes',
    title: '6. Outras Informações',
    questions: [
        { id: 'nacionalidade', label: '6.1. Nacionalidade', type: 'text' },
        { id: 'pais_nascimento', label: '6.2. País de nascimento', type: 'text' },
        { id: 'religiao', label: '6.3. Religião (se desejar informar)', type: 'text' },
        { id: 'lingua_principal', label: '6.4. Língua principal falada em casa', type: 'text' },
    ],
  },
  {
    id: 'acesso_inclusao',
    title: '7. Informações de Acesso e Inclusão Social',
    questions: [
        { id: 'acesso_internet', label: '7.1. Possui acesso regular à internet?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 'possui_whatsapp', label: '7.2. Possui telefone celular com WhatsApp?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
        { id: 'participou_estudo_clinico', label: '7.3. Você já participou de algum estudo clínico?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Não sabe / Não lembra', value: 'NAO_SABE' }] },
    ],
  },
  {
    id: 'estilo_vida',
    title: '9. Informações sobre Estilo de Vida',
    questions: [
      { id: 'atividade_fisica', label: '9.1. Você pratica atividade física regularmente?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
      { id: 'fumante_atual', label: '9.2. Você fuma atualmente?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Já fumou, mas parou', value: 'EX_FUMANTE' }] },
      { id: 'consumo_alcool', label: '9.3. Você consome bebidas alcoólicas?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }, { label: 'Raramente', value: 'RARAMENTE' }] },
      { id: 'gestante', label: '9.4. Você é gestante?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
      { id: 'saude_geral', label: '9.5. Como você avaliaria sua saúde geral?', type: 'radio', options: [{ label: 'Excelente', value: 'EXCELENTE' }, { label: 'Boa', value: 'BOA' }, { label: 'Regular', value: 'REGULAR' }, { label: 'Ruim', value: 'RUIM' }, { label: 'Muito ruim', value: 'MUITO_RUIM' }] },
    ],
  },
  {
    id: 'saude_mental',
    title: '10. Apoio Social e Saúde Mental',
    questions: [
        { id: 'apoio_social', label: 'Você sente que pode contar com alguém em momentos difíceis?', type: 'radio', options: [{ label: 'Sempre', value: 'SEMPRE' }, { label: 'Às vezes', value: 'AS_VEZES' }, { label: 'Raramente', value: 'RARAMENTE' }, { label: 'Nunca', value: 'NUNCA' }] },
        { id: 'saude_mental_tristeza', label: 'Nos últimos 30 dias, você sentiu-se triste ou desanimado na maior parte do tempo?', type: 'radio', options: [{ label: 'Sim', value: 'SIM' }, { label: 'Não', value: 'NAO' }] },
    ],
  },
];