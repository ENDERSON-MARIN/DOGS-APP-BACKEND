# 📁 Estrutura Correta para Deploy na Vercel

## ✅ Estrutura Atual do Projeto

```
backend/
├── api/                    # ⭐ PASTA NECESSÁRIA PARA VERCEL
│   └── index.js           # Entry point serverless (Vercel)
├── src/
│   ├── app.js             # Configuração Express
│   ├── db.js              # Configuração Sequelize + NeonDB
│   ├── controllers/
│   │   ├── dogs.js
│   │   ├── temperaments.js
│   │   └── index.js
│   ├── models/
│   │   ├── Dog.js
│   │   └── Temperament.js
│   └── routes/
│       ├── dogs.js
│       ├── temperaments.js
│       └── index.js
├── docs/
├── tests/
├── vercel.json            # Configuração Vercel
├── package.json
├── index.js               # Entry point local (npm start)
└── .env.example
```

## 🎯 Por que a pasta `api/` é necessária?

### Vercel Serverless Functions

A Vercel usa uma arquitetura serverless onde:

1. **Pasta `api/`** = Funções serverless automáticas
2. Cada arquivo em `api/` vira um endpoint
3. `api/index.js` = Ponto de entrada principal

### Diferença entre Local e Vercel

| Ambiente   | Entry Point       | Como Funciona                                         |
| ---------- | ----------------- | ----------------------------------------------------- |
| **Local**  | `index.js` (raiz) | `node index.js` inicia servidor Express na porta 3001 |
| **Vercel** | `api/index.js`    | Vercel executa como função serverless                 |

## 📝 Conteúdo dos Arquivos

### 1. `index.js` (Raiz - Development)

```javascript
const server = require("./src/app.js");
const { database } = require("./src/db.js");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

// Sincroniza banco e inicia servidor
database.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`Server Listening in http://localhost:${PORT}/`);
  });
});
```

**Uso:** `npm start` (desenvolvimento local)

### 2. `api/index.js` (Vercel - Production)

```javascript
const app = require("../src/app.js");
const { database } = require("../src/db.js");
require("dotenv").config();

// Sincronizar banco de dados
database
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Exportar app para Vercel (sem server.listen)
module.exports = app;
```

**Diferenças importantes:**

- ❌ **NÃO** usa `server.listen()` (Vercel gerencia isso)
- ✅ **Exporta** o app Express
- ✅ Sincroniza banco antes de exportar

### 3. `vercel.json`

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

**O que faz:**

- Redireciona todas as requisições para `api/index.js`
- Mantém as rotas do Express funcionando

## 🔄 Como Funciona o Fluxo

### Local (Development)

```
npm start
    ↓
index.js (raiz)
    ↓
src/app.js (Express)
    ↓
src/routes/index.js
    ↓
Rotas: /api/dogs, /api/temperaments
```

### Vercel (Production)

```
Requisição: https://sua-api.vercel.app/api/dogs
    ↓
vercel.json (rewrites)
    ↓
api/index.js
    ↓
src/app.js (Express)
    ↓
src/routes/index.js
    ↓
Resposta: JSON com dogs
```

## ✨ Vantagens dessa Estrutura

### 1. **Compatibilidade Dupla**

- ✅ Funciona localmente com Docker
- ✅ Funciona na Vercel serverless

### 2. **Código Reutilizável**

- `src/app.js` é usado em ambos ambientes
- Não precisa duplicar código

### 3. **Fácil Manutenção**

- Mudanças em `src/` afetam ambos
- Um único codebase

### 4. **Otimizado para Serverless**

- Connection pooling configurado
- SSL automático em produção
- Cold start otimizado

## 🚀 Como Fazer Deploy

### Passo 1: Verificar Estrutura

```bash
# Verificar se api/index.js existe
ls api/index.js

# Verificar se vercel.json está correto
cat vercel.json
```

### Passo 2: Commit e Push

```bash
git add .
git commit -m "feat: adicionar estrutura para deploy vercel"
git push origin main
```

### Passo 3: Deploy na Vercel

```bash
# Via CLI
vercel --prod

# Ou via Dashboard
# 1. Acesse vercel.com/new
# 2. Importe repositório
# 3. Configure variáveis de ambiente
# 4. Deploy!
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente (Vercel)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=sua_api_key_do_thedogapi
NODE_ENV=production
```

### package.json

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '../src/app.js'"

**Causa:** Caminho relativo incorreto em `api/index.js`

**Solução:**

```javascript
// ✅ Correto
const app = require("../src/app.js");

// ❌ Errado
const app = require("./src/app.js");
```

### Erro: "404 NOT_FOUND"

**Causa:** Pasta `api/` não existe ou `vercel.json` incorreto

**Solução:**

1. Criar pasta `api/`
2. Criar `api/index.js`
3. Verificar `vercel.json`

### Erro: "Function timeout"

**Causa:** `database.sync()` demorando muito

**Solução:**

```javascript
// Usar timeout menor
database.sync({ force: false, timeout: 5000 });
```

## 📊 Comparação: Com e Sem pasta api/

### ❌ Sem pasta api/ (Não funciona na Vercel)

```
backend/
├── index.js
├── src/
└── vercel.json
```

**Problema:** Vercel não sabe qual arquivo executar

### ✅ Com pasta api/ (Funciona na Vercel)

```
backend/
├── api/
│   └── index.js    # Vercel encontra automaticamente
├── src/
└── vercel.json
```

**Vantagem:** Vercel reconhece automaticamente

## 🎓 Conceitos Importantes

### Serverless vs Traditional Server

| Traditional Server      | Serverless (Vercel)          |
| ----------------------- | ---------------------------- |
| Servidor sempre rodando | Função executada sob demanda |
| `server.listen(3001)`   | Exporta função               |
| Paga por uptime         | Paga por execução            |
| Gerencia conexões       | Vercel gerencia              |

### Cold Start

**O que é:** Primeira execução da função após inatividade

**Como otimizar:**

- Connection pooling (max: 3)
- Código mínimo em `api/index.js`
- Lazy loading de módulos

## 📚 Recursos

- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [NeonDB + Vercel](https://neon.tech/docs/guides/vercel)

## ✅ Checklist Final

- [ ] Pasta `api/` criada
- [ ] `api/index.js` criado e configurado
- [ ] `vercel.json` configurado com rewrites
- [ ] `src/app.js` exporta o app Express
- [ ] `src/db.js` configurado para NeonDB
- [ ] Variáveis de ambiente configuradas
- [ ] Código commitado no GitHub
- [ ] Deploy realizado na Vercel
- [ ] Endpoints testados

## 🎉 Resultado Esperado

Após seguir essa estrutura:

```bash
# Local
curl http://localhost:3001/api/dogs
# ✅ Funciona

# Vercel
curl https://sua-api.vercel.app/api/dogs
# ✅ Funciona
```

Ambos ambientes funcionando com o mesmo código! 🚀
