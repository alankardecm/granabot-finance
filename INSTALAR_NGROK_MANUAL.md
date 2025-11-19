# 🚀 Instalação Rápida do Ngrok - Manual

## 📥 Passo 1: Baixar o Ngrok

1. Acesse: https://ngrok.com/download
2. Clique em **"Download for Windows"** (64-bit)
3. Salve o arquivo `ngrok.zip`

## 📂 Passo 2: Extrair

1. Extraia o arquivo `ngrok.zip`
2. Você terá um arquivo `ngrok.exe`
3. Mova para uma pasta fácil, exemplo:
   - `C:\ngrok\ngrok.exe`
   - Ou deixe na pasta Downloads mesmo

## 🔑 Passo 3: Obter seu Authtoken

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita (pode usar Google/GitHub)
3. Após login, vá em: https://dashboard.ngrok.com/get-started/your-authtoken
4. **COPIE** o token que aparece (algo como: `2abc123def456...`)

## ⚙️ Passo 4: Configurar o Authtoken

Abra o PowerShell na pasta onde está o `ngrok.exe` e execute:

```powershell
.\ngrok.exe config add-authtoken SEU_TOKEN_AQUI
```

Substitua `SEU_TOKEN_AQUI` pelo token que você copiou.

## 🚀 Passo 5: Iniciar o Túnel

Com o backend rodando em `localhost:3000`, execute:

```powershell
.\ngrok.exe http 3000
```

## ✅ Passo 6: Copiar a URL

Você verá algo assim:

```
Session Status                online
Account                       seu_email@example.com
Version                       3.22.1
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

**COPIE** a URL que aparece em "Forwarding", exemplo:
```
https://abc123.ngrok-free.app
```

## 🔧 Passo 7: Usar no n8n

No seu workflow n8n:
1. Acesse: https://n8n.srv1121163.hstgr.cloud/workflow/c7zOXePENLGsL43K/345cd9
2. Localize o nó "Registrar" (HTTP Request)
3. Mude a URL para:
   ```
   https://abc123.ngrok-free.app/api/webhook/n8n/transactions
   ```
4. Mantenha o header:
   - `x-webhook-key`: `5816954c6982154a3f95fb31c1c11ef97c2308a14d9423194d6a0b6b281485fa`

## 🎯 Passo 8: Testar

1. Execute o workflow no n8n
2. Verifique se a transação aparece no dashboard: http://localhost:5173

## 🔍 Monitorar Requisições

Abra no navegador: http://127.0.0.1:4040

Você verá TODAS as requisições que chegam no seu backend em tempo real!

---

## ⚡ Comandos Resumidos

```powershell
# 1. Configurar token (primeira vez)
.\ngrok.exe config add-authtoken SEU_TOKEN

# 2. Iniciar túnel (sempre que for usar)
.\ngrok.exe http 3000

# 3. Copiar a URL "Forwarding" e usar no n8n
```

---

## ⚠️ Importante

- A URL muda toda vez que você reinicia o ngrok (versão gratuita)
- Mantenha o terminal do ngrok aberto enquanto estiver testando
- Se fechar, a URL para de funcionar

---

**Próximo:** Após configurar, me avise e eu te ajudo a testar! 🚀
