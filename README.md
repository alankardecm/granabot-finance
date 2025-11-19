# GranaBot Finance Web

Aplicação SaaS multi-tenant com backend em NestJS/Prisma e frontend React/Vite para controle financeiro integrado ao n8n.

## Requisitos
- Node.js 20+
- npm 10+
- Docker (opcional para subir Postgres/Backend via compose)

## Backend
1. `cd backend`
2. `cp .env.example .env` e ajuste as variáveis (DATABASE_URL, JWT_SECRET, etc.).
3. Instale dependências: `npm install`
4. Gere o cliente Prisma e aplique migrações: `npx prisma generate && npx prisma migrate dev`
5. Ambiente local: `npm run start:dev` (Swagger em `http://localhost:3000/docs`).

### Testando webhook do n8n
```bash
curl -X POST http://localhost:3000/api/webhook/n8n/transactions \
  -H "Content-Type: application/json" \
  -H "x-webhook-key: SUA_CHAVE" \
  -d '{
    "tipo": "despesa",
    "descricao": "Almoço",
    "categoria": "Alimentação",
    "valor": 89.9,
    "data_lancamento": "2025-01-15",
    "esta_pago": true,
    "identificador_externo": "n8n-123"
  }'
```

## Frontend
1. `cd frontend`
2. `cp .env.example .env` e confirme a URL do backend (`VITE_API_BASE_URL`).
3. `npm install`
4. `npm run dev` (Vite em `http://localhost:5173`).

## Docker Compose
O arquivo `docker-compose.yml` provisiona Postgres e o backend. Para usar:
```bash
docker compose up --build
```
Isso expõe o Postgres em `5432` e o backend em `3000` com as variáveis definidas no compose.

## Scripts principais
- Backend
  - `npm run prisma:migrate` – aplica migrações no banco definido no `.env`.
  - `npm run start:prod` – usa a build do Nest (utilizado no container).
- Frontend
  - `npm run build` – build de produção.
  - `npm run preview` – pré-visualização da build.

## Estrutura resumida
- `backend/src/modules` contém módulos de Auth, Accounts, Transactions, Webhook, Reports e Integrations.
- `backend/prisma` define models (User, Account, Transaction, WebhookKey, IntegrationConfig, PasswordResetToken).
- `frontend/src/pages` oferece Login/Registro, Dashboard, Extrato e Configurações, consumindo a API via React Query.
