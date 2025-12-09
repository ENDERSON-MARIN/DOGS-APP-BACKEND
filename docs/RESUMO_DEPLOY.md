# 🎯 Resumo: Deploy na Vercel

## ⚡ Resposta Rápida

**SIM!** O arquivo `index.js` precisa estar dentro da pasta `api/` para funcionar na Vercel.

## 📁 Estrutura Necessária

```
✅ CORRETO (Funciona na Vercel)
backend/
├── api/
│   └── index.js          ← Entry point para Vercel
├── src/
│   └── app.js
├── vercel.json
└── index.js              ← Entry point local (npm start)

❌ ERRADO (Não funciona na Vercel)
backend/
├── src/
│   └── app.js
├── vercel.json
└── index.js              ← Vercel não encontra
```

## 🔑 Arquivos Principais

### 1️⃣ `api/index.js` (Vercel)

```javascript
const app = require("../src/app.js");
const { database } = require("../src/db.js");

database.sync({ force: false });

module.exports = app; // ← Exporta para Vercel
```

### 2️⃣ `index.js` (Local)

```javascript
const server = require("./src/app.js");
const { database } = require("./src/db.js");

const PORT = process.env.PORT || 3001;

database.sync({ force: false }).then(() => {
  server.listen(PORT); // ← Inicia servidor local
});
```

### 3️⃣ `vercel.json`

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

## 🎯 Diferenças Chave

| Aspecto         | Local (`index.js`)    | Vercel (`api/index.js`) |
| --------------- | --------------------- | ----------------------- |
| **Localização** | Raiz do projeto       | Pasta `api/`            |
| **Execução**    | `npm start`           | Automático (Vercel)     |
| **Servidor**    | `server.listen(3001)` | Sem `listen()`          |
| **Export**      | Não exporta           | `module.exports = app`  |
| **Ambiente**    | Development           | Production              |

## 🚀 Comandos para Deploy

```bash
# 1. Criar estrutura
mkdir api
# (api/index.js já foi criado)

# 2. Commit
git add .
git commit -m "feat: adicionar estrutura api para vercel"
git push

# 3. Deploy
vercel --prod

# 4. Testar
curl https://sua-api.vercel.app/api/dogs
```

## ✅ Checklist Rápido

- [x] Pasta `api/` criada
- [x] `api/index.js` criado
- [x] `vercel.json` configurado
- [ ] Variáveis de ambiente na Vercel
- [ ] Deploy realizado
- [ ] Endpoints testados

## 🔗 Documentação Completa

- **ESTRUTURA_VERCEL.md** - Explicação detalhada
- **DEPLOY.md** - Guia passo a passo
- **CHECKLIST_DEPLOY.md** - Checklist completo
- **TROUBLESHOOTING.md** - Solução de problemas

## 💡 Dica Final

A pasta `api/` é uma convenção da Vercel para **Serverless Functions**. Qualquer arquivo dentro de `api/` vira automaticamente um endpoint serverless.

```
api/
├── index.js        → https://sua-api.vercel.app/
├── hello.js        → https://sua-api.vercel.app/api/hello
└── users/
    └── [id].js     → https://sua-api.vercel.app/api/users/123
```

No nosso caso, usamos `api/index.js` como ponto de entrada único que redireciona para o Express.
