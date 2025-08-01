-- Arquivo de schema SQL compatível com MySQL

-- ---------------------------------
-- Criação das Tabelas
-- ---------------------------------

-- Tabela: usuario
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    tipo_especifico ENUM('PESQUISADOR', 'VOLUNTARIO') NOT NULL,
    sexo ENUM('MASCULINO', 'FEMININO', 'OUTRO') NOT NULL,
    data_nascimento TIMESTAMP NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    documento VARCHAR(25) NOT NULL,
    tester BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabela: pesquisador
CREATE TABLE pesquisador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    nome_ficticio VARCHAR(255) NOT NULL,
    CONSTRAINT fk_pesquisador_usuario FOREIGN KEY(usuario_id) REFERENCES usuario(id)
);

-- Tabela: voluntario
CREATE TABLE voluntario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    distancia DOUBLE PRECISION NOT NULL,
    nome_ficticio VARCHAR(255) NOT NULL,
    CONSTRAINT fk_voluntario_usuario FOREIGN KEY(usuario_id) REFERENCES usuario(id)
);

-- Tabela: estudo
CREATE TABLE estudo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    pesquisador_id INT NOT NULL,
    codigo_registro VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim DATETIME,
    informacoes_gerais TEXT,
    CONSTRAINT fk_estudo_pesquisador FOREIGN KEY(pesquisador_id) REFERENCES pesquisador(id)
);

-- Tabela: formulario
CREATE TABLE formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudo_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    texto_para_resposta_livre TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_formulario_estudo FOREIGN KEY(estudo_id) REFERENCES estudo(id)
);

-- Tabela: questao
CREATE TABLE questao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formulario_id INT NOT NULL,
    texto TEXT NOT NULL,
    tipo ENUM('texto', 'opcoes') NOT NULL,
    opcoes JSON,
    obrigatorio BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_questao_formulario FOREIGN KEY(formulario_id) REFERENCES formulario(id)
);

-- Tabela: busca
CREATE TABLE busca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    pesquisador_id INT NOT NULL,
    CONSTRAINT fk_busca_pesquisador FOREIGN KEY(pesquisador_id) REFERENCES pesquisador(id)
);

-- Tabela: criterio
CREATE TABLE criterio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    busca_id INT NOT NULL,
    texto TEXT NOT NULL,
    CONSTRAINT fk_criterio_busca FOREIGN KEY(busca_id) REFERENCES busca(id)
);

-- Tabela: anuncio
CREATE TABLE anuncio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_expiracao TIMESTAMP NOT NULL,
    busca_id INT NOT NULL,
    CONSTRAINT fk_anuncio_busca FOREIGN KEY(busca_id) REFERENCES busca(id)
);

-- Tabela: resposta
CREATE TABLE resposta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voluntario_id INT NOT NULL,
    busca_id INT NOT NULL,
    questao_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    marcado BOOLEAN NOT NULL,
    CONSTRAINT fk_resposta_voluntario FOREIGN KEY(voluntario_id) REFERENCES voluntario(id),
    CONSTRAINT fk_resposta_busca FOREIGN KEY(busca_id) REFERENCES busca(id),
    CONSTRAINT fk_resposta_questao FOREIGN KEY(questao_id) REFERENCES questao(id)
);