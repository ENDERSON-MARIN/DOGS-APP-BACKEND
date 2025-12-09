# 🐕 Dogs API

API RESTful para gerenciamento de informações sobre raças de cães, desenvolvida com Node.js, Express, PostgreSQL e Sequelize ORM.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Deploy](#deploy)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Autor](#autor)

## 🎯 Sobre o Projeto

Esta API fornece endpoints para consultar, criar, atualizar e deletar informações sobre raças de cães. Os dados são obtidos de duas fontes:

- **The Dog API**: API externa com informações sobre raças de cães
- **Banco de Dados Local**: Raças criadas pelos usuários

A API combina dados de ambas as fontes, permitindo uma experiência completa de gerenciamento de informações caninas.

## 📸 Screenshots

<div style="overflow-x: auto;">
    <table style="width: 100%;">
        <tr>
            <td style="width: 50%;"><img src="./public/screenshots/doc1.png" alt="Documentação geral da API de dogs parte 1" style="width: 100%; height: auto; object-fit: cover;" /></td>
            <td style="width: 50%;"><img src="./public/screenshots/doc2.png" alt="Documentação geral da API de dogs parte 2" style="width: 100%; height: auto; object-fit: cover;" /></td>
        </tr>
        <tr>
            <td style="width: 50%;"><img src="./public/screenshots/doc3.png" alt="Documentação geral da API de dogs parte 3" style="width: 100%; height: auto; object-fit: cover;" /></td>
            <td style="width: 50%;"><img src="./public/screenshots/doc4.png" alt="Documentação geral da API de dogs parte 4" style="width: 100%; height: auto; object-fit: cover;" /></td>
        </tr>
        <tr>
            <td style="width: 50%;"><img src="./public/screenshots/doc5.png" alt="Documentação geral da API de dogs parte 5" style="width: 100%; height: auto; object-fit: cover;" /></td>
            <td style="width: 50%;"><img src="./public/screenshots/doc6.png" alt="Documentação geral da API de dogs parte 6" style="width: 100%; height: auto; object-fit: cover;" /></td>
        </tr>
    </table>
</div>

---

## 🚀 Tecnologias

### Core

- **Node.js** (>=18.0.0) - Runtime JavaScript
- **Express** (^4.19.2) - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** (^6.35.2) - ORM para Node.js

### Dependências Principais

- **axios** (^1.6.7) - Cliente HTTP para integração com API externa
- **cors** (^2.8.5) - Middleware para habilitar CORS
- **dotenv** (^16.4.5) - Gerenciamento de variáveis de ambiente
- **joi** (^17.12.2) - Validação de schemas
- **express-joi-validation** (^5.0.1) - Middleware de validação
- **morgan** (^1.10.0) - Logger HTTP

### Ferramentas de Desenvolvimento

- **nodemon** (^3.1.0) - Auto-reload durante desenvolvimento
- **mocha** (^10.3.0) - Framework de testes
- **chai** (^4.4.1) - Biblioteca de asserções
- **supertest** (^6.3.4) - Testes de integração HTTP

## ✨ Funcionalidades

### Raças de Cães

- ✅ Listar todas as raças (API + Database)
- ✅ Buscar raças por nome
- ✅ Obter detalhes de uma raça específica por ID
- ✅ Criar nova raça no banco de dados
- ✅ Atualizar informações de uma raça
- ✅ Deletar raça do banco de dados

### Temperamentos

- ✅ Listar todos os temperamentos disponíveis
- ✅ Sincronização automática com The Dog API
- ✅ Cache de temperamentos no banco de dados

## 🏗️ Arquitetura

```
dogs-api/
├── api/
│   └── index.js              # Entry point para Vercel
├── src/
│   ├── app.js                # Configuração do Express
│   ├── db.js                 # Configuração do Sequelize
│   ├── controllers/
│   │   ├── index.js          # Lógica de negócio principal
│   │   ├── dogs.js           # Controller de dogs
│   │   └── temperaments.js   # Controller de temperaments
│   ├── models/
│   │   ├── Dog.js            # Modelo Dog
│   │   └── Temperament.js    # Modelo Temperament
│   └── routes/
│       ├── index.js          # Router principal
│       ├── dogs.js           # Rotas de dogs
│       └── temperaments.js   # Rotas de temperaments
├── scripts/
│   ├── sync-database.js      # Script de sincronização
│   ├── test-db-performance.js
│   └── quick-db-test.js
├── tests/                    # Testes automatizados
├── docs/                     # Documentação adicional
├── index.js                  # Entry point local
├── package.json
├── vercel.json              # Configuração Vercel
└── .env.example             # Exemplo de variáveis de ambiente
```

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 6.14.6
- PostgreSQL >= 12
- Conta em [The Dog API](https://thedogapi.com/) (para obter API Key)

### Passos

1. Clone o repositório:

```bash
git clone <repository-url>
cd dogs-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais (veja seção [Configuração](#configuração))

5. Inicie o servidor:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database Configuration
# OPÇÃO 1: Use DATABASE_URL para serviços cloud (NeonDB, Vercel, etc)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# OPÇÃO 2: Use variáveis individuais para Docker local
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dogs

# API Configuration
PORT=3001
NODE_ENV=development

# The Dog API Key
# Obtenha sua chave em: https://thedogapi.com/
API_KEY=your_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Configuração do Banco de Dados

#### Desenvolvimento Local (Docker)

Use as variáveis individuais (`DB_USER`, `DB_PASSWORD`, etc.)

#### Produção (NeonDB, Vercel, Railway, Supabase)

Use a variável `DATABASE_URL` com a connection string completa:

```env
# NeonDB
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dogs?sslmode=require

# Supabase
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Railway
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

## 🎮 Uso

### Desenvolvimento

```bash
npm start
```

Inicia o servidor com nodemon (auto-reload)

### Produção

```bash
NODE_ENV=production node index.js
```

### Sincronizar Banco de Dados

```bash
npm run db:sync
```

Sincroniza os temperamentos da API externa com o banco de dados

## 📡 Endpoints da API

Base URL: `http://localhost:3001/api`

### Dogs

#### GET `/api/dogs`

Lista todas as raças de cães (API + Database)

**Query Parameters:**

- `name` (opcional): Filtra raças por nome

**Exemplo:**

```bash
GET /api/dogs
GET /api/dogs?name=golden
```

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "Golden Retriever",
    "height_min": 51,
    "height_max": 61,
    "weight_min": 25,
    "weight_max": 34,
    "years_life": "10 - 12 years",
    "image": "https://cdn2.thedogapi.com/images/1.jpg",
    "temperaments": "Intelligent, Friendly, Reliable"
  }
]
```

#### GET `/api/dogs/:id`

Obtém detalhes de uma raça específica

**Parâmetros:**

- `id`: ID da raça (número para API, UUID para Database)

**Exemplo:**

```bash
GET /api/dogs/1
GET /api/dogs/550e8400-e29b-41d4-a716-446655440000
```

**Resposta:**

```json
{
  "id": 1,
  "name": "Golden Retriever",
  "height_min": 51,
  "height_max": 61,
  "weight_min": 25,
  "weight_max": 34,
  "years_life": "10 - 12 years",
  "image": "https://cdn2.thedogapi.com/images/1.jpg",
  "temperaments": "Intelligent, Friendly, Reliable"
}
```

#### POST `/api/dogs`

Cria uma nova raça no banco de dados

**Body:**

```json
{
  "name": "Labrador Retriever",
  "height_min": 54,
  "height_max": 62,
  "weight_min": 25,
  "weight_max": 36,
  "years_life": "10 - 14 years",
  "image": "https://example.com/labrador.jpg",
  "temperaments": ["1", "2", "3"]
}
```

**Validações:**

- `name`: string, 3-100 caracteres, obrigatório
- `height_min`: número, mínimo 1, obrigatório
- `height_max`: número, mínimo 1, obrigatório
- `weight_min`: número, mínimo 1, obrigatório
- `weight_max`: número, mínimo 1, obrigatório
- `years_life`: string, 1-50 caracteres, opcional
- `image`: URL válida (jpg, jpeg, png, gif), máximo 255 caracteres, opcional
- `temperaments`: array de IDs, obrigatório

**Resposta:**

```json
{
  "succMsg": "Dog Created Successfully!",
  "newDog": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Labrador Retriever",
    "height_min": "54",
    "height_max": "62",
    "weight_min": "25",
    "weight_max": "36",
    "years_life": "10 - 14 years",
    "image": "https://example.com/labrador.jpg",
    "temperaments": [
      { "id": 1, "name": "Intelligent" },
      { "id": 2, "name": "Friendly" }
    ]
  }
}
```

#### PUT `/api/dogs/:id`

Atualiza uma raça existente

**Parâmetros:**

- `id`: UUID da raça

**Body:** (mesma estrutura do POST)

**Resposta:**

```json
{
  "succMsg": "Dog Updated Successfully!",
  "updatedDog": {
    /* dog atualizado */
  }
}
```

#### DELETE `/api/dogs/:id`

Deleta uma raça do banco de dados

**Parâmetros:**

- `id`: UUID da raça

**Resposta:**

```json
{
  "succMsg": "Dog Deleted Successfully!"
}
```

### Temperaments

#### GET `/api/temperaments`

Lista todos os temperamentos disponíveis

**Exemplo:**

```bash
GET /api/temperaments
```

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "Intelligent"
  },
  {
    "id": 2,
    "name": "Friendly"
  }
]
```

## 🗄️ Modelos de Dados

### Dog

```javascript
{
  id: UUID (Primary Key),
  name: STRING (required),
  height_min: STRING (required),
  height_max: STRING (required),
  weight_min: STRING (required),
  weight_max: STRING (required),
  years_life: STRING (optional),
  image: TEXT (URL, optional)
}
```

**Relações:**

- `belongsToMany` Temperament (através de Dog_Temperaments)

### Temperament

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  name: STRING (required)
}
```

**Relações:**

- `belongsToMany` Dog (através de Dog_Temperaments)

### Dog_Temperaments (Tabela de Junção)

Tabela intermediária criada automaticamente pelo Sequelize para a relação many-to-many.

## 🚀 Deploy

### Vercel

1. Instale a CLI do Vercel:

```bash
npm i -g vercel
```

2. Configure as variáveis de ambiente no dashboard da Vercel:

   - `DATABASE_URL`
   - `API_KEY`
   - `NODE_ENV=production`

3. Deploy:

```bash
vercel --prod
```

A configuração está em `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

### Outras Plataformas

Consulte a documentação em `docs/` para instruções específicas:

- `docs/DEPLOY.md` - Guia geral de deploy
- `docs/VERCEL_DEPLOYMENT.md` - Deploy na Vercel
- `docs/DOCKER_SETUP.md` - Configuração com Docker

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                 # Inicia servidor com nodemon

# Testes
npm test                  # Executa testes com Mocha
npm run test:api          # Testa rotas da API
npm run test:vercel       # Testa API no Vercel

# Database
npm run db:sync           # Sincroniza temperamentos
npm run db:test           # Testa performance do DB
npm run db:quick          # Teste rápido de conexão
```

## 🧪 Testes

### Executar Testes

```bash
npm test
```

### Estrutura de Testes

```
tests/
├── models/
│   └── *.spec.js         # Testes de modelos
└── routes/
    └── *.spec.js         # Testes de rotas
```

### Ferramentas de Teste

- **Mocha**: Framework de testes
- **Chai**: Biblioteca de asserções
- **Supertest**: Testes HTTP

## 📚 Documentação Adicional

- [Checklist de Deploy](docs/CHECKLIST_DEPLOY.md)
- [Comandos Úteis](docs/COMANDOS_UTEIS.md)
- [Estrutura Vercel](docs/ESTRUTURA_VERCEL.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Teste de API](docs/TEST_API.md)

## 👤 Autor

**Enderson Millan**

## 📄 Licença

ISC

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
