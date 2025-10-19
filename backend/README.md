# Backend API - Mini Marketplace Services

> API REST em Node.js + Express + Prisma para o marketplace de serviços

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [API Endpoints](#-api-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Desenvolvimento](#-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)

## 🎯 Visão Geral

O backend é uma API REST que gerencia toda a lógica de negócio do marketplace:

- **Usuários**: Cadastro e autenticação de clientes e prestadores
- **Serviços**: CRUD de serviços e suas variações
- **Agendas**: Gestão de disponibilidade dos prestadores
- **Contratações**: Processo de booking e gestão de contratos

### Tecnologias

- **Runtime**: Node.js 20
- **Framework**: Express.js 4.19.0
- **ORM**: Prisma 6.17.1
- **Database**: PostgreSQL 16
- **Containerização**: Docker

## 🏗 Arquitetura

### Estrutura de Pastas

```
backend/
├── 📁 src/
│   ├── index.js                 # Servidor Express principal
│   └── 📁 routes/               # Endpoints organizados por domínio
│       ├── usuarios.js          # Gestão de usuários
│       ├── servicos.js          # CRUD de serviços
│       ├── contratacoes.js      # Sistema de booking
│       └── agendas.js           # Gestão de disponibilidade
├── 📁 prisma/
│   ├── schema.prisma            # Schema do banco de dados
│   ├── seed.js                  # Dados iniciais para desenvolvimento
│   └── 📁 migrations/           # Histórico de migrações
├── 📄 package.json              # Dependências e scripts
├── 📄 Dockerfile                # Imagem Docker
└── 📄 .env                      # Variáveis de ambiente
```

### Fluxo de Dados

```mermaid
graph LR
    A[Cliente HTTP] --> B[Express Server]
    B --> C[Route Handler]
    C --> D[Prisma Client]
    D --> E[PostgreSQL]
    E --> D
    D --> C
    C --> B
    B --> A
```

### Middleware Stack

```mermaid
graph TB
    A[Request] --> B[CORS]
    B --> C[JSON Parser]
    C --> D[Route Handler]
    D --> E[Prisma Client]
    E --> F[Response]
```

## ⚡ Instalação

### Com Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d backend

# Verificar logs
docker-compose logs -f backend
```

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco (PostgreSQL rodando)
npx prisma generate
npx prisma db push

# 3. Popular dados iniciais
npx prisma db seed

# 4. Iniciar servidor
npm start
```

### Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://admin:secret@localhost:5433/marketplace"

# Server
PORT=3000
NODE_ENV=development

# CORS (opcional)
ALLOWED_ORIGINS=http://localhost:5173
```

## 🔌 API Endpoints

### Health Check

```http
GET /
# Retorna status da API
```

**Response:**
```json
{
  "status": "API rodando 🚀"
}
```

### Usuários

#### Criar Usuário
```http
POST /usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senhaHash": "hash_da_senha",
  "role": "CLIENTE" | "PRESTADOR"
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "CLIENTE",
  "criadoEm": "2024-01-15T10:30:00.000Z"
}
```

#### Listar Usuários
```http
GET /usuarios
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "CLIENTE",
    "criadoEm": "2024-01-15T10:30:00.000Z"
  }
]
```

### Serviços

#### Listar Serviços
```http
GET /servicos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Serviço de Manicure",
    "descricao": "Profissional com 20 anos de experiência",
    "tipo": "Manicure",
    "criadoEm": "2024-01-15T10:30:00.000Z",
    "prestador": {
      "id": 2,
      "nome": "Maria das Dores",
      "email": "maria@teste.com"
    },
    "variacoes": [
      {
        "id": 1,
        "nome": "Pé",
        "preco": "20.00",
        "duracaoMin": 30
      },
      {
        "id": 2,
        "nome": "Mão com pintura",
        "preco": "35.00",
        "duracaoMin": 60
      }
    ]
  }
]
```

#### Criar Serviço
```http
POST /servicos
Content-Type: application/json

{
  "prestadorId": 2,
  "tipo": "Manicure",
  "nome": "Serviço de Manicure Premium",
  "descricao": "Serviço completo de manicure e pedicure",
  "variacoes": [
    {
      "nome": "Básico",
      "preco": 25.00,
      "duracaoMin": 30
    },
    {
      "nome": "Completo",
      "preco": 45.00,
      "duracaoMin": 60
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 3,
  "prestadorId": 2,
  "tipo": "Manicure",
  "nome": "Serviço de Manicure Premium",
  "descricao": "Serviço completo de manicure e pedicure",
  "criadoEm": "2024-01-15T11:00:00.000Z",
  "variacoes": [
    {
      "id": 5,
      "servicoId": 3,
      "nome": "Básico",
      "preco": "25.00",
      "duracaoMin": 30
    },
    {
      "id": 6,
      "servicoId": 3,
      "nome": "Completo",
      "preco": "45.00",
      "duracaoMin": 60
    }
  ]
}
```

### Contratações

#### Criar Contratação
```http
POST /contratacoes
Content-Type: application/json

{
  "clienteId": 1,
  "variacaoId": 1,
  "agendaId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "clienteId": 1,
  "variacaoId": 1,
  "agendaId": 1,
  "status": "ATIVA",
  "contratadoEm": "2024-01-15T12:00:00.000Z"
}
```

**Response (400) - Slot Indisponível:**
```json
{
  "error": "Slot indisponível"
}
```

#### Listar Contratações do Cliente
```http
GET /contratacoes/cliente/1
```

**Response (200):**
```json
[
  {
    "id": 1,
    "status": "ATIVA",
    "contratadoEm": "2024-01-15T12:00:00.000Z",
    "variacao": {
      "id": 1,
      "nome": "Pé",
      "preco": "20.00",
      "duracaoMin": 30
    },
    "agenda": {
      "id": 1,
      "dataInicio": "2024-01-20T14:00:00.000Z",
      "dataFim": "2024-01-20T14:30:00.000Z",
      "disponivel": false
    }
  }
]
```

### Agendas

```http
GET /agendas
# Endpoint em desenvolvimento
```

## 🗄️ Banco de Dados

### Schema Prisma

```prisma
model Usuario {
  id        Int           @id @default(autoincrement())
  nome      String
  email     String        @unique
  senhaHash String
  role      Role
  criadoEm  DateTime      @default(now())
  agendas   Agenda[]      @relation("PrestadorAgendas")
  contratos Contratacao[] @relation("ClienteContratacoes")
  servicos  Servico[]     @relation("PrestadorServicos")
}

model Servico {
  id          Int               @id @default(autoincrement())
  prestadorId Int
  tipo        String
  nome        String
  descricao   String
  criadoEm    DateTime          @default(now())
  prestador   Usuario           @relation("PrestadorServicos", fields: [prestadorId], references: [id])
  variacoes   VariacaoServico[]
}

model VariacaoServico {
  id         Int           @id @default(autoincrement())
  servicoId  Int
  nome       String
  preco      Decimal       @db.Decimal(10, 2)
  duracaoMin Int
  contratos  Contratacao[]
  servico    Servico       @relation(fields: [servicoId], references: [id])
}

model Agenda {
  id          Int           @id @default(autoincrement())
  prestadorId Int
  dataInicio  DateTime
  dataFim     DateTime
  disponivel  Boolean       @default(true)
  prestador   Usuario       @relation("PrestadorAgendas", fields: [prestadorId], references: [id])
  contratos   Contratacao[]
}

model Contratacao {
  id           Int             @id @default(autoincrement())
  clienteId    Int
  variacaoId   Int
  agendaId     Int
  status       Status          @default(ATIVA)
  contratadoEm DateTime        @default(now())
  agenda       Agenda          @relation(fields: [agendaId], references: [id])
  cliente      Usuario         @relation("ClienteContratacoes", fields: [clienteId], references: [id])
  variacao     VariacaoServico @relation(fields: [variacaoId], references: [id])
}

enum Role {
  CLIENTE
  PRESTADOR
}

enum Status {
  ATIVA
  CANCELADA
}
```

### Comandos Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar mudanças no schema
npx prisma db push

# Executar seed
npx prisma db seed

# Interface visual do banco
npx prisma studio

# Reset completo do banco
npx prisma db reset
```

### Dados de Seed

O arquivo `seed.js` popula o banco com:

- **1 Cliente**: João Cliente (joao@teste.com)
- **4 Prestadores** com serviços:
  - Maria - Manicure (2 variações)
  - Carlos - Eletricista (3 variações)
  - Ana - Pintora (3 variações)
  - Roberto - Jardineiro (3 variações)

## 🛠 Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar servidor
npm start

# Instalar dependências
npm install

# Comandos Prisma
npm run db:generate    # npx prisma generate
npm run db:push        # npx prisma db push
npm run db:seed        # npx prisma db seed
npm run db:studio      # npx prisma studio
```

### Estrutura do Código

#### index.js - Servidor Principal
```javascript
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Importar rotas
import usuarioRoutes from "./routes/usuarios.js";
import servicoRoutes from "./routes/servicos.js";
import contratacaoRoutes from "./routes/contratacoes.js";
import agendaRoutes from "./routes/agendas.js";

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/servicos", servicoRoutes);
app.use("/contratacoes", contratacaoRoutes);
app.use("/agendas", agendaRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "API rodando 🚀" }));

app.listen(3000, () => {
  console.log("✅ Backend rodando em http://localhost:3000");
});
```

#### Padrão de Route Handler
```javascript
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET - Listar recursos
router.get("/", async (req, res) => {
  try {
    const recursos = await prisma.recurso.findMany({
      include: { relacionamentos: true }
    });
    res.json(recursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar recurso
router.post("/", async (req, res) => {
  try {
    const { campo1, campo2 } = req.body;
    const recurso = await prisma.recurso.create({
      data: { campo1, campo2 }
    });
    res.status(201).json(recurso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Tratamento de Erros

```javascript
// Middleware de erro global (futuro)
app.use((error, req, res, next) => {
  console.error(error);
  
  if (error.code === 'P2002') {
    return res.status(400).json({ 
      error: 'Violação de constraint único' 
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor' 
  });
});
```

### Validação de Dados

```javascript
// Exemplo de validação simples
router.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senhaHash, role } = req.body;
    
    // Validações básicas
    if (!nome || !email || !senhaHash || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome, email, senhaHash, role' 
      });
    }
    
    if (!['CLIENTE', 'PRESTADOR'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role deve ser CLIENTE ou PRESTADOR' 
      });
    }
    
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, role }
    });
    
    res.status(201).json(usuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Email já cadastrado' 
      });
    }
    res.status(500).json({ error: error.message });
  }
});
```

## 🧪 Testes

### Estrutura de Testes (Planejado)

```
backend/
├── 📁 tests/
│   ├── 📁 unit/                 # Testes unitários
│   │   ├── routes.test.js
│   │   └── models.test.js
│   ├── 📁 integration/          # Testes de integração
│   │   ├── api.test.js
│   │   └── database.test.js
│   └── 📁 fixtures/             # Dados de teste
│       └── sample-data.js
```

### Comandos de Teste (Futuro)

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes de integração
npm run test:integration
```

## 🚀 Deploy

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

### Variáveis de Produção

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://minimarketplace.com
```

### Health Checks

```bash
# Verificar se API está respondendo
curl http://localhost:3000/

# Verificar conexão com banco
curl http://localhost:3000/health/db
```

### Logs

```bash
# Logs do container
docker-compose logs -f backend

# Logs em tempo real
docker-compose logs --tail=100 -f backend
```

## 📊 Monitoramento

### Métricas Importantes

- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erros 4xx/5xx
- **Database Connections**: Conexões ativas com PostgreSQL
- **Memory Usage**: Uso de memória do processo Node.js

### Endpoints de Monitoramento (Futuro)

```http
GET /health              # Status geral da aplicação
GET /health/db           # Status da conexão com banco
GET /metrics             # Métricas Prometheus
```

---

## 🔗 Links Úteis

- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)

## 📞 Suporte

Para problemas específicos do backend:

1. Verifique os logs: `docker-compose logs -f backend`
2. Teste a conexão com banco: `npx prisma studio`
3. Valide o schema: `npx prisma validate`
4. Consulte a documentação da API

## Contato
- E-mail: jvitorbatista29@gmail.com
- [linkedin](https://www.linkedin.com/in/jo%C3%A3o-vitor-batista-silva-50b280279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- João Vitor Batista Silva