-- V10: normalizacao de dados importados, remocao de tabelas sem uso e integridade referencial.

-- 1. Sexo elegivel: converte os codigos da ICTRP ("F", "M", "-", "B") para o mesmo dominio
--    do enum Sexo da aplicacao (FEMININO, MASCULINO) e AMBOS para "sem restricao".
UPDATE criterio
SET gender = CASE UPPER(TRIM(gender))
                 WHEN 'F' THEN 'FEMININO'
                 WHEN 'FEMALE' THEN 'FEMININO'
                 WHEN 'FEMININO' THEN 'FEMININO'
                 WHEN 'M' THEN 'MASCULINO'
                 WHEN 'MALE' THEN 'MASCULINO'
                 WHEN 'MASCULINO' THEN 'MASCULINO'
                 ELSE 'AMBOS'
             END;

-- 2. Status de recrutamento: o extrato mistura "Recruiting" e "recruiting".
--    Mantem-se o rotulo ICTRP com apenas a inicial maiuscula.
UPDATE estudo
SET recruitment_status = CONCAT(UPPER(SUBSTRING(TRIM(recruitment_status), 1, 1)),
                                LOWER(SUBSTRING(TRIM(recruitment_status), 2)))
WHERE recruitment_status IS NOT NULL AND TRIM(recruitment_status) <> '';

-- 3. Tabelas criadas na V4 para um vocabulario de "tags", substituidas pelas tabelas
--    doencas/estudo_doenca (V5) e nunca mapeadas pela aplicacao.
DROP TABLE IF EXISTS voluntario_interesse_tag;
DROP TABLE IF EXISTS estudo_tag;
DROP TABLE IF EXISTS tag;

-- 4. Uma candidatura por voluntario e estudo (remove eventuais duplicatas antes da restricao).
DELETE c1 FROM candidatura c1
    JOIN candidatura c2
      ON c1.voluntario_id = c2.voluntario_id
     AND c1.estudo_id = c2.estudo_id
     AND c1.id > c2.id;
ALTER TABLE candidatura
    ADD CONSTRAINT uk_candidatura_voluntario_estudo UNIQUE (voluntario_id, estudo_id);

-- 5. Exclusao em cascata: a remocao de uma conta (direito de exclusao previsto na LGPD)
--    ou de um estudo remove os registros dependentes em vez de ser bloqueada pelas chaves.
ALTER TABLE resposta DROP FOREIGN KEY resposta_ibfk_1;
ALTER TABLE resposta DROP FOREIGN KEY resposta_ibfk_3;
ALTER TABLE resposta
    ADD CONSTRAINT fk_resposta_voluntario FOREIGN KEY (voluntario_id) REFERENCES voluntario (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_resposta_questao FOREIGN KEY (questao_id) REFERENCES questao (id) ON DELETE CASCADE;

ALTER TABLE candidatura DROP FOREIGN KEY candidatura_ibfk_1;
ALTER TABLE candidatura DROP FOREIGN KEY candidatura_ibfk_2;
ALTER TABLE candidatura
    ADD CONSTRAINT fk_candidatura_voluntario FOREIGN KEY (voluntario_id) REFERENCES voluntario (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_candidatura_estudo FOREIGN KEY (estudo_id) REFERENCES estudo (id) ON DELETE CASCADE;

ALTER TABLE notificacoes DROP FOREIGN KEY fk_notificacoes_usuario;
ALTER TABLE notificacoes
    ADD CONSTRAINT fk_notificacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE;

ALTER TABLE mensagem DROP FOREIGN KEY mensagem_ibfk_1;
ALTER TABLE mensagem DROP FOREIGN KEY mensagem_ibfk_2;
ALTER TABLE mensagem
    ADD CONSTRAINT fk_mensagem_autor FOREIGN KEY (autor_id) REFERENCES usuario (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_mensagem_leitor FOREIGN KEY (leitor_id) REFERENCES usuario (id) ON DELETE CASCADE;

ALTER TABLE estudo DROP FOREIGN KEY estudo_ibfk_1;
ALTER TABLE estudo
    ADD CONSTRAINT fk_estudo_pesquisador FOREIGN KEY (pesquisador_id) REFERENCES pesquisador (id) ON DELETE CASCADE;

ALTER TABLE criterio DROP FOREIGN KEY criterio_ibfk_1;
ALTER TABLE criterio
    ADD CONSTRAINT fk_criterio_estudo FOREIGN KEY (estudo_id) REFERENCES estudo (id) ON DELETE CASCADE;

ALTER TABLE formulario DROP FOREIGN KEY formulario_ibfk_1;
ALTER TABLE formulario
    ADD CONSTRAINT fk_formulario_estudo FOREIGN KEY (estudo_id) REFERENCES estudo (id) ON DELETE CASCADE;

ALTER TABLE questao DROP FOREIGN KEY questao_ibfk_1;
ALTER TABLE questao
    ADD CONSTRAINT fk_questao_formulario FOREIGN KEY (formulario_id) REFERENCES formulario (id) ON DELETE CASCADE;

ALTER TABLE estudo_doenca DROP FOREIGN KEY fk_estudoe_on_estudo;
ALTER TABLE estudo_doenca DROP FOREIGN KEY fk_estudoe_on_doenca;
ALTER TABLE estudo_doenca
    ADD CONSTRAINT fk_estudo_doenca_estudo FOREIGN KEY (estudo_id) REFERENCES estudo (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_estudo_doenca_doenca FOREIGN KEY (doenca_id) REFERENCES doencas (id) ON DELETE CASCADE;
