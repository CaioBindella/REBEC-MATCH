FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

RUN npm run build  # Se você compilar TS para JS (senão, remova)

EXPOSE 3002

CMD ["npm", "run", "start"]

