-- V12: formulário de perfil totalmente definido no banco e ajustes da tabela de mensagens.

-- 1. Seção temática de cada questão, usada pelo aplicativo para agrupar o formulário.
ALTER TABLE questao ADD COLUMN secao VARCHAR(100) NULL;

-- 2. Seções e opções (JSON) das 30 questões do formulário de perfil inicial (V8).
--    O aplicativo renderiza o formulário a partir destes registros, sem questões fixas no código.
UPDATE questao SET secao = '1. Dados Pessoais' WHERE formulario_id = 1 AND id BETWEEN 1 AND 5;
UPDATE questao SET secao = '2. Etnia/Raça' WHERE formulario_id = 1 AND id = 6;
UPDATE questao SET secao = '3. Escolaridade' WHERE formulario_id = 1 AND id = 7;
UPDATE questao SET secao = '4. Ocupação e Renda' WHERE formulario_id = 1 AND id BETWEEN 8 AND 10;
UPDATE questao SET secao = '5. Condições de Moradia' WHERE formulario_id = 1 AND id BETWEEN 11 AND 16;
UPDATE questao SET secao = '6. Outras Informações' WHERE formulario_id = 1 AND id BETWEEN 17 AND 20;
UPDATE questao SET secao = '7. Acesso e Inclusão Social' WHERE formulario_id = 1 AND id BETWEEN 21 AND 23;
UPDATE questao SET secao = '8. Estilo de Vida' WHERE formulario_id = 1 AND id BETWEEN 24 AND 28;
UPDATE questao SET secao = '9. Apoio Social e Saúde Mental' WHERE formulario_id = 1 AND id BETWEEN 29 AND 30;

UPDATE questao SET opcoes = '["Masculino", "Feminino", "Outro", "Prefere não responder"]' WHERE id = 3 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Cisgênero", "Transgênero", "Não-binário", "Outro", "Prefere não responder"]' WHERE id = 4 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Solteiro(a)", "Casado(a) / União estável", "Separado(a) / Divorciado(a)", "Viúvo(a)"]' WHERE id = 5 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Branca", "Preta", "Parda", "Amarela", "Indígena", "Prefere não responder"]' WHERE id = 6 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sem instrução formal", "Ensino fundamental incompleto", "Ensino fundamental completo", "Ensino médio incompleto", "Ensino médio completo", "Ensino superior incompleto", "Ensino superior completo", "Pós-graduação"]' WHERE id = 7 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Empregado(a) com carteira assinada", "Autônomo(a)", "Desempregado(a)", "Estudante", "Aposentado(a)", "Dona(o) de casa", "Outro"]' WHERE id = 8 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sem renda", "Até 1 salário mínimo", "1 a 2 salários mínimos", "2 a 5 salários mínimos", "5 a 10 salários mínimos", "Acima de 10 salários mínimos", "Prefere não responder"]' WHERE id = 10 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Própria", "Alugada", "Cedida", "Outra"]' WHERE id = 11 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sim", "Não"]' WHERE formulario_id = 1 AND id IN (13, 14, 15, 16, 21, 22, 24, 27, 30);
UPDATE questao SET opcoes = '["Sim", "Não", "Não sabe / Não lembra"]' WHERE id = 23 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sim", "Não", "Já fumou, mas parou"]' WHERE id = 25 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sim", "Não", "Raramente"]' WHERE id = 26 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Excelente", "Boa", "Regular", "Ruim", "Muito ruim"]' WHERE id = 28 AND formulario_id = 1;
UPDATE questao SET opcoes = '["Sempre", "Às vezes", "Raramente", "Nunca"]' WHERE id = 29 AND formulario_id = 1;

-- 3. Mensagens do chat: conteúdo sem o limite de 255 caracteres e data/hora de leitura
--    (preenchida pelo serviço de chat quando o destinatário abre a conversa).
UPDATE mensagem SET conteudo = '' WHERE conteudo IS NULL;
ALTER TABLE mensagem MODIFY conteudo TEXT NOT NULL;
ALTER TABLE mensagem MODIFY data_leitura DATETIME NULL;
