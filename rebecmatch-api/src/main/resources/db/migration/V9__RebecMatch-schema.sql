-- Adiciona a coluna estudo_id
ALTER TABLE mensagem ADD COLUMN estudo_id INT;

-- Adiciona a chave estrangeira (opcional, mas recomendado para integridade)
ALTER TABLE mensagem ADD CONSTRAINT fk_mensagem_estudo FOREIGN KEY (estudo_id) REFERENCES estudo(id) ON DELETE CASCADE;