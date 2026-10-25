CREATE TABLE doencas (
                         id BIGINT AUTO_INCREMENT NOT NULL,
                         codigo VARCHAR(255) NOT NULL,
                         nome_cientifico TEXT,
                         nome_popular TEXT,
                         vocabulario VARCHAR(255),
                         CONSTRAINT pk_doencas PRIMARY KEY (id)
);

ALTER TABLE doencas ADD CONSTRAINT uc_doencas_codigo UNIQUE (codigo);

CREATE TABLE estudo_doenca (
                               doenca_id BIGINT NOT NULL,
                               estudo_id INT NOT NULL,
                               CONSTRAINT pk_estudo_doenca PRIMARY KEY (doenca_id, estudo_id)
);

ALTER TABLE estudo_doenca ADD CONSTRAINT fk_estudoe_on_doenca FOREIGN KEY (doenca_id) REFERENCES doencas (id);

ALTER TABLE estudo_doenca ADD CONSTRAINT fk_estudoe_on_estudo FOREIGN KEY (estudo_id) REFERENCES estudo (id);

ALTER TABLE estudo MODIFY scientific_title TEXT;
ALTER TABLE estudo MODIFY public_title TEXT;

ALTER TABLE estudo MODIFY hc_freetext TEXT;
ALTER TABLE estudo MODIFY i_freetext TEXT;