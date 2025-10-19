# API Documentation - Mini Marketplace Services

> Documentação completa da API REST do marketplace de serviços

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Autenticação](#-autenticação)
- [Endpoints](#-endpoints)
- [Modelos de Dados](#-modelos-de-dados)
- [Códigos de Erro](#-códigos-de-erro)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Rate Limiting](#-rate-limiting)
- [Versionamento](#-versionamento)

## 🎯 Visão Geral

A API do Mini Marketplace Services é uma REST API que permite:

- Gerenciar usuários (clientes e prestadores)
- CRUD de serviços e suas variações
- Sistema de agendamento e contratações
- Gestão de disponibilidade dos prestadores

### Base URLs

| Ambiente | URL |
|----------|-----|
| **Desenvolvimento** | `http://localhost:3000` |
| **Staging** | `https://api-staging.minimarketplace.com` |
| **Produção** | `https://api.minimarketplace.com` |

### Formato de Dados

- **Request**: JSON (`application/json`)
- **Response**: JSON (`application/json`)
- **Encoding**: UTF-8
- **Timezone**: UTC (ISO 8601)

## 🔐 Autenticação

### Status Atual
⚠️ **Em Desenvolvimento**: Atualmente a API não possui autenticação implementada.

### Planejado (v1.1)
```http
Authorization: Bearer <jwt_token>
```

**Fluxo de Autenticação:**
1. `POST /auth/login` - Obter token JWT
2. Incluir token no header `Authorization`
3. Token expira em 24h
4. Refresh token para renovação

## 🔌 Endpoints

### Health Check

#### GET /
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "API rodando 🚀"
}
```

---

### Usuários

#### POST /usuarios
Cria um novo usuário no sistema.

**Request Body:**
```json
{
  "nome": "string (required)",
  "email": "string (required, unique)",
  "senhaHash": "string (required)",
  "role": "CLIENTE | PRESTADOR (required)"
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

**Errors:**
- `400` - Dados inválidos ou email já cadastrado
- `500` - Erro interno do servidor

#### GET /usuarios
Lista todos os usuários cadastrados.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "CLIENTE",
    "criadoEm": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "nome": "Maria das Dores",
    "email": "maria@teste.com",
    "role": "PRESTADOR",
    "criadoEm": "2024-01-15T09:15:00.000Z"
  }
]
```

---

### Serviços

#### GET /servicos
Lista todos os serviços disponíveis com suas variações e informações do prestador.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `tipo` | string | Filtrar por categoria |
| `prestadorId` | number | Filtrar por prestador |

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Serviço de Manicure",
    "descricao": "Profissional com 20 anos de experiência",
    "tipo": "Manicure",
    "criadoEm": "2024-01-15T10:30:00.000Z",
    "prestadorId": 2,
    "prestador": {
      "id": 2,
      "nome": "Maria das Dores",
      "email": "maria@teste.com",
      "role": "PRESTADOR"
    },
    "variacoes": [
      {
        "id": 1,
        "servicoId": 1,
        "nome": "Pé",
        "preco": "20.00",
        "duracaoMin": 30
      },
      {
        "id": 2,
        "servicoId": 1,
        "nome": "Mão com pintura",
        "preco": "35.00",
        "duracaoMin": 60
      }
    ]
  }
]
```

#### POST /servicos
Cria um novo serviço com suas variações.

**Request Body:**
```json
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

**Validações:**
- `prestadorId` deve existir e ter role PRESTADOR
- `variacoes` deve ter pelo menos 1 item
- `preco` deve ser maior que 0
- `duracaoMin` deve ser maior que 0

---

### Contratações

#### POST /contratacoes
Cria uma nova contratação de serviço.

**Request Body:**
```json
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

**Business Rules:**
1. Verifica se o slot da agenda está disponível
2. Marca o slot como indisponível após contratação
3. Cliente deve ter role CLIENTE
4. Variação deve existir e estar ativa

**Errors:**
- `400` - Slot indisponível
- `404` - Cliente, variação ou agenda não encontrados
- `500` - Erro interno

#### GET /contratacoes/cliente/:id
Lista todas as contratações de um cliente específico.

**Path Parameters:**
- `id` (number) - ID do cliente

**Response (200):**
```json
[
  {
    "id": 1,
    "clienteId": 1,
    "variacaoId": 1,
    "agendaId": 1,
    "status": "ATIVA",
    "contratadoEm": "2024-01-15T12:00:00.000Z",
    "variacao": {
      "id": 1,
      "nome": "Pé",
      "preco": "20.00",
      "duracaoMin": 30,
      "servico": {
        "id": 1,
        "nome": "Serviço de Manicure",
        "tipo": "Manicure",
        "prestador": {
          "id": 2,
          "nome": "Maria das Dores"
        }
      }
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

---

### Agendas

#### GET /agendas
**Status**: 🚧 Em desenvolvimento

Lista slots de agenda disponíveis.

**Planejado:**
```json
[
  {
    "id": 1,
    "prestadorId": 2,
    "dataInicio": "2024-01-20T14:00:00.000Z",
    "dataFim": "2024-01-20T14:30:00.000Z",
    "disponivel": true
  }
]
```

#### POST /agendas
**Status**: 🚧 Em desenvolvimento

Cria novos slots de agenda para um prestador.

## 📊 Modelos de Dados

### Usuario
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;        // unique
  senhaHash: string;
  role: 'CLIENTE' | 'PRESTADOR';
  criadoEm: Date;
}
```

### Servico
```typescript
interface Servico {
  id: number;
  prestadorId: number;
  tipo: string;         // categoria do serviço
  nome: string;
  descricao: string;
  criadoEm: Date;
  
  // Relacionamentos
  prestador: Usuario;
  variacoes: VariacaoServico[];
}
```

### VariacaoServico
```typescript
interface VariacaoServico {
  id: number;
  servicoId: number;
  nome: string;
  preco: Decimal;       // formato: "25.00"
  duracaoMin: number;   // duração em minutos
  
  // Relacionamentos
  servico: Servico;
  contratos: Contratacao[];
}
```

### Agenda
```typescript
interface Agenda {
  id: number;
  prestadorId: number;
  dataInicio: Date;
  dataFim: Date;
  disponivel: boolean;  // default: true
  
  // Relacionamentos
  prestador: Usuario;
  contratos: Contratacao[];
}
```

### Contratacao
```typescript
interface Contratacao {
  id: number;
  clienteId: number;
  variacaoId: number;
  agendaId: number;
  status: 'ATIVA' | 'CANCELADA';
  contratadoEm: Date;
  
  // Relacionamentos
  cliente: Usuario;
  variacao: VariacaoServico;
  agenda: Agenda;
}
```

## ❌ Códigos de Erro

### HTTP Status Codes

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados inválidos ou regra de negócio violada |
| **401** | Unauthorized | Token inválido ou expirado |
| **403** | Forbidden | Sem permissão para acessar recurso |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: email já cadastrado) |
| **422** | Unprocessable Entity | Dados válidos mas não processáveis |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Internal Server Error | Erro interno do servidor |

### Formato de Erro

```json
{
  "error": "Mensagem de erro legível",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo específico com erro",
    "value": "Valor que causou o erro"
  },
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

### Códigos de Erro Específicos

| Código | Descrição |
|--------|-----------|
| `INVALID_EMAIL` | Email em formato inválido |
| `EMAIL_ALREADY_EXISTS` | Email já cadastrado |
| `USER_NOT_FOUND` | Usuário não encontrado |
| `INVALID_ROLE` | Role deve ser CLIENTE ou PRESTADOR |
| `SLOT_UNAVAILABLE` | Slot de agenda indisponível |
| `INVALID_PRICE` | Preço deve ser maior que zero |
| `INVALID_DURATION` | Duração deve ser maior que zero |
| `PRESTADOR_NOT_FOUND` | Prestador não encontrado |
| `SERVICE_NOT_FOUND` | Serviço não encontrado |
| `VARIATION_NOT_FOUND` | Variação não encontrada |

## 💡 Exemplos de Uso

### Fluxo Completo: Cliente Contrata Serviço

#### 1. Listar Serviços Disponíveis
```bash
curl -X GET http://localhost:3000/servicos
```

#### 2. Criar Cliente
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senhaHash": "hash123",
    "role": "CLIENTE"
  }'
```

#### 3. Contratar Serviço
```bash
curl -X POST http://localhost:3000/contratacoes \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "variacaoId": 1,
    "agendaId": 1
  }'
```

#### 4. Verificar Contratações
```bash
curl -X GET http://localhost:3000/contratacoes/cliente/1
```

### Fluxo: Prestador Cadastra Serviço

#### 1. Criar Prestador
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria das Dores",
    "email": "maria@email.com",
    "senhaHash": "hash456",
    "role": "PRESTADOR"
  }'
```

#### 2. Cadastrar Serviço
```bash
curl -X POST http://localhost:3000/servicos \
  -H "Content-Type: application/json" \
  -d '{
    "prestadorId": 2,
    "tipo": "Manicure",
    "nome": "Serviço de Manicure Premium",
    "descricao": "Serviço completo com produtos de qualidade",
    "variacoes": [
      {
        "nome": "Básico",
        "preco": 25.00,
        "duracaoMin": 30
      },
      {
        "nome": "Completo com decoração",
        "preco": 45.00,
        "duracaoMin": 60
      }
    ]
  }'
```

### Filtros e Consultas

#### Filtrar Serviços por Categoria
```bash
curl -X GET "http://localhost:3000/servicos?tipo=Manicure"
```

#### Filtrar Serviços por Prestador
```bash
curl -X GET "http://localhost:3000/servicos?prestadorId=2"
```

## 🚦 Rate Limiting

### Status Atual
⚠️ **Não Implementado**: Rate limiting será implementado na v1.2

### Planejado
- **Limite**: 100 requests/minuto por IP
- **Headers de Resposta**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1642248000
  ```

## 📈 Versionamento

### Estratégia
- **Atual**: Sem versionamento (v1.0 implícita)
- **Futuro**: Versionamento via header `Accept-Version`

### Roadmap de Versões

#### v1.1 (Próxima)
- Autenticação JWT
- Rate limiting
- Validações aprimoradas
- Endpoints de agenda

#### v1.2
- Paginação
- Filtros avançados
- Webhooks
- Métricas de API

#### v2.0
- GraphQL endpoint
- Real-time subscriptions
- API de notificações
- Geolocalização

## 🔧 Ferramentas de Desenvolvimento

### Postman Collection
```json
{
  "info": {
    "name": "Mini Marketplace API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/",
          "host": ["{{baseUrl}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

### OpenAPI Specification (Futuro)
```yaml
openapi: 3.0.0
info:
  title: Mini Marketplace API
  version: 1.0.0
  description: API para marketplace de serviços locais
servers:
  - url: http://localhost:3000
    description: Desenvolvimento
paths:
  /:
    get:
      summary: Health check
      responses:
        '200':
          description: API funcionando
```

## 📞 Suporte

### Logs de Debug
```bash
# Logs da API
docker-compose logs -f backend

# Logs do banco
docker-compose logs -f db

# Conectar ao banco para debug
docker-compose exec db psql -U admin -d marketplace
```

### Troubleshooting

| Problema | Solução |
|----------|---------|
| **500 Internal Server Error** | Verificar logs do backend e conexão com banco |
| **CORS Error** | Verificar configuração de CORS no backend |
| **Connection Refused** | Verificar se backend está rodando na porta 3000 |
| **Database Error** | Verificar se PostgreSQL está rodando e acessível |

## Contato
- E-mail: jvitorbatista29@gmail.com
- [linkedin](https://www.linkedin.com/in/jo%C3%A3o-vitor-batista-silva-50b280279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- João Vitor Batista Silva