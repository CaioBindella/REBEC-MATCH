-- Iniciar a transação para garantir a integridade do banco de dados.
START TRANSACTION;

--
-- Tabela `tag`
--
-- Esta tabela irá armazenar os vocabulários controlados (DeCS, etc.)
-- que serão usados para classificar os estudos e os interesses dos voluntários.
-- A estrutura é baseada no arquivo .xlsx fornecido.
--
CREATE TABLE `tag` (
                       `id` INT(11) NOT NULL AUTO_INCREMENT,
                       `text` VARCHAR(255) NOT NULL,
                       `aspects` VARCHAR(100) NULL,
                       `vocabularies` VARCHAR(50) NULL,
                       `versions` VARCHAR(50) NULL,
                       `levels` VARCHAR(50) NULL,
                       `codes` VARCHAR(255) NULL,
                       `nomes_populares` TEXT NULL,
                       PRIMARY KEY (`id`),
                       UNIQUE KEY `idx_text_vocabularies` (`text`, `vocabularies`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tabela de Associação `estudo_tag`
--
-- Cria a relação muitos-para-muitos entre as tabelas `estudo` e `tag`.
-- Permite que um estudo tenha múltiplas tags.
--
CREATE TABLE `estudo_tag` (
                              `estudo_id` INT(11) NOT NULL,
                              `tag_id` INT(11) NOT NULL,
                              PRIMARY KEY (`estudo_id`, `tag_id`),
                              CONSTRAINT `fk_estudo_tag_estudo` FOREIGN KEY (`estudo_id`) REFERENCES `estudo` (`id`) ON DELETE CASCADE,
                              CONSTRAINT `fk_estudo_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tabela de Associação `voluntario_interesse_tag`
--
-- Cria a relação muitos-para-muitos entre `voluntario` e `tag`.
-- Permite que um voluntário selecione múltiplas áreas de interesse (tags).
--
CREATE TABLE `voluntario_interesse_tag` (
                                            `voluntario_id` INT(11) NOT NULL,
                                            `tag_id` INT(11) NOT NULL,
                                            PRIMARY KEY (`voluntario_id`, `tag_id`),
                                            CONSTRAINT `fk_voluntario_interesse_voluntario` FOREIGN KEY (`voluntario_id`) REFERENCES `voluntario` (`id`) ON DELETE CASCADE,
                                            CONSTRAINT `fk_voluntario_interesse_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Finalizar a transação.
COMMIT;