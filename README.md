# ReBEC-Match — Serviço de chat (branch `chat-service`)

Serviço de mensagens entre voluntário e pesquisador, feito em **Node.js com Express, TypeScript e
Socket.IO**. Ele usa o mesmo banco MySQL/MariaDB da API principal (branch `java-api`), cujas
migrações Flyway definem a tabela `mensagem`.

## Regras

- **Autenticação:** o token JWT emitido pela API principal no login é validado com o mesmo segredo
  e o mesmo emissor, e o usuário é identificado pelo seu login.
- **Autoria:** o autor da mensagem é sempre o usuário autenticado.
- **Acesso:** a conversa só é liberada entre o voluntário e o pesquisador responsável por um estudo
  cuja candidatura foi concluída, ou seja, com *match* confirmado pelas duas partes.
- **Tempo real:** cada mensagem é entregue via Socket.IO aos dois participantes. O token é validado
  na conexão e cada usuário entra na própria sala.
- **Leitura e notificação:** a data de leitura é registrada quando o destinatário abre a conversa,
  e uma notificação "Nova Mensagem" é criada para ele.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/mensagens` | Envia uma mensagem: `{ leitorId, estudoId, conteudo }` |
| `GET` | `/mensagens/:estudoId/:usuario1/:usuario2` | Histórico da conversa no estudo |
| Socket.IO | evento `nova-mensagem` | Mensagem entregue em tempo real |

## Configuração e execução

```bash
npm install
cp .env.example .env      # JWT_SECRET deve ser igual a API_SECURITY_TOKEN_SECRET da API
npm run dev               # desenvolvimento (ts-node-dev)
npm run build && npm start   # produção
```
