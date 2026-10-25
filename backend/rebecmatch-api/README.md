# ReBEC-Match — API principal

API REST em Java 21 / Spring Boot 3.5.4 responsável por autenticação, regras de negócio
(estudos, critérios, formulários, candidaturas, compatibilidade e notificações) e pela
importação automatizada dos ensaios do ReBEC/ICTRP.

## Configuração

As credenciais nunca ficam no código nem no repositório. Copie o modelo e preencha:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DB_URL` | não | URL JDBC (padrão `jdbc:mysql://localhost:3306/match_v2`) |
| `DB_USERNAME` / `DB_PASSWORD` | sim | Credenciais do MySQL/MariaDB |
| `API_SECURITY_TOKEN_SECRET` | sim | Segredo de assinatura dos JWT (mínimo 32 caracteres). O serviço de chat usa o mesmo valor em `JWT_SECRET` |
| `API_SECURITY_TOKEN_EXPIRATION_HOURS` | não | Validade do token (padrão 1 hora) |
| `REBEC_IMPORT_ON_STARTUP` | não | Importa o extrato ao iniciar (padrão `true`) |
| `REBEC_IMPORT_CRON` | não | Agendamento da importação (padrão: domingo 00:00) |
| `REBEC_XML_URL` | não | Endereço do extrato `RBR-ictrp-ALL.xml` |

O arquivo `.env` é lido automaticamente pela aplicação; variáveis de ambiente do sistema têm precedência.

## Execução

```bash
./mvnw spring-boot:run
```

O esquema do banco é criado e evoluído pelas migrações Flyway (`src/main/resources/db/migration`,
V2 a V12), incluindo a carga do vocabulário controlado de doenças (V11) e o formulário de perfil
com seções e opções de resposta (V12). O Hibernate apenas valida
o mapeamento (`ddl-auto=validate`).

Com Docker (MySQL 8, API e phpMyAdmin), a partir da pasta raiz do repositório:

```bash
docker compose --env-file rebecmatch-api/.env up --build
```

## Testes

```bash
./mvnw test
```

Testes unitários (elegibilidade, normalizações, CEP, JWT) e de integração sobre a API completa
(fluxo de candidatura e match, regras de acesso, importação do XML), executados em banco H2 em memória.
