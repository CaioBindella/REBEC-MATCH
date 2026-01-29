-- 1. Criar um Usuário "Admin" para ser o dono do estudo de perfil (caso não exista)
INSERT INTO usuario (id, nome, email, senha, tipo_especifico)
VALUES (9999, 'Sistema', 'admin@rebecmatch.com', 'sistema123', 'PESQUISADOR')
    ON DUPLICATE KEY UPDATE id=id;

-- 2. Criar o perfil de Pesquisador para esse usuário
INSERT INTO pesquisador (id, usuario_id, nome_ficticio)
VALUES (9999, 9999, 'Administrador do Sistema')
    ON DUPLICATE KEY UPDATE id=id;

-- 3. Criar o Estudo "Cadastro de Perfil" (Necessário para vincular o formulário)
INSERT INTO estudo (id, pesquisador_id, public_title, scientific_title, recruitment_status, study_type, phase, date_registration, trial_id, url, primary_sponsor, hc_freetext, i_freetext)
VALUES (9999, 9999, 'Perfil Geral do Voluntário', 'Coleta de dados sociodemográficos e de saúde para match', 'ATIVO', 'OBSERVACIONAL', 'N/A', CURDATE(), 'REBEC-PROFILE-001', 'N/A', 'ReBEC Match', 'N/A', 'N/A')
    ON DUPLICATE KEY UPDATE id=id;

-- 4. Criar o Formulário ID 1 (Este é o que estava faltando!)
INSERT INTO formulario (id, estudo_id, titulo, data_criacao)
VALUES (1, 9999, 'Formulário de Perfil Inicial', CURDATE())
    ON DUPLICATE KEY UPDATE id=id;

-- 5. Inserir as Questões (IDs 1 a 30 conforme o formConfig.ts do Frontend)

-- Seção 1: Dados Pessoais
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (1, 1, 'Data de nascimento', 'TEXT', 1),
                                                                      (2, 1, 'Idade (em anos)', 'TEXT', 1),
                                                                      (3, 1, 'Sexo biológico', 'RADIO', 1),
                                                                      (4, 1, 'Identidade de gênero', 'RADIO', 1),
                                                                      (5, 1, 'Estado civil', 'RADIO', 1);

-- Seção 2: Etnia/Raça
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
    (6, 1, 'Cor ou raça autodeclarada', 'RADIO', 1);

-- Seção 3: Escolaridade
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
    (7, 1, 'Grau de instrução (mais alto concluído)', 'RADIO', 1);

-- Seção 4: Ocupação e Renda
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (8, 1, 'Situação de trabalho atual', 'RADIO', 1),
                                                                      (9, 1, 'Profissão (se aplicável)', 'TEXT', 0),
                                                                      (10, 1, 'Renda familiar mensal', 'RADIO', 1);

-- Seção 5: Condições de Moradia
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (11, 1, 'Tipo de moradia', 'RADIO', 1),
                                                                      (12, 1, 'Quantas pessoas moram na mesma casa?', 'TEXT', 1),
                                                                      (13, 1, 'Acesso a água encanada', 'RADIO', 1),
                                                                      (14, 1, 'Acesso a esgotamento sanitário', 'RADIO', 1),
                                                                      (15, 1, 'Acesso a coleta de lixo regular', 'RADIO', 1),
                                                                      (16, 1, 'Acesso a eletricidade', 'RADIO', 1);

-- Seção 6: Outras Informações
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (17, 1, 'Nacionalidade', 'TEXT', 1),
                                                                      (18, 1, 'País de nascimento', 'TEXT', 1),
                                                                      (19, 1, 'Religião (se desejar informar)', 'TEXT', 0),
                                                                      (20, 1, 'Língua principal falada em casa', 'TEXT', 1);

-- Seção 7: Acesso e Inclusão
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (21, 1, 'Possui acesso regular à internet?', 'RADIO', 1),
                                                                      (22, 1, 'Possui telefone celular com WhatsApp?', 'RADIO', 1),
                                                                      (23, 1, 'Você já participou de algum estudo clínico?', 'RADIO', 1);

-- Seção 9: Estilo de Vida
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (24, 1, 'Você pratica atividade física regularmente?', 'RADIO', 1),
                                                                      (25, 1, 'Você fuma atualmente?', 'RADIO', 1),
                                                                      (26, 1, 'Você consome bebidas alcoólicas?', 'RADIO', 1),
                                                                      (27, 1, 'Você é gestante?', 'RADIO', 1),
                                                                      (28, 1, 'Como você avaliaria sua saúde geral?', 'RADIO', 1);

-- Seção 10: Saúde Mental
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (29, 1, 'Você sente que pode contar com alguém em momentos difíceis?', 'RADIO', 1),
                                                                      (30, 1, 'Nos últimos 30 dias, você sentiu-se triste ou desanimado?', 'RADIO', 1);