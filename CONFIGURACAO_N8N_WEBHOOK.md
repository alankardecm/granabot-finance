# 🔧 Guia de Configuração do Webhook n8n - GranaBot

## ✅ Informações Importantes

### Chave do Webhook Gerada:
```
5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa
```

### Endpoint do Backend:
```
http://localhost:3000/api/webhook/n8n/transactions
```

### Credenciais de Teste:
- **Email:** `fixed_user@example.com`
- **Senha:** `password123`

---

## 📋 Passo a Passo para Configurar no n8n

### 1️⃣ Abrir o n8n
- Acesse sua instância do n8n (geralmente `http://localhost:5678`)
- Faça login se necessário

### 2️⃣ Importar o Workflow
- Clique em **"Import from File"** ou **"Importar do Arquivo"**
- Selecione o arquivo: `Granabot- Telegram.json` (use este ao invés do Telegram-Webhook.json que está corrompido)
- Ou crie um novo workflow do zero se preferir

### 3️⃣ Localizar o Nó "Registrar"
- No canvas do workflow, procure pelo nó chamado **"Registrar"**
- Este é um nó do tipo **"HTTP Request"**
- Clique nele para abrir as configurações

### 4️⃣ Configurar o Nó HTTP Request "Registrar"

#### Configurações Básicas:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/webhook/n8n/transactions`
- **Authentication:** `None`

#### Headers (Cabeçalhos):
Adicione os seguintes headers:

1. **Content-Type**
   - Name: `Content-Type`
   - Value: `application/json`

2. **x-webhook-key** ⚠️ **IMPORTANTE**
   - Name: `x-webhook-key`
   - Value: `5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa`

#### Body Parameters (Parâmetros do Corpo):
Configure os seguintes campos (se não estiverem já configurados):

- **tipo:** `={{ $fromAI('tipo', 'Tipo se é "entrada" ou "saida"', 'string') }}`
- **descricao:** `={{ $fromAI('descricao', 'Descrição detalhada da transaçao', 'string') }}`
- **categoria:** `={{ $fromAI('categoria', 'Categoria da transação', 'string') }}`
- **valor:** `={{ $fromAI('valor', 'Valor da transação', 'number') }}`
- **data_lancamento:** `={{ $fromAI('data', 'Data do evento no formato: yyyy-mm-dd', 'string') }}`
- **esta_pago:** `={{ $fromAI('esta_pago', 'Se esta pago ou não: "true" ou "false"', 'boolean') }}`
- **identificador_externo:** `={{ $('identificador').item.json.codigo }}`

### 5️⃣ Salvar e Ativar
- Clique em **"Save"** ou **"Salvar"** no canto superior direito
- Ative o workflow clicando no toggle **"Active"** ou **"Ativo"**

---

## 🧪 Testar o Workflow

### Opção 1: Teste Manual no n8n
1. No workflow, clique em **"Execute Workflow"** ou **"Executar Workflow"**
2. Envie uma mensagem de teste simulando uma transação
3. Verifique se o nó "Registrar" executa sem erros
4. Confira no dashboard do frontend (`http://localhost:5173`) se a transação apareceu

### Opção 2: Teste via Telegram (se configurado)
1. Envie uma mensagem para o bot do Telegram
2. Exemplo: "Gastei 50 reais com almoço"
3. Verifique se a transação aparece no dashboard

### Opção 3: Teste Direto com cURL (para validar o endpoint)
```bash
curl -X POST http://localhost:3000/api/webhook/n8n/transactions \
  -H "Content-Type: application/json" \
  -H "x-webhook-key: 5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa" \
  -d '{
    "tipo": "saida",
    "descricao": "Teste via cURL",
    "categoria": "Teste",
    "valor": 25.50,
    "data_lancamento": "2025-11-19",
    "esta_pago": true,
    "identificador_externo": "TEST123"
  }'
```

---

## 🔍 Verificar se Funcionou

### No Backend (Terminal):
- Observe os logs do backend
- Você deve ver: `[WebhookController] Received webhook request`
- Seguido dos dados da transação

### No Frontend:
1. Acesse: `http://localhost:5173`
2. Faça login com:
   - Email: `fixed_user@example.com`
   - Senha: `password123`
3. Verifique a seção **"Últimos lançamentos"**
4. A transação deve aparecer na lista

---

## ❌ Troubleshooting (Resolução de Problemas)

### Erro: "Unauthorized" ou "Invalid webhook key"
- ✅ Verifique se a chave está correta no header `x-webhook-key`
- ✅ Confirme que não há espaços extras na chave
- ✅ A chave deve ser exatamente: `5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa`

### Erro: "Network Error" ou "Connection Refused"
- ✅ Verifique se o backend está rodando: `http://localhost:3000`
- ✅ Teste acessar: `http://localhost:3000/docs` (deve abrir o Swagger)

### Transação não aparece no Dashboard
- ✅ Verifique se você está logado com o usuário correto
- ✅ Recarregue a página do dashboard (F5)
- ✅ Verifique os logs do backend para confirmar que a transação foi criada

### Erro no Agente AI
- ✅ Verifique se as credenciais da OpenAI estão configuradas no n8n
- ✅ Confirme que o nó "Registrar" está conectado corretamente no workflow

---

## 📊 Status Atual do Projeto

✅ **Backend:** Rodando em `http://localhost:3000`  
✅ **Frontend:** Rodando em `http://localhost:5173`  
✅ **Database:** SQLite configurado e migrações aplicadas  
✅ **Webhook Endpoint:** Funcionando e testado  
✅ **Webhook Key:** Gerada e pronta para uso  
⏳ **n8n Workflow:** Aguardando configuração manual (este guia)

---

## 🎯 Próximos Passos Após Configuração

1. **Testar diferentes tipos de transações**
   - Receitas (entrada)
   - Despesas (saída)
   - Diferentes categorias

2. **Verificar a integração com o Telegram**
   - Configurar o bot do Telegram (se ainda não estiver)
   - Testar mensagens reais

3. **Explorar outras funcionalidades**
   - Relatórios
   - Filtros por categoria
   - Exportação de dados

---

## 📝 Notas Importantes

- O backend está configurado para aceitar requisições de `http://localhost:5173` (CORS)
- A chave do webhook é única para o usuário `fixed_user@example.com`
- Você pode gerar novas chaves na página de Settings do frontend
- O identificador externo é opcional mas recomendado para evitar duplicatas

---

**Data de Criação:** 2025-11-19  
**Última Atualização:** 2025-11-19 11:54
