# ReBEC-Match

Plataforma móvel para otimizar o recrutamento de voluntários em pesquisas clínicas no Brasil.
Ela é construída sobre o acervo público do **Registro Brasileiro de Ensaios Clínicos (ReBEC)**.

Trabalho de Conclusão de Curso de Engenharia de Computação — Instituto Politécnico da UERJ
(Nova Friburgo), de Caio Nogueira Bindella.

## Funcionalidades

- **Importação automatizada** dos ensaios do ReBEC no formato da ICTRP, com classificação pelo
  vocabulário controlado DeCS/CID-10.
- **Busca de estudos por doença**, pelo nome popular ou científico.
- **Compatibilidade automática** por regras sobre os critérios estruturados (idade e sexo).
- **Candidatura com confirmação mútua (*match*):** o pesquisador aprova e o voluntário confirma.
  Só então o chat é liberado.
- **Privacidade (LGPD):** pseudonimização por nome fictício, compartilhamento dos dados de perfil
  apenas com o pesquisador do estudo candidatado e exclusão da conta pelo próprio usuário.
- **Chat em tempo real** entre voluntário e pesquisador e central de notificações.

## Estrutura do repositório

Esta branch (`main`) reúne todo o código do projeto. Cada componente também tem a sua branch
própria, onde é desenvolvido:

| Pasta | Branch | Componente | Tecnologias |
|---|---|---|---|
| [`backend/`](backend) | `java-api` | API principal: autenticação, regras de negócio e importação | Java 21, Spring Boot 3.5, JPA/Hibernate, Flyway, MySQL/MariaDB |
| [`frontend/`](frontend) | `frontend` | Aplicativo móvel para voluntários e pesquisadores | React Native, Expo, TypeScript |
| [`chat-service/`](chat-service) | `chat-service` | Serviço de mensagens | Node.js, Express, Socket.IO |
| [`doencas/`](doencas) | `doencas` | Geração e carga do vocabulário de doenças | Python, pandas |
| — | `xml` | Extrato `RBR-ictrp-ALL.xml` consumido pela importação | XML (ICTRP) |

```
App (React Native/Expo)
   ├── REST ──────────► API principal (Spring Boot :8080) ──┐
   └── REST/Socket.IO ► Serviço de chat (Node.js :4000) ────┤
                                                            ▼
                                                 MySQL/MariaDB
                  (esquema versionado pelas migrações Flyway da API)
```

## Como executar

1. **Banco e API**, em `backend/`:
   ```bash
   cd backend/rebecmatch-api
   cp .env.example .env          # DB_PASSWORD e API_SECURITY_TOKEN_SECRET
   ./mvnw spring-boot:run        # cria o esquema (Flyway) e importa os estudos
   ```
   Para subir MySQL, API e phpMyAdmin com Docker, rode a partir de `backend/`:
   `docker compose --env-file rebecmatch-api/.env up --build`.

2. **Serviço de chat**, em `chat-service/`:
   ```bash
   npm install
   cp .env.example .env          # JWT_SECRET = mesmo valor de API_SECURITY_TOKEN_SECRET
   npm run dev
   ```

3. **Aplicativo**, em `frontend/`:
   ```bash
   npm install
   cp .env.example .env          # URLs da API e do chat
   npx expo start
   ```

Cada pasta tem o próprio README, com os detalhes de configuração.

## Testes

```bash
cd backend/rebecmatch-api && ./mvnw test        # testes unitários e de integração da API
cd frontend && npx tsc --noEmit && npx expo lint
```
