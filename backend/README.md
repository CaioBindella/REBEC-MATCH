# ReBEC-Match — API principal (branch `java-api`)

O ReBEC-Match é uma plataforma móvel que aproxima voluntários de estudos clínicos registrados no
**Registro Brasileiro de Ensaios Clínicos (ReBEC)**. Esta branch contém a **API principal**, em
Java 21 com Spring Boot 3.5.4. Ela cuida de:

- autenticação com JWT;
- cadastro de usuários, estudos, critérios e formulários;
- fluxo de candidatura com confirmação mútua (*match*);
- compatibilidade automática por idade e sexo;
- notificações;
- importação automatizada do extrato ReBEC/ICTRP.

## Componentes do sistema

| Branch | Componente | Tecnologia |
|---|---|---|
| `java-api` | API principal (esta branch) | Java 21, Spring Boot, JPA/Hibernate, Flyway |
| `frontend` | Aplicativo móvel | React Native, Expo, TypeScript |
| `chat-service` | Serviço de mensagens | Node.js, Express, Socket.IO |
| `xml` | Extrato `RBR-ictrp-ALL.xml` consumido pela importação | XML (formato ICTRP) |

Todos os componentes usam o mesmo banco MySQL/MariaDB. O esquema é versionado pelas migrações
Flyway desta API.

## Estrutura

```
.
├── docker-compose.yml        # MySQL 8 + API + phpMyAdmin para desenvolvimento
└── rebecmatch-api/           # projeto Maven da API
    ├── src/main/java/...     # controller, service, repository, entity, dto, exception, config
    ├── src/main/resources/
    │   ├── application.properties    # sem segredos: tudo vem de variáveis de ambiente
    │   └── db/migration/             # migrações Flyway V2 a V12
    ├── src/test/java/...     # testes unitários e de integração
    └── .env.example          # modelo das variáveis de ambiente
```

## Como executar

```bash
cd rebecmatch-api
cp .env.example .env      # preencha DB_PASSWORD e API_SECURITY_TOKEN_SECRET
./mvnw spring-boot:run
```

Ou, com Docker, a partir desta pasta:

```bash
docker compose --env-file rebecmatch-api/.env up --build
```

Os testes rodam com `./mvnw test`, dentro de `rebecmatch-api/`. A documentação completa da API,
com as variáveis de ambiente e as migrações, está em [`rebecmatch-api/README.md`](rebecmatch-api/README.md).
