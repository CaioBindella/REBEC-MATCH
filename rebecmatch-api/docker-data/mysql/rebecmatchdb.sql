-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20-Ago-2025 às 20:06
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
-- Banco de dados: `rebecmatchdb`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `anuncio`
--

CREATE TABLE `anuncio` (
  `id` int(11) NOT NULL,
  `mensagem` text NOT NULL,
  `data_expiracao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `busca_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `anuncio`
--

INSERT INTO `anuncio` (`id`, `mensagem`, `data_expiracao`, `busca_id`) VALUES
(1, 'Procuram-se voluntários com diagnóstico de enxaqueca para participar em novo estudo clínico na região de São Paulo. Ajude a ciência a avançar!', '2026-01-01 05:59:59', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `busca`
--

CREATE TABLE `busca` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `pesquisador_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `busca`
--

INSERT INTO `busca` (`id`, `nome`, `pesquisador_id`) VALUES
(1, 'Busca por Voluntários com Enxaqueca Crônica - SP', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `criterio`
--

CREATE TABLE `criterio` (
  `id` int(11) NOT NULL,
  `busca_id` int(11) NOT NULL,
  `texto` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `criterio`
--

INSERT INTO `criterio` (`id`, `busca_id`, `texto`) VALUES
(1, 1, 'Deve ter diagnóstico de enxaqueca crônica há mais de 2 anos.'),
(2, 1, 'Não deve estar a participar noutros estudos clínicos.');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estudo`
--

CREATE TABLE `estudo` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `pesquisador_id` int(11) NOT NULL,
  `codigo_registro` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `data_inicio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_fim` datetime DEFAULT NULL,
  `informacoes_gerais` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `estudo`
--

INSERT INTO `estudo` (`id`, `titulo`, `pesquisador_id`, `codigo_registro`, `status`, `data_inicio`, `data_fim`, `informacoes_gerais`) VALUES
(1, 'Estudo sobre Eficácia de Novo Medicamento para Enxaqueca', 1, 'REBEC-XYZ-987', 'EM_ANDAMENTO', '2025-08-10 15:00:00', '2026-08-10 21:00:00', 'Este estudo visa avaliar a redução na frequência de crises de enxaqueca em pacientes que utilizam o novo composto experimental X.');

-- --------------------------------------------------------

--
-- Estrutura da tabela `flyway_schema_history`
--

CREATE TABLE `flyway_schema_history` (
  `installed_rank` int(11) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int(11) DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `execution_time` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `flyway_schema_history`
--

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '1', 'RebecMatch-schema', 'SQL', 'V1__RebecMatch-schema.sql', -1751048691, 'root', '2025-08-07 19:47:38', 160, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `formulario`
--

CREATE TABLE `formulario` (
  `id` int(11) NOT NULL,
  `estudo_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `texto_para_resposta_livre` text DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `formulario`
--

INSERT INTO `formulario` (`id`, `estudo_id`, `titulo`, `texto_para_resposta_livre`, `data_criacao`) VALUES
(1, 1, 'Questionário de Triagem de Pacientes', 'Descreva brevemente o seu historial com enxaquecas.', '2025-08-07 23:06:08');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pesquisador`
--

CREATE TABLE `pesquisador` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nome_ficticio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `pesquisador`
--

INSERT INTO `pesquisador` (`id`, `usuario_id`, `nome_ficticio`) VALUES
(1, 1, 'PS_RJ2343');

-- --------------------------------------------------------

--
-- Estrutura da tabela `questao`
--

CREATE TABLE `questao` (
  `id` int(11) NOT NULL,
  `formulario_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `tipo` enum('TEXTO','OPCOES') NOT NULL,
  `opcoes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`opcoes`)),
  `obrigatorio` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `questao`
--

INSERT INTO `questao` (`id`, `formulario_id`, `texto`, `tipo`, `opcoes`, `obrigatorio`) VALUES
(1, 1, 'Há quanto tempo você sofre de enxaquecas (em anos)?', 'TEXTO', NULL, 1),
(2, 1, 'Com que frequência você tem crises de enxaqueca?', 'OPCOES', '[\"Diariamente\", \"Semanalmente\", \"Mensalmente\", \"Raramente\"]', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `resposta`
--

CREATE TABLE `resposta` (
  `id` int(11) NOT NULL,
  `voluntario_id` int(11) NOT NULL,
  `busca_id` int(11) NOT NULL,
  `questao_id` int(11) NOT NULL,
  `conteudo` text NOT NULL,
  `marcado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `sobrenome` varchar(50) NOT NULL,
  `login` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `tipo_especifico` enum('PESQUISADOR','VOLUNTARIO') NOT NULL,
  `sexo` enum('MASCULINO','FEMININO','OUTRO') NOT NULL,
  `data_nascimento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `telefone` varchar(25) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `documento` varchar(25) NOT NULL,
  `tester` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `sobrenome`, `login`, `email`, `senha`, `tipo`, `tipo_especifico`, `sexo`, `data_nascimento`, `telefone`, `endereco`, `documento`, `tester`) VALUES
(1, 'Ana', 'Souza', 'ana.souza', 'ana.souza@institutopesquisa.br', '$2a$10$DnyG/XmOTRzKQKmxYLoXr.R87LaB8r1l9pWxaLmCGlJlGe5ZJ1DNu', 'USER', 'PESQUISADOR', 'FEMININO', '1985-10-20 16:00:00', '(11) 91234-5678', 'Rua da Pesquisa, 789 - São Paulo/SP', '987.654.321-10', 0),
(2, 'Carlos', 'Almeida', 'carlos.almeida', 'carlos.almeida@universidade.edu', '$2a$10$hJImEaAXSqO93NdMG9MMH.6Df0UOVaZQdImd6plEQvRNbFntKFEEG', 'USER', 'VOLUNTARIO', 'MASCULINO', '1992-07-15 20:30:00', '(21) 99876-5432', 'Avenida das Ciências, 456 - Rio de Janeiro/RJ', '123.456.789-00', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `voluntario`
--

CREATE TABLE `voluntario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `distancia` double NOT NULL,
  `nome_ficticio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `anuncio`
--
ALTER TABLE `anuncio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_anuncio_busca` (`busca_id`);

--
-- Índices para tabela `busca`
--
ALTER TABLE `busca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_busca_pesquisador` (`pesquisador_id`);

--
-- Índices para tabela `criterio`
--
ALTER TABLE `criterio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_criterio_busca` (`busca_id`);

--
-- Índices para tabela `estudo`
--
ALTER TABLE `estudo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `titulo` (`titulo`),
  ADD KEY `fk_estudo_pesquisador` (`pesquisador_id`);

--
-- Índices para tabela `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- Índices para tabela `formulario`
--
ALTER TABLE `formulario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_formulario_estudo` (`estudo_id`);

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
  ADD KEY `fk_questao_formulario` (`formulario_id`);

--
-- Índices para tabela `resposta`
--
ALTER TABLE `resposta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_resposta_voluntario` (`voluntario_id`),
  ADD KEY `fk_resposta_busca` (`busca_id`),
  ADD KEY `fk_resposta_questao` (`questao_id`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

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
-- AUTO_INCREMENT de tabela `anuncio`
--
ALTER TABLE `anuncio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `busca`
--
ALTER TABLE `busca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `criterio`
--
ALTER TABLE `criterio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `estudo`
--
ALTER TABLE `estudo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `formulario`
--
ALTER TABLE `formulario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pesquisador`
--
ALTER TABLE `pesquisador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `questao`
--
ALTER TABLE `questao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `resposta`
--
ALTER TABLE `resposta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `voluntario`
--
ALTER TABLE `voluntario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `anuncio`
--
ALTER TABLE `anuncio`
  ADD CONSTRAINT `fk_anuncio_busca` FOREIGN KEY (`busca_id`) REFERENCES `busca` (`id`);

--
-- Limitadores para a tabela `busca`
--
ALTER TABLE `busca`
  ADD CONSTRAINT `fk_busca_pesquisador` FOREIGN KEY (`pesquisador_id`) REFERENCES `pesquisador` (`id`);

--
-- Limitadores para a tabela `criterio`
--
ALTER TABLE `criterio`
  ADD CONSTRAINT `fk_criterio_busca` FOREIGN KEY (`busca_id`) REFERENCES `busca` (`id`);

--
-- Limitadores para a tabela `estudo`
--
ALTER TABLE `estudo`
  ADD CONSTRAINT `fk_estudo_pesquisador` FOREIGN KEY (`pesquisador_id`) REFERENCES `pesquisador` (`id`);

--
-- Limitadores para a tabela `formulario`
--
ALTER TABLE `formulario`
  ADD CONSTRAINT `fk_formulario_estudo` FOREIGN KEY (`estudo_id`) REFERENCES `estudo` (`id`);

--
-- Limitadores para a tabela `pesquisador`
--
ALTER TABLE `pesquisador`
  ADD CONSTRAINT `fk_pesquisador_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `questao`
--
ALTER TABLE `questao`
  ADD CONSTRAINT `fk_questao_formulario` FOREIGN KEY (`formulario_id`) REFERENCES `formulario` (`id`);

--
-- Limitadores para a tabela `resposta`
--
ALTER TABLE `resposta`
  ADD CONSTRAINT `fk_resposta_busca` FOREIGN KEY (`busca_id`) REFERENCES `busca` (`id`),
  ADD CONSTRAINT `fk_resposta_questao` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`),
  ADD CONSTRAINT `fk_resposta_voluntario` FOREIGN KEY (`voluntario_id`) REFERENCES `voluntario` (`id`);

--
-- Limitadores para a tabela `voluntario`
--
ALTER TABLE `voluntario`
  ADD CONSTRAINT `fk_voluntario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
