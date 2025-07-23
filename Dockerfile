# 1. Imagem base
FROM node:20-alpine

# 2. Diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia os arquivos de dependência e instala (isso otimiza o cache do Docker)
COPY package*.json ./
RUN npm install

# 4. Copia o resto do código da aplicação
COPY . .

# 5. Copia o script de inicialização e dá permissão de execução
COPY docker-entrypoint.sh .
RUN chmod +x /app/docker-entrypoint.sh

# 6. Define o script como o ponto de entrada
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# 7. Comando padrão que será executado pelo entrypoint
CMD ["npm", "run", "dev"]