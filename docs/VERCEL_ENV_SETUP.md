# Configuração de Variáveis de Ambiente no Vercel

## Variáveis Obrigatórias

Configure as seguintes variáveis de ambiente no painel do Vercel:

### 1. DATABASE_URL

```
postgresql://neondb_owner:npg_gNTUB7XjAKr1@ep-wandering-glade-acpskj1n-pooler.sa-east-1.aws.neon.tech/dogs_db?sslmode=require
```

**IMPORTANTE:** Remova `&channel_binding=require` da URL para evitar problemas de conexão no Vercel.

### 2. NODE_ENV

```
production
```

### 3. API_KEY

```
live_NjgV6fsXiFW85Io3FJAcPfoO0Fz4K6TfHNNev3GfP0ggbHWvtG4ve2bI9CwHWwXw
```

### 4. CORS_ORIGIN (opcional)

```
*
```

Ou especifique o domínio do seu frontend.

## Como Configurar no Vercel

1. Acesse o dashboard do Vercel
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione cada variável acima
5. Selecione os ambientes: **Production**, **Preview**, **Development**
6. Clique em **Save**
7. Faça um novo deploy ou force redeploy

## Verificar Conexão com o Banco

Após configurar, você pode testar a conexão executando localmente:

```bash
npm run db:sync
```

Este comando sincroniza os modelos com o banco de dados e verifica se a conexão está funcionando.
