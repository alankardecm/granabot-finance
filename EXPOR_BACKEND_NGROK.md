# 🌐 Expor Backend Local com Ngrok para n8n Cloud

## 📥 1. Instalar o Ngrok

### Windows (via Chocolatey):
```bash
choco install ngrok
```

### Ou baixe diretamente:
- Acesse: https://ngrok.com/download
- Baixe o executável para Windows
- Extraia e coloque em uma pasta (ex: `C:\ngrok`)

## 🔑 2. Configurar Ngrok (Primeira vez)

1. Crie uma conta gratuita em: https://dashboard.ngrok.com/signup
2. Copie seu authtoken em: https://dashboard.ngrok.com/get-started/your-authtoken
3. Execute no terminal:

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

## 🚀 3. Iniciar o Túnel

Com o backend rodando em `localhost:3000`, execute:

```bash
ngrok http 3000
```

Você verá algo assim:
```
Session Status                online
Account                       seu_email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

## 📋 4. Copiar a URL Pública

A URL que você precisa é a que aparece em **"Forwarding"**, exemplo:
```
https://abc123.ngrok-free.app
```

⚠️ **IMPORTANTE:** Esta URL muda toda vez que você reinicia o ngrok (na versão gratuita)

## 🔧 5. Configurar no n8n

No seu workflow n8n (`https://n8n.srv1121163.hstgr.cloud/workflow/c7zOXePENLGsL43K/345cd9`):

### No nó "Registrar" (HTTP Request):

**URL:** Substitua `http://localhost:3000` por sua URL do ngrok:
```
https://abc123.ngrok-free.app/api/webhook/n8n/transactions
```

**Headers:**
- `Content-Type`: `application/json`
- `x-webhook-key`: `5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa`

**Body Parameters:** (mantém os mesmos)
- tipo, descricao, categoria, valor, data_lancamento, esta_pago, identificador_externo

## ✅ 6. Testar

1. Com o ngrok rodando
2. Com o backend rodando (`npm run start:dev`)
3. Execute o workflow no n8n
4. Verifique se a transação aparece no dashboard local

## 🔍 7. Monitorar Requisições

O ngrok oferece uma interface web para ver todas as requisições:
```
http://127.0.0.1:4040
```

Abra no navegador para ver:
- Todas as requisições recebidas
- Headers
- Body
- Respostas

## ⚠️ Limitações da Versão Gratuita

- URL muda a cada reinicialização
- Limite de 40 conexões/minuto
- Sessão expira após 2 horas de inatividade

## 💡 Dica: Manter o Ngrok Rodando

Deixe o terminal do ngrok aberto enquanto estiver testando. Se fechar, a URL para de funcionar.

---

## 🔄 Alternativa: Ngrok com Domínio Fixo (Pago)

Se precisar de uma URL permanente:
- Plano Pro do ngrok: ~$8/mês
- Você terá um domínio fixo tipo: `seu-app.ngrok.io`

---

## 📝 Resumo dos Comandos

```bash
# 1. Instalar (primeira vez)
choco install ngrok

# 2. Configurar token (primeira vez)
ngrok config add-authtoken SEU_TOKEN

# 3. Iniciar túnel (sempre que for testar)
ngrok http 3000

# 4. Copiar a URL "Forwarding" e usar no n8n
```

---

**Data:** 2025-11-19 14:01
