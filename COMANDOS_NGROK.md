# 🚀 Comandos para Configurar o Ngrok

## ⚙️ Passo 1: Configurar o Authtoken

Abra o PowerShell na pasta onde está o `ngrok.exe` e execute:

```powershell
.\ngrok.exe config add-authtoken 35hpHMvaRZPlFoaqbpYUoqoLN5W_7rJwrQSV2KgrKD2YKPNSF
```

Você verá uma mensagem de sucesso:
```
Authtoken saved to configuration file: C:\Users\Alan Moreira\.ngrok2\ngrok.yml
```

## 🚀 Passo 2: Iniciar o Túnel

Com o backend rodando (já está!), execute:

```powershell
.\ngrok.exe http 3000
```

## ✅ Passo 3: Copiar a URL

Você verá algo assim:

```
ngrok                                                                   

Session Status                online
Account                       Alan Moreira (Plan: Free)
Version                       3.22.1
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-xyz.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**COPIE** a URL que aparece em "Forwarding" (exemplo: `https://abc123-xyz.ngrok-free.app`)

## 🔧 Passo 4: Configurar no n8n

1. Acesse seu workflow: https://n8n.srv1121163.hstgr.cloud/workflow/c7zOXePENLGsL43K/345cd9

2. Localize o nó **"Registrar"** (HTTP Request)

3. Configure:
   - **Method:** POST
   - **URL:** `https://SUA-URL-NGROK.ngrok-free.app/api/webhook/n8n/transactions`
   - **Headers:**
     - `Content-Type`: `application/json`
     - `x-webhook-key`: `5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa`

4. Salve o workflow

## 🧪 Passo 5: Testar

1. Execute o workflow no n8n
2. Verifique no terminal do ngrok se a requisição chegou
3. Abra http://127.0.0.1:4040 para ver detalhes
4. Verifique no dashboard: http://localhost:5173

---

## 📋 Checklist Rápido

- [ ] Executar: `.\ngrok.exe config add-authtoken 35hpHMvaRZPlFoaqbpYUoqoLN5W_7rJwrQSV2KgrKD2YKPNSF`
- [ ] Executar: `.\ngrok.exe http 3000`
- [ ] Copiar URL do ngrok
- [ ] Atualizar URL no n8n
- [ ] Testar workflow
- [ ] Verificar transação no dashboard

---

**Pronto para começar!** 🚀
