-- 1. Alterar a tabela para permitir Formulários Globais (sem estudo vinculado)
ALTER TABLE formulario MODIFY COLUMN estudo_id INT NULL;

-- 2. Criar o Formulário de Perfil (ID 1) sem estudo e sem pesquisador
INSERT INTO formulario (id, titulo, data_criacao)
VALUES (1, 'Formulário de Perfil Inicial', CURDATE())
    ON DUPLICATE KEY UPDATE id=id;

-- 3. Inserir as Questões (Usando os tipos do Enum Java: TEXTO e OPCOES)

-- Seção 1: Dados Pessoais
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (1, 1, 'Data de nascimento', 'TEXTO', 1),
                                                                      (2, 1, 'Idade (em anos)', 'TEXTO', 1),
                                                                      (3, 1, 'Sexo biológico', 'OPCOES', 1),
                                                                      (4, 1, 'Identidade de gênero', 'OPCOES', 1),
                                                                      (5, 1, 'Estado civil', 'OPCOES', 1);

-- Seção 2: Etnia/Raça
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
    (6, 1, 'Cor ou raça autodeclarada', 'OPCOES', 1);

-- Seção 3: Escolaridade
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
    (7, 1, 'Grau de instrução (mais alto concluído)', 'OPCOES', 1);

-- Seção 4: Ocupação e Renda
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (8, 1, 'Situação de trabalho atual', 'OPCOES', 1),
                                                                      (9, 1, 'Profissão (se aplicável)', 'TEXTO', 0),
                                                                      (10, 1, 'Renda familiar mensal', 'OPCOES', 1);

-- Seção 5: Condições de Moradia
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (11, 1, 'Tipo de moradia', 'OPCOES', 1),
                                                                      (12, 1, 'Quantas pessoas moram na mesma casa?', 'TEXTO', 1),
                                                                      (13, 1, 'Acesso a água encanada', 'OPCOES', 1),
                                                                      (14, 1, 'Acesso a esgotamento sanitário', 'OPCOES', 1),
                                                                      (15, 1, 'Acesso a coleta de lixo regular', 'OPCOES', 1),
                                                                      (16, 1, 'Acesso a eletricidade', 'OPCOES', 1);

-- Seção 6: Outras Informações
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (17, 1, 'Nacionalidade', 'TEXTO', 1),
                                                                      (18, 1, 'País de nascimento', 'TEXTO', 1),
                                                                      (19, 1, 'Religião (se desejar informar)', 'TEXTO', 0),
                                                                      (20, 1, 'Língua principal falada em casa', 'TEXTO', 1);

-- Seção 7: Acesso e Inclusão
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (21, 1, 'Possui acesso regular à internet?', 'OPCOES', 1),
                                                                      (22, 1, 'Possui telefone celular com WhatsApp?', 'OPCOES', 1),
                                                                      (23, 1, 'Você já participou de algum estudo clínico?', 'OPCOES', 1);

-- Seção 9: Estilo de Vida
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (24, 1, 'Você pratica atividade física regularmente?', 'OPCOES', 1),
                                                                      (25, 1, 'Você fuma atualmente?', 'OPCOES', 1),
                                                                      (26, 1, 'Você consome bebidas alcoólicas?', 'OPCOES', 1),
                                                                      (27, 1, 'Você é gestante?', 'OPCOES', 1),
                                                                      (28, 1, 'Como você avaliaria sua saúde geral?', 'OPCOES', 1);

-- Seção 10: Saúde Mental
INSERT INTO questao (id, formulario_id, texto, tipo, obrigatorio) VALUES
                                                                      (29, 1, 'Você sente que pode contar com alguém em momentos difíceis?', 'OPCOES', 1),
                                                                      (30, 1, 'Nos últimos 30 dias, você sentiu-se triste ou desanimado?', 'OPCOES', 1);