# ReBEC-Match — Aplicativo móvel (branch `frontend`)

Aplicativo do ReBEC-Match, feito em **React Native com Expo e TypeScript**. Ele conecta
voluntários a estudos clínicos registrados no ReBEC e atende os dois perfis da plataforma.

**Voluntário:**

- aceite dos Termos de Uso (LGPD) e cadastro;
- formulário de perfil de saúde, montado dinamicamente a partir da API;
- busca de estudos por doença, com sugestões do vocabulário DeCS/CID, filtro de compatibilidade
  por idade e sexo, estudos do mesmo estado primeiro e alertas de possível exclusão (gestação e
  tabagismo) a partir do formulário de perfil;
- candidatura e confirmação de convites;
- chat com o pesquisador após o _match_.

**Pesquisador:**

- cadastro e edição de estudos e critérios de elegibilidade;
- análise das candidaturas, com dados pseudonimizados e exportação em planilha;
- lista de voluntários com participação confirmada e chat.

**Comum aos dois perfis:** notificações, perfil, alteração de senha e exclusão da conta.

## Serviços utilizados

| Serviço                             | Branch         | Porta padrão |
| ----------------------------------- | -------------- | ------------ |
| API principal (Java/Spring Boot)    | `java-api`     | 8080         |
| Serviço de chat (Node.js/Socket.IO) | `chat-service` | 4000         |

## Configuração

```bash
npm install
cp .env.example .env
```

| Variável               | Descrição                                                            |
| ---------------------- | -------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`  | URL da API principal (no emulador Android: `http://10.0.2.2:8080`)   |
| `EXPO_PUBLIC_CHAT_URL` | URL do serviço de chat (no emulador Android: `http://10.0.2.2:4000`) |

## Execução

```bash
npx expo start
```

Verificações de código:

```bash
npm test               # testes automatizados (Jest + React Native Testing Library)
npx tsc --noEmit       # checagem de tipos
npx expo lint          # análise estática
npm run format:check   # formatação (Prettier); npm run format corrige
```

Os testes ficam em `__tests__/` e cobrem os utilitários (formatação, conversão do formulário de
estudo e feedback ao usuário), o cartão de estudo e os fluxos de análise de candidato, candidatura,
login e configurações da conta. As rotas, a API e a sessão são simuladas em cada teste.

## Estrutura

```
app/                 # telas (Expo Router): (public), (auth) e (protected)
components/          # reusable, researcherComponents e volunteerComponents
context/AuthContext  # sessão do usuário (token JWT no Expo SecureStore)
services/            # apiClient (API e chat), storage e preferências
types/               # tipos que espelham os DTOs da API
utils/               # formatação (status, idade, datas, CEP/UF) e montagem de payloads
```
