# 🔧 Troubleshooting - Erro NOT_FOUND (404)

## 🎯 O que é o erro NOT_FOUND?

O erro **NOT_FOUND (404)** ocorre quando a Vercel não consegue encontrar o recurso solicitado. Isso pode acontecer por várias razões relacionadas à configuração do deploy.

## 🔍 Causas Comuns

### 1. **Deploy Ainda Não Concluído**

- O deploy pode estar em andamento
- A URL foi acessada antes do build finalizar

**Solução:**

```bash
# Verificar status do deploy
vercel ls

# Ver logs do último deploy
vercel logs
```

### 2. **Configuração Incorreta do vercel.json**

- Rotas mal configuradas
- Arquivo de entrada (src) incorreto

**Solução:** O `vercel.json` foi atualizado para:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

### 3. **Estrutura de Rotas Incorreta**

- A API espera `/api/dogs` mas você está acessando `/dogs`
- Falta o prefixo `/api`

**Solução:**

```bash
# ❌ Errado
curl https://sua-api.vercel.app/dogs

# ✅ Correto
curl https://sua-api.vercel.app/api/dogs
```

### 4. **Variáveis de Ambiente Não Configuradas**

- DATABASE_URL não configurada
- API_KEY faltando
- Aplicação falha ao iniciar

**Solução:**

```bash
# Verificar variáveis de ambiente
vercel env ls

# Adicionar variáveis faltantes
vercel env add DATABASE_URL
vercel env add API_KEY
vercel env add NODE_ENV
```

### 5. **Erro no Build**

- Dependências faltando
- Erro de sintaxe no código
- Módulos não encontrados

**Solução:**

```bash
# Ver logs de build
vercel logs --since 1h

# Testar build localmente
npm install
npm start
```

## 🛠️ Passo a Passo para Resolver

### Passo 1: Verificar o Deploy

```bash
# Ver lista de deploys
vercel ls

# Ver detalhes do último deploy
vercel inspect
```

**O que procurar:**

- Status: `READY` (✅) ou `ERROR` (❌)
- Build Time: Tempo de build
- URL: URL do deploy

### Passo 2: Verificar Logs

```bash
# Ver logs completos
vercel logs

# Ver apenas erros
vercel logs --filter "error"

# Ver logs em tempo real
vercel logs --follow
```

**Erros comuns nos logs:**

- `Cannot find module`: Dependência faltando
- `Connection timeout`: Problema com DATABASE_URL
- `SSL connection required`: Falta `?sslmode=require` na URL

### Passo 3: Verificar Variáveis de Ambiente

```bash
# Listar variáveis
vercel env ls

# Adicionar variáveis faltantes
vercel env add DATABASE_URL
# Cole: postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

vercel env add API_KEY
# Cole: sua_api_key_do_thedogapi

vercel env add NODE_ENV
# Digite: production
```

### Passo 4: Testar Localmente

```bash
# Usar as mesmas variáveis da Vercel
DATABASE_URL="postgresql://..." npm start

# Testar endpoints
npm run test:api
```

### Passo 5: Redeploy

```bash
# Redeploy com cache limpo
vercel --prod --force
```

## 📋 Checklist de Verificação

- [ ] Deploy está com status `READY`
- [ ] Variáveis de ambiente configuradas
- [ ] `vercel.json` está correto
- [ ] Usando URL completa com `/api/` no início
- [ ] DATABASE_URL tem `?sslmode=require`
- [ ] Sem erros nos logs
- [ ] Build concluído com sucesso

## 🧪 Testes Rápidos

### Teste 1: Verificar se a API está online

```bash
# Deve retornar 200 OK
curl -I https://sua-api.vercel.app/api/dogs
```

**Resultado esperado:**

```
HTTP/2 200
content-type: application/json
```

### Teste 2: Testar endpoint específico

```bash
# Deve retornar JSON com lista de dogs
curl https://sua-api.vercel.app/api/dogs
```

**Resultado esperado:**

```json
[
  {
    "id": 1,
    "name": "Affenpinscher",
    "height": "23 - 29",
    ...
  }
]
```

### Teste 3: Testar com script

```bash
npm run test:vercel https://sua-api.vercel.app
```

## 🔄 Cenários Específicos

### Cenário 1: "404 - NOT_FOUND" ao acessar qualquer rota

**Causa:** Deploy falhou ou ainda está em andamento

**Solução:**

```bash
# 1. Verificar status
vercel ls

# 2. Ver logs
vercel logs

# 3. Redeploy se necessário
vercel --prod
```

### Cenário 2: "404" apenas em algumas rotas

**Causa:** Rota não existe ou está mal configurada

**Solução:**

```bash
# Verificar rotas disponíveis
# As rotas corretas são:
# GET /api/dogs
# GET /api/dogs/:id
# POST /api/dogs
# PUT /api/dogs/:id
# DELETE /api/dogs/:id
# GET /api/temperaments
```

### Cenário 3: "404" após adicionar variável de ambiente

**Causa:** Variáveis de ambiente requerem redeploy

**Solução:**

```bash
# Redeploy após adicionar variáveis
vercel --prod
```

### Cenário 4: Funciona localmente mas não na Vercel

**Causa:** Diferença entre ambiente local e produção

**Solução:**

```bash
# 1. Verificar NODE_ENV
vercel env ls | grep NODE_ENV

# 2. Verificar DATABASE_URL
vercel env ls | grep DATABASE_URL

# 3. Testar com variáveis de produção localmente
DATABASE_URL="postgresql://..." NODE_ENV=production npm start
```

## 💡 Conceitos Importantes

### Por que esse erro existe?

O erro 404 é uma proteção do HTTP que indica que o servidor não encontrou o recurso solicitado. Na Vercel, isso pode significar:

1. **Roteamento incorreto**: O `vercel.json` não está direcionando as requisições corretamente
2. **Build falhou**: A aplicação não foi construída com sucesso
3. **Aplicação não iniciou**: Erro ao iniciar o servidor Express

### Mental Model Correto

```
Requisição → Vercel Edge → vercel.json → index.js → Express → Rotas
                                ↓
                          Se falhar aqui = 404
```

A Vercel precisa:

1. Encontrar o arquivo de entrada (`index.js`)
2. Executar o build com sucesso
3. Iniciar a aplicação Express
4. Rotear para o endpoint correto

Se qualquer etapa falhar, você recebe 404.

### Como Evitar no Futuro

1. **Sempre teste localmente primeiro**

   ```bash
   npm start
   npm run test:api
   ```

2. **Verifique logs após deploy**

   ```bash
   vercel logs --follow
   ```

3. **Use variáveis de ambiente corretas**

   - Development: `.env`
   - Production: `vercel env add`

4. **Mantenha `vercel.json` simples**

   - Não complique as rotas
   - Use configuração padrão quando possível

5. **Monitore o dashboard**
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Verifique status dos deploys

## 🚨 Sinais de Alerta

Fique atento a estes padrões que podem causar 404:

1. **Mudanças no `vercel.json`** sem testar
2. **Adicionar variáveis de ambiente** sem redeploy
3. **Mudar estrutura de rotas** sem atualizar `vercel.json`
4. **Dependências novas** sem atualizar `package.json`
5. **Erros de sintaxe** que passam despercebidos localmente

## 📞 Quando Pedir Ajuda

Se após seguir todos os passos o erro persistir:

1. **Colete informações:**

   ```bash
   vercel logs > logs.txt
   vercel inspect > inspect.txt
   ```

2. **Verifique:**

   - URL exata que está acessando
   - Status do deploy no dashboard
   - Mensagens de erro nos logs

3. **Contate suporte:**
   - [Vercel Support](https://vercel.com/support)
   - [NeonDB Support](https://neon.tech/docs/introduction/support)

## 🔗 Links Úteis

- [Vercel Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Vercel Logs](https://vercel.com/docs/concepts/deployments/logs)
- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
