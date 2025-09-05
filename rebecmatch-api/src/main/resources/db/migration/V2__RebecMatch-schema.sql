-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 29-Ago-2025 às 00:14
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `match_v2`
--

-- --------------------------------------------------------
--
-- Estrutura da tabela `criterio`
--

CREATE TABLE `criterio` (
                            `id` int(11) NOT NULL,
                            `inclusion_criteria` text NOT NULL,
                            `agemin` varchar(20) NOT NULL,
                            `agemax` varchar(20) NOT NULL,
                            `gender` varchar(20) NOT NULL,
                            `exclusion_criteria` text NOT NULL,
                            `estudo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estudo`
--

CREATE TABLE `estudo` (
                          `id` int(11) NOT NULL,
                          `pesquisador_id` int(11) NOT NULL,
                          `public_title` varchar(255) NOT NULL,
                          `scientific_title` varchar(255) NOT NULL,
                          `recruitment_status` varchar(255) NOT NULL,
                          `study_type` varchar(255) NOT NULL,
                          `phase` varchar(255) NOT NULL,
                          `date_registration` date NOT NULL,
                          `date_enrolment` date DEFAULT NULL,
                          `url` text NOT NULL,
                          `primary_sponsor` varchar(255) NOT NULL,
                          `hc_freetext` varchar(255) NOT NULL,
                          `i_freetext` MEDIUMTEXT NOT NULL,
                          `approval_date` varchar(255) DEFAULT NULL,
                          `sec_id` varchar(255) DEFAULT NULL,
                          `trial_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `formulario`
--

CREATE TABLE `formulario` (
                              `id` int(11) NOT NULL,
                              `estudo_id` int(11) NOT NULL,
                              `titulo` varchar(255) DEFAULT NULL,
                              `texto_para_resposta_livre` varchar(255) DEFAULT NULL,
                              `data_criacao` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mensagem`
--

CREATE TABLE `mensagem` (
                            `id` int(11) NOT NULL,
                            `autor_id` int(11) NOT NULL,
                            `leitor_id` int(11) NOT NULL,
                            `conteudo` varchar(255) DEFAULT NULL,
                            `data_envio` datetime DEFAULT NULL,
                            `data_leitura` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pesquisador`
--

CREATE TABLE `pesquisador` (
                               `id` int(11) NOT NULL,
                               `usuario_id` int(11) NOT NULL,
                               `nome_ficticio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `questao`
--

CREATE TABLE `questao` (
                           `id` int(11) NOT NULL,
                           `formulario_id` int(11) NOT NULL,
                           `texto` varchar(255) DEFAULT NULL,
                           `tipo` varchar(255) DEFAULT NULL,
                           `opcoes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`opcoes`)),
                           `obrigatorio` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `resposta`
--

CREATE TABLE `resposta` (
                            `id` int(11) NOT NULL,
                            `voluntario_id` int(11) NOT NULL,
                            `questao_id` int(11) NOT NULL,
                            `conteudo` varchar(255) DEFAULT NULL,
                            `marcado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
                           `id` int(11) NOT NULL,
                           `tipo_especifico` varchar(255) DEFAULT NULL,
                           `login` varchar(255) DEFAULT NULL,
                           `email` varchar(255) NOT NULL,
                           `senha` varchar(255) NOT NULL,
                           `nome` varchar(255) DEFAULT NULL,
                           `sobrenome` varchar(255) DEFAULT NULL,
                           `sexo` varchar(255) DEFAULT NULL,
                           `data_nascimento` date DEFAULT NULL,
                           `telefone` varchar(255) DEFAULT NULL,
                           `cep` varchar(255) DEFAULT NULL,
                           `endereco` varchar(255) DEFAULT NULL,
                           `documento` varchar(255) DEFAULT NULL,
                           `tester` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `voluntario`
--

CREATE TABLE `voluntario` (
                              `id` int(11) NOT NULL,
                              `usuario_id` int(11) NOT NULL,
                              `distancia` float DEFAULT NULL,
                              `nome_ficticio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--
--
-- Índices para tabela `criterio`
--
ALTER TABLE `criterio`
    ADD PRIMARY KEY (`id`),
  ADD KEY `estudo_id` (`estudo_id`);

--
-- Índices para tabela `estudo`
--
ALTER TABLE `estudo`
    ADD PRIMARY KEY (`id`),
  ADD KEY `pesquisador_id` (`pesquisador_id`);

--
-- Índices para tabela `formulario`
--
ALTER TABLE `formulario`
    ADD PRIMARY KEY (`id`),
  ADD KEY `estudo_id` (`estudo_id`);

--
-- Índices para tabela `mensagem`
--
ALTER TABLE `mensagem`
    ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`),
  ADD KEY `leitor_id` (`leitor_id`);

--
-- Índices para tabela `pesquisador`
--
ALTER TABLE `pesquisador`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Índices para tabela `questao`
--
ALTER TABLE `questao`
    ADD PRIMARY KEY (`id`),
  ADD KEY `formulario_id` (`formulario_id`);

--
-- Índices para tabela `resposta`
--
ALTER TABLE `resposta`
    ADD PRIMARY KEY (`id`),
  ADD KEY `voluntario_id` (`voluntario_id`),
  ADD KEY `questao_id` (`questao_id`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Índices para tabela `voluntario`
--
ALTER TABLE `voluntario`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--


--
-- AUTO_INCREMENT de tabela `criterio`
--
ALTER TABLE `criterio`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estudo`
--
ALTER TABLE `estudo`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `formulario`
--
ALTER TABLE `formulario`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mensagem`
--
ALTER TABLE `mensagem`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pesquisador`
--
ALTER TABLE `pesquisador`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `questao`
--
ALTER TABLE `questao`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `resposta`
--
ALTER TABLE `resposta`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `voluntario`
--
ALTER TABLE `voluntario`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `criterio`
--
ALTER TABLE `criterio`
    ADD CONSTRAINT `criterio_ibfk_1` FOREIGN KEY (`estudo_id`) REFERENCES `estudo` (`id`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `estudo`
--
ALTER TABLE `estudo`
    ADD CONSTRAINT `estudo_ibfk_1` FOREIGN KEY (`pesquisador_id`) REFERENCES `pesquisador` (`id`);

--
-- Limitadores para a tabela `formulario`
--
ALTER TABLE `formulario`
    ADD CONSTRAINT `formulario_ibfk_1` FOREIGN KEY (`estudo_id`) REFERENCES `estudo` (`id`);

--
-- Limitadores para a tabela `mensagem`
--
ALTER TABLE `mensagem`
    ADD CONSTRAINT `mensagem_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `mensagem_ibfk_2` FOREIGN KEY (`leitor_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `pesquisador`
--
ALTER TABLE `pesquisador`
    ADD CONSTRAINT `pesquisador_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `questao`
--
ALTER TABLE `questao`
    ADD CONSTRAINT `questao_ibfk_1` FOREIGN KEY (`formulario_id`) REFERENCES `formulario` (`id`);

--
-- Limitadores para a tabela `resposta`
--
ALTER TABLE `resposta`
    ADD CONSTRAINT `resposta_ibfk_1` FOREIGN KEY (`voluntario_id`) REFERENCES `voluntario` (`id`),
  ADD CONSTRAINT `resposta_ibfk_3` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`);

--
-- Limitadores para a tabela `voluntario`
--
ALTER TABLE `voluntario`
    ADD CONSTRAINT `voluntario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

-- Criar a nova tabela para armazenar os resultados dos matches
CREATE TABLE `match_result` (
                                `id` INT AUTO_INCREMENT PRIMARY KEY,
                                `voluntario_id` INT NOT NULL,
                                `estudo_id` INT NOT NULL,
                                `criterios_atendidos` INT NOT NULL,
                                `data_match` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT `fk_match_voluntario` FOREIGN KEY (`voluntario_id`) REFERENCES `voluntario` (`id`) ON DELETE CASCADE,
                                CONSTRAINT `fk_match_estudo` FOREIGN KEY (`estudo_id`) REFERENCES `estudo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
