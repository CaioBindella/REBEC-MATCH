-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TipoEspecifico" AS ENUM ('PESQUISADOR', 'VOLUNTARIO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "TipoQuestao" AS ENUM ('texto', 'opcoes');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "sobrenome" VARCHAR(50) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'USER',
    "tipo_especifico" "TipoEspecifico" NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "telefone" VARCHAR(25) NOT NULL,
    "endereco" VARCHAR(255) NOT NULL,
    "documento" VARCHAR(25) NOT NULL,
    "tester" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesquisador" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nomeFicticio" TEXT NOT NULL,

    CONSTRAINT "pesquisador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voluntario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "distancia" DOUBLE PRECISION NOT NULL,
    "nomeFicticio" TEXT NOT NULL,

    CONSTRAINT "voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "pesquisadorId" INTEGER NOT NULL,
    "codigoRegistro" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "informacoesGerais" TEXT NOT NULL,

    CONSTRAINT "estudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulario" (
    "id" SERIAL NOT NULL,
    "estudoId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto_para_resposta_livre" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questao" (
    "id" SERIAL NOT NULL,
    "formularioId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "TipoQuestao" NOT NULL,
    "opcoes" JSONB,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resposta" (
    "id" SERIAL NOT NULL,
    "voluntarioId" INTEGER NOT NULL,
    "busca_id" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "marcado" BOOLEAN NOT NULL,

    CONSTRAINT "resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "busca" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pesquisadorId" INTEGER NOT NULL,

    CONSTRAINT "busca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterio" (
    "id" SERIAL NOT NULL,
    "buscaId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncio" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "buscaId" INTEGER NOT NULL,

    CONSTRAINT "anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pesquisador_usuarioId_key" ON "pesquisador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "voluntario_usuarioId_key" ON "voluntario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "estudo_titulo_key" ON "estudo"("titulo");

-- AddForeignKey
ALTER TABLE "pesquisador" ADD CONSTRAINT "pesquisador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voluntario" ADD CONSTRAINT "voluntario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudo" ADD CONSTRAINT "estudo_pesquisadorId_fkey" FOREIGN KEY ("pesquisadorId") REFERENCES "pesquisador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulario" ADD CONSTRAINT "formulario_estudoId_fkey" FOREIGN KEY ("estudoId") REFERENCES "estudo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questao" ADD CONSTRAINT "questao_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "voluntario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_busca_id_fkey" FOREIGN KEY ("busca_id") REFERENCES "busca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "busca" ADD CONSTRAINT "busca_pesquisadorId_fkey" FOREIGN KEY ("pesquisadorId") REFERENCES "pesquisador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_buscaId_fkey" FOREIGN KEY ("buscaId") REFERENCES "busca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_buscaId_fkey" FOREIGN KEY ("buscaId") REFERENCES "busca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
