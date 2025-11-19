# 🚀 Deploy do GranaBot Finance Web

## 🎯 Estratégia Recomendada

### Frontend → Netlify ✅
### Backend → Render/Railway ✅

---

## 📱 FRONTEND (React/Vite) → NETLIFY

### ✅ Por que Netlify para o Frontend?
- ✅ Gratuito para projetos pessoais
- ✅ Deploy automático via Git
- ✅ CDN global (super rápido)
- ✅ HTTPS automático
- ✅ Perfeito para React/Vite
- ✅ Builds automáticos

### 📋 Passo a Passo - Deploy Frontend no Netlify

#### 1. Preparar o Frontend

Crie o arquivo `netlify.toml` na pasta `frontend/`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 2. Atualizar `.env` de Produção

Crie `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://seu-backend.onrender.com/api
```

⚠️ **Importante:** Você vai substituir `seu-backend.onrender.com` pela URL real do backend depois

#### 3. Deploy no Netlify

**Opção A: Via Interface Web (Mais Fácil)**

1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte seu repositório Git (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Adicione a variável de ambiente:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://seu-backend.onrender.com/api`
6. Clique em **"Deploy"**

**Opção B: Via Netlify CLI**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Na pasta frontend
cd frontend

# Deploy
netlify deploy --prod
```

#### 4. Configurar Domínio (Opcional)

- Netlify fornece um domínio gratuito: `seu-app.netlify.app`
- Ou configure seu próprio domínio customizado

---

## 🖥️ BACKEND (NestJS) → RENDER ou RAILWAY

### ❌ Por que NÃO Netlify para Backend?

Netlify é para:
- Sites estáticos
- Funções serverless (limitadas)

NestJS precisa de:
- Servidor Node.js rodando 24/7
- Conexões persistentes
- WebSockets (se usar)
- Banco de dados

### ✅ Alternativas para o Backend:

| Plataforma | Gratuito? | Pros | Contras |
|------------|-----------|------|---------|
| **Render** | ✅ Sim (750h/mês) | Fácil, PostgreSQL grátis | Sleep após 15min inatividade |
| **Railway** | ✅ Sim ($5 crédito) | Muito fácil, rápido | Crédito limitado |
| **Heroku** | ❌ Não mais | - | Plano gratuito acabou |
| **Fly.io** | ✅ Sim (limitado) | Bom, global | Mais complexo |
| **Vercel** | ⚠️ Parcial | Serverless functions | Não ideal para NestJS |

---

## 🚀 OPÇÃO RECOMENDADA: Render

### 📋 Deploy Backend no Render

#### 1. Preparar o Backend

Crie `backend/render.yaml`:

```yaml
services:
  - type: web
    name: granabot-backend
    env: node
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: WEB_APP_URL
        sync: false

databases:
  - name: granabot-db
    databaseName: granabot
    user: granabot
```

#### 2. Atualizar `package.json` do Backend

Adicione o script de produção:

```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

#### 3. Deploy no Render

1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Configure:
   - **Name:** `granabot-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
5. Adicione variáveis de ambiente:
   - `DATABASE_URL` (do PostgreSQL do Render)
   - `JWT_SECRET` (gere um aleatório)
   - `JWT_REFRESH_SECRET` (gere outro aleatório)
   - `WEB_APP_URL` (URL do Netlify do frontend)
6. Clique em **"Create Web Service"**

#### 4. Criar Banco de Dados PostgreSQL

1. No Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `granabot-db`
   - **Database:** `granabot`
   - **User:** `granabot`
3. Copie a **Internal Database URL**
4. Cole em `DATABASE_URL` do Web Service

---

## 🔄 Fluxo Completo de Deploy

### 1️⃣ Deploy do Backend (Render)
```bash
# Commit e push para Git
git add .
git commit -m "Prepare for production"
git push
```

Render detecta e faz deploy automático

### 2️⃣ Obter URL do Backend
Exemplo: `https://granabot-backend.onrender.com`

### 3️⃣ Atualizar Frontend
```bash
# frontend/.env.production
VITE_API_BASE_URL=https://granabot-backend.onrender.com/api
```

### 4️⃣ Deploy do Frontend (Netlify)
```bash
cd frontend
netlify deploy --prod
```

### 5️⃣ Atualizar CORS no Backend
```typescript
// backend/src/main.ts
const allowedOrigins = [
  process.env.WEB_APP_URL || 'http://localhost:5173',
  'https://seu-app.netlify.app', // Adicione a URL do Netlify
];
```

### 6️⃣ Atualizar Variável no Render
- `WEB_APP_URL=https://seu-app.netlify.app`

---

## 💰 Custos (Plano Gratuito)

### Netlify (Frontend)
- ✅ **100% Gratuito**
- 100GB bandwidth/mês
- 300 build minutes/mês

### Render (Backend)
- ✅ **Gratuito com limitações:**
  - 750 horas/mês (suficiente para 1 app)
  - Sleep após 15min inatividade
  - Acorda em ~30s na primeira requisição
  - PostgreSQL: 90 dias de retenção

### Custo Total: **R$ 0,00/mês** 🎉

---

## ⚡ Alternativa RÁPIDA para Testes: Ngrok

Se você só quer testar o n8n AGORA:

```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: Ngrok
ngrok http 3000

# Copie a URL do ngrok e use no n8n
```

Depois você faz o deploy "de verdade" no Render + Netlify.

---

## 📝 Checklist de Deploy

### Backend (Render):
- [ ] Criar conta no Render
- [ ] Conectar repositório Git
- [ ] Criar PostgreSQL database
- [ ] Configurar variáveis de ambiente
- [ ] Deploy automático
- [ ] Testar endpoint: `https://seu-backend.onrender.com/docs`

### Frontend (Netlify):
- [ ] Criar `netlify.toml`
- [ ] Criar `.env.production` com URL do backend
- [ ] Criar conta no Netlify
- [ ] Conectar repositório Git
- [ ] Deploy automático
- [ ] Testar: `https://seu-app.netlify.app`

### Integração:
- [ ] Atualizar CORS no backend
- [ ] Atualizar `WEB_APP_URL` no Render
- [ ] Gerar nova webhook key no frontend de produção
- [ ] Atualizar webhook key no n8n
- [ ] Testar fluxo completo

---

## 🎯 Recomendação Final

**Para AGORA (Testar n8n):**
```bash
ngrok http 3000
# Use a URL no n8n
```

**Para PRODUÇÃO (Depois):**
- Frontend → Netlify
- Backend → Render
- Database → PostgreSQL do Render

---

**Data:** 2025-11-19 14:03
