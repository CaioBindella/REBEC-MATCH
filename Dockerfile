# --- 1. Estágio de Build (Builder) ---
# Usamos a imagem oficial do Node.js (versão 18-alpine é leve)
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de gerenciamento de dependências
# (Assumindo que você usa npm)
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para o build)
RUN npm install

# Copia todo o resto do código-fonte da sua aplicação
COPY . .

# Executa o script de build do Next.js
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
# Começamos de uma imagem alpine limpa para um tamanho final menor
FROM node:18-alpine AS runner

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia os arquivos gerados pelo 'output: standalone' do estágio 'builder'
# Isso inclui apenas o necessário para rodar a aplicação em produção
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copia a pasta 'public' (para imagens, fontes, etc.)
COPY --from=builder /app/public ./public

# Expõe a porta em que o Next.js irá rodar (padrão 3000)
EXPOSE 3000

# O comando para iniciar o servidor Next.js otimizado
# O 'server.js' é criado automaticamente pelo build 'standalone'
CMD ["node", "server.js"]