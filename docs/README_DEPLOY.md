# 🚀 README - Deploy Vercel

## ✅ Projeto Pronto para Deploy!

Seu projeto está configurado corretamente para deploy na Vercel com NeonDB.

## 📁 Estrutura Criada

```
backend/
├── 📂 api/                    ⭐ PASTA PARA VERCEL
│   └── 📄 index.js           → Entry point serverless
│
├── 📂 src/
│   ├── 📄 app.js             → Express app
│   ├── 📄 db.js              → Sequelize + NeonDB
│   ├── 📂 controllers/
│   ├── 📂 models/
│   └── 📂 routes/
│
├── 📄 vercel.json            → Configuração Vercel ✅
├── 📄 package.json           → Dependências
├── 📄 index.js               → Entry point local
└── 📄 .env.example           → Exemplo de variáveis
```

## 🎯 Próximos Passos

### 1. Configure NeonDB (5 min)

1. Acesse [console.neon.tech](https://console.neon.tech/)
2. Crie projeto: `dogs-api`
3. Copie a Connection String:
   ```
   postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

### 2. Deploy na Vercel (5 min)

**Opção A: Dashboard (Recomendado)**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório GitHub
3. Adicione variáveis de ambiente:
   ```env
   DATABASE_URL=postgresql://...?sslmode=require
   API_KEY=sua_api_key_do_thedogapi
   NODE_ENV=production
   ```
4. Clique em **Deploy**

**Opção B: CLI**

```bash
npm install -g vercel
vercel login
vercel
vercel env add DATABASE_URL
vercel env add API_KEY
vercel env add NODE_ENV
vercel --prod
```

### 3. Teste a API (2 min)

```bash
# Testar com script
npm run test:vercel https://sua-api.vercel.app

# Ou manualmente
curl https://sua-api.vercel.app/api/dogs
curl https://sua-api.vercel.app/api/temperaments
```

## 📚 Documentação Disponível

| Arquivo                 | Descrição                      |
| ----------------------- | ------------------------------ |
| **RESUMO_DEPLOY.md**    | 📋 Resumo rápido (COMECE AQUI) |
| **ESTRUTURA_VERCEL.md** | 📁 Explicação da estrutura     |
| **DEPLOY.md**           | 🚀 Guia passo a passo          |
| **CHECKLIST_DEPLOY.md** | ✅ Checklist completo          |
| **TROUBLESHOOTING.md**  | 🔧 Solução de problemas        |
| **COMANDOS_UTEIS.md**   | 💻 Comandos úteis              |

## 🔑 Arquivos Importantes

### `api/index.js` (Vercel - Production)

```javascript
const app = require("../src/app.js");
const { database } = require("../src/db.js");

database.sync({ force: false });

module.exports = app; // ← Exporta para Vercel
```

### `vercel.json` (Configuração)

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

## ⚙️ Variáveis de Ambiente

### Vercel (Production)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=sua_api_key_do_thedogapi
NODE_ENV=production
```

### Local (Development)

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dogs
API_KEY=sua_api_key_do_thedogapi
NODE_ENV=development
```

## 🧪 Testar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor local
npm start

# Testar API local
npm run test:api
```

## 🎓 Por que a pasta `api/`?

A Vercel usa **Serverless Functions**:

- Pasta `api/` = Funções serverless automáticas
- `api/index.js` = Ponto de entrada principal
- Vercel executa sob demanda (não fica sempre rodando)

### Comparação

```
Local:     npm start → index.js → server.listen(3001)
Vercel:    Requisição → api/index.js → module.exports = app
```

## ✨ Vantagens dessa Estrutura

✅ Funciona localmente (Docker)
✅ Funciona na Vercel (Serverless)
✅ Mesmo código para ambos
✅ Fácil manutenção
✅ Otimizado para produção

## 🐛 Problemas Comuns

### "404 NOT_FOUND"

**Causa:** Deploy falhou ou URL incorreta

**Solução:**

```bash
vercel logs
vercel --prod --force
```

### "Connection timeout"

**Causa:** DATABASE_URL incorreta

**Solução:**

- Verificar se tem `?sslmode=require`
- Verificar se NeonDB está ativo

### "Module not found"

**Causa:** Dependências faltando

**Solução:**

```bash
npm install
vercel --prod
```

## 📞 Suporte

- [Vercel Docs](https://vercel.com/docs)
- [NeonDB Docs](https://neon.tech/docs)
- [Express Docs](https://expressjs.com/)

## 🎉 Resultado Esperado

Após o deploy:

```bash
✅ https://sua-api.vercel.app/api/dogs
✅ https://sua-api.vercel.app/api/temperaments
✅ https://sua-api.vercel.app/api/dogs/1
```

## 📊 Status do Projeto

- [x] Estrutura `api/` criada
- [x] `api/index.js` configurado
- [x] `vercel.json` configurado
- [x] `src/db.js` otimizado para NeonDB
- [x] Documentação completa
- [ ] Variáveis de ambiente na Vercel
- [ ] Deploy realizado
- [ ] Testes passando

## 🚀 Começar Agora

```bash
# 1. Configure NeonDB
# 2. Deploy na Vercel
vercel --prod

# 3. Teste
npm run test:vercel https://sua-api.vercel.app
```

---

**Dúvidas?** Consulte os arquivos de documentação listados acima! 📚
