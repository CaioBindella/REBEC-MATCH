CREATE TABLE notificacoes (
                              id INTEGER AUTO_INCREMENT PRIMARY KEY,
                              usuario_id INTEGER NOT NULL,
                              titulo VARCHAR(255),
                              mensagem TEXT,
                              tipo VARCHAR(50) DEFAULT 'info',
                              lida BOOLEAN DEFAULT FALSE,
                              data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_notificacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);