#!/bin/sh

# Aborta o script se qualquer comando falhar
set -e

# Executa as migrações do Prisma. O 'deploy' é mais indicado para ambientes automatizados.
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

# Inicia o processo principal (o comando que inicia o servidor)
echo "Iniciando o servidor..."
exec "$@"