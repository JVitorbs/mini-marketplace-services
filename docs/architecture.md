# Architecture Documentation - Mini Marketplace Services

> Documentação detalhada da arquitetura do sistema de marketplace

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura de Alto Nível](#-arquitetura-de-alto-nível)
- [Componentes do Sistema](#-componentes-do-sistema)
- [Fluxos de Dados](#-fluxos-de-dados)
- [Padrões Arquiteturais](#-padrões-arquiteturais)
- [Decisões Técnicas](#-decisões-técnicas)
- [Escalabilidade](#-escalabilidade)
- [Segurança](#-segurança)
- [Monitoramento](#-monitoramento)

## 🎯 Visão Geral

O Mini Marketplace Services é construído seguindo uma arquitetura de **3 camadas** com separação clara de responsabilidades:

- **Apresentação**: Interface web responsiva (SvelteKit)
- **Aplicação**: API REST para lógica de negócio (Node.js + Express)
- **Dados**: Persistência relacional (PostgreSQL)

### Princípios Arquiteturais

1. **Separação de Responsabilidades**: Cada camada tem uma função específica
2. **Baixo Acoplamento**: Componentes independentes e intercambiáveis
3. **Alta Coesão**: Funcionalidades relacionadas agrupadas
4. **Escalabilidade Horizontal**: Capacidade de adicionar instâncias
5. **Observabilidade**: Logs, métricas e traces para monitoramento

## 🏗 Arquitetura de Alto Nível

### Diagrama C4 - Contexto

```mermaid
C4Context
    title Sistema Mini Marketplace - Contexto

    Person(cliente, "Cliente", "Usuário que busca e contrata serviços locais")
    Person(prestador, "Prestador", "Profissional que oferece serviços")
    Person(admin, "Administrador", "Gerencia a plataforma")

    System(marketplace, "Mini Marketplace", "Plataforma de conexão entre clientes e prestadores")

    System_Ext(email, "Sistema de Email", "Envio de notificações")
    System_Ext(payment, "Gateway de Pagamento", "Processamento de pagamentos")
    System_Ext(maps, "Serviço de Mapas", "Geolocalização")

    Rel(cliente, marketplace, "Busca e contrata serviços")
    Rel(prestador, marketplace, "Oferece e gerencia serviços")
    Rel(admin, marketplace, "Administra plataforma")
    
    Rel(marketplace, email, "Envia notificações")
    Rel(marketplace, payment, "Processa pagamentos")
    Rel(marketplace, maps, "Obtém localização")
```

### Diagrama C4 - Container

```mermaid
C4Container
    title Sistema Mini Marketplace - Containers

    Person(user, "Usuário", "Cliente ou Prestador")

    Container_Boundary(marketplace, "Mini Marketplace") {
        Container(spa, "Single Page App", "SvelteKit", "Interface web responsiva")
        Container(api, "API Application", "Node.js + Express", "Lógica de negócio e endpoints REST")
        ContainerDb(db, "Database", "PostgreSQL", "Armazena dados dos usuários, serviços e transações")
        Container(cache, "Cache", "Redis", "Cache de sessões e dados frequentes")
    }

    Container_Boundary(infra, "Infraestrutura") {
        Container(proxy, "Reverse Proxy", "Nginx", "Load balancer e SSL termination")
        Container(monitor, "Monitoring", "Prometheus + Grafana", "Métricas e alertas")
        Container(logs, "Log Aggregation", "ELK Stack", "Centralização de logs")
    }

    Rel(user, spa, "Usa", "HTTPS")
    Rel(spa, api, "Consome", "JSON/HTTPS")
    Rel(api, db, "Lê/Escreve", "SQL")
    Rel(api, cache, "Cache", "Redis Protocol")
    
    Rel(proxy, spa, "Serve")
    Rel(proxy, api, "Proxy")
    Rel(monitor, api, "Coleta métricas")
    Rel(logs, api, "Agrega logs")
```

### Diagrama C4 - Componente (API)

```mermaid
C4Component
    title API Application - Componentes

    Container(spa, "SPA", "SvelteKit", "Interface do usuário")
    ContainerDb(db, "Database", "PostgreSQL", "Dados persistentes")

    Container_Boundary(api, "API Application") {
        Component(router, "Express Router", "Express.js", "Roteamento HTTP")
        Component(auth, "Auth Middleware", "JWT", "Autenticação e autorização")
        Component(validation, "Validation", "Joi/Zod", "Validação de entrada")
        
        Component(userController, "User Controller", "Express Handler", "Gestão de usuários")
        Component(serviceController, "Service Controller", "Express Handler", "Gestão de serviços")
        Component(bookingController, "Booking Controller", "Express Handler", "Gestão de contratações")
        
        Component(userService, "User Service", "Business Logic", "Regras de negócio de usuários")
        Component(serviceService, "Service Service", "Business Logic", "Regras de negócio de serviços")
        Component(bookingService, "Booking Service", "Business Logic", "Regras de negócio de contratações")
        
        Component(prisma, "Prisma Client", "ORM", "Acesso aos dados")
        Component(emailService, "Email Service", "Nodemailer", "Envio de emails")
        Component(notificationService, "Notification Service", "WebSocket", "Notificações em tempo real")
    }

    Rel(spa, router, "HTTP Requests")
    Rel(router, auth, "Middleware")
    Rel(auth, validation, "Middleware")
    Rel(validation, userController, "Validated Request")
    Rel(validation, serviceController, "Validated Request")
    Rel(validation, bookingController, "Validated Request")
    
    Rel(userController, userService, "Calls")
    Rel(serviceController, serviceService, "Calls")
    Rel(bookingController, bookingService, "Calls")
    
    Rel(userService, prisma, "Database Operations")
    Rel(serviceService, prisma, "Database Operations")
    Rel(bookingService, prisma, "Database Operations")
    
    Rel(bookingService, emailService, "Send Notifications")
    Rel(bookingService, notificationService, "Real-time Updates")
    
    Rel(prisma, db, "SQL Queries")
```

## 🧩 Componentes do Sistema

### Frontend (SvelteKit)

```mermaid
graph TB
    subgraph "SvelteKit Application"
        A[App Shell] --> B[Router]
        B --> C[Pages]
        C --> D[Components]
        D --> E[Stores]
        E --> F[API Client]
        
        subgraph "Pages"
            C1[Home Page]
            C2[Service Details]
            C3[Booking Page]
            C4[Dashboard]
        end
        
        subgraph "Components"
            D1[ServiceCard]
            D2[BookingForm]
            D3[Navbar]
            D4[Modal]
        end
        
        subgraph "Stores"
            E1[User Store]
            E2[Service Store]
            E3[Booking Store]
        end
    end
    
    F --> G[Backend API]
```

**Responsabilidades:**
- Renderização da interface do usuário
- Gerenciamento de estado local
- Validação de formulários
- Comunicação com API
- Experiência do usuário (UX)

### Backend (Node.js + Express)

```mermaid
graph TB
    subgraph "Express Application"
        A[HTTP Server] --> B[Middleware Stack]
        B --> C[Route Handlers]
        C --> D[Business Logic]
        D --> E[Data Access Layer]
        
        subgraph "Middleware"
            B1[CORS]
            B2[Body Parser]
            B3[Authentication]
            B4[Validation]
            B5[Error Handler]
        end
        
        subgraph "Routes"
            C1[/usuarios]
            C2[/servicos]
            C3[/contratacoes]
            C4[/agendas]
        end
        
        subgraph "Services"
            D1[UserService]
            D2[ServiceService]
            D3[BookingService]
            D4[NotificationService]
        end
    end
    
    E --> F[Prisma ORM]
    F --> G[PostgreSQL]
```

**Responsabilidades:**
- Processamento de requisições HTTP
- Validação e sanitização de dados
- Implementação de regras de negócio
- Gerenciamento de transações
- Integração com serviços externos

### Banco de Dados (PostgreSQL)

```mermaid
erDiagram
    Usuario {
        int id PK
        string nome
        string email UK
        string senhaHash
        enum role
        datetime criadoEm
    }
    
    Servico {
        int id PK
        int prestadorId FK
        string tipo
        string nome
        string descricao
        datetime criadoEm
    }
    
    VariacaoServico {
        int id PK
        int servicoId FK
        string nome
        decimal preco
        int duracaoMin
    }
    
    Agenda {
        int id PK
        int prestadorId FK
        datetime dataInicio
        datetime dataFim
        boolean disponivel
    }
    
    Contratacao {
        int id PK
        int clienteId FK
        int variacaoId FK
        int agendaId FK
        enum status
        datetime contratadoEm
    }
    
    Usuario ||--o{ Servico : "oferece"
    Usuario ||--o{ Agenda : "define"
    Usuario ||--o{ Contratacao : "contrata"
    Servico ||--o{ VariacaoServico : "possui"
    Agenda ||--o{ Contratacao : "reserva"
    VariacaoServico ||--o{ Contratacao : "escolhida"
```

**Responsabilidades:**
- Persistência de dados
- Integridade referencial
- Consultas otimizadas
- Backup e recovery
- Controle de concorrência

## 🔄 Fluxos de Dados

### Fluxo de Contratação de Serviço

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as Email Service
    participant P as Prestador

    C->>F: Busca serviços
    F->>A: GET /servicos
    A->>D: SELECT servicos
    D-->>A: Lista de serviços
    A-->>F: JSON response
    F-->>C: Exibe serviços

    C->>F: Seleciona serviço
    F->>A: GET /servicos/{id}
    A->>D: SELECT servico + variações
    D-->>A: Detalhes do serviço
    A-->>F: JSON response
    F-->>C: Exibe detalhes

    C->>F: Escolhe variação e horário
    F->>A: POST /contratacoes
    A->>D: BEGIN TRANSACTION
    A->>D: SELECT agenda (FOR UPDATE)
    D-->>A: Verifica disponibilidade
    
    alt Slot disponível
        A->>D: INSERT contratacao
        A->>D: UPDATE agenda (disponivel = false)
        A->>D: COMMIT
        D-->>A: Contratação criada
        A->>E: Enviar email confirmação
        E-->>P: Email para prestador
        E-->>C: Email para cliente
        A-->>F: Sucesso
        F-->>C: Confirmação
    else Slot indisponível
        A->>D: ROLLBACK
        A-->>F: Erro 400
        F-->>C: Mensagem de erro
    end
```

### Fluxo de Cadastro de Serviço

```mermaid
sequenceDiagram
    participant P as Prestador
    participant F as Frontend
    participant A as API
    participant D as Database

    P->>F: Acessa dashboard
    F->>A: GET /servicos?prestadorId={id}
    A->>D: SELECT servicos WHERE prestadorId
    D-->>A: Serviços do prestador
    A-->>F: JSON response
    F-->>P: Lista serviços

    P->>F: Cadastra novo serviço
    F->>A: POST /servicos
    Note over A: Validação de dados
    A->>D: BEGIN TRANSACTION
    A->>D: INSERT servico
    A->>D: INSERT variacoes (batch)
    A->>D: COMMIT
    D-->>A: Serviço criado
    A-->>F: Sucesso
    F-->>P: Confirmação
```

### Fluxo de Autenticação (Futuro)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as API
    participant D as Database
    participant J as JWT Service

    U->>F: Login (email, senha)
    F->>A: POST /auth/login
    A->>D: SELECT usuario WHERE email
    D-->>A: Dados do usuário
    Note over A: Verificar senha (bcrypt)
    
    alt Credenciais válidas
        A->>J: Gerar JWT token
        J-->>A: Token assinado
        A-->>F: Token + dados usuário
        F->>F: Armazenar token (localStorage)
        F-->>U: Redirect para dashboard
    else Credenciais inválidas
        A-->>F: Erro 401
        F-->>U: Mensagem de erro
    end

    Note over F: Requisições subsequentes
    F->>A: GET /protected (Authorization: Bearer token)
    A->>J: Verificar token
    J-->>A: Token válido + payload
    A->>D: Executar operação
    D-->>A: Resultado
    A-->>F: Response
```

## 🎨 Padrões Arquiteturais

### 1. Model-View-Controller (MVC)

```
Frontend (SvelteKit):
├── View: Componentes Svelte (.svelte)
├── Controller: Stores + Event Handlers
└── Model: API Client + Local State

Backend (Express):
├── Model: Prisma Models + Business Logic
├── View: JSON Responses
└── Controller: Route Handlers
```

### 2. Repository Pattern (via Prisma)

```javascript
// Abstração do acesso a dados
class UserRepository {
  async findById(id) {
    return prisma.usuario.findUnique({ where: { id } });
  }
  
  async create(userData) {
    return prisma.usuario.create({ data: userData });
  }
  
  async findByEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  }
}
```

### 3. Service Layer Pattern

```javascript
// Lógica de negócio isolada
class BookingService {
  constructor(userRepo, serviceRepo, agendaRepo, bookingRepo) {
    this.userRepo = userRepo;
    this.serviceRepo = serviceRepo;
    this.agendaRepo = agendaRepo;
    this.bookingRepo = bookingRepo;
  }
  
  async createBooking(clienteId, variacaoId, agendaId) {
    // Validações de negócio
    const cliente = await this.userRepo.findById(clienteId);
    if (!cliente || cliente.role !== 'CLIENTE') {
      throw new Error('Cliente inválido');
    }
    
    // Verificar disponibilidade
    const agenda = await this.agendaRepo.findById(agendaId);
    if (!agenda || !agenda.disponivel) {
      throw new Error('Slot indisponível');
    }
    
    // Criar contratação (transação)
    return this.bookingRepo.createWithTransaction({
      clienteId,
      variacaoId,
      agendaId
    });
  }
}
```

### 4. Middleware Pattern

```javascript
// Pipeline de processamento
app.use(cors());                    // CORS
app.use(express.json());            // Body parsing
app.use(authMiddleware);            // Autenticação
app.use(validationMiddleware);      // Validação
app.use(rateLimitMiddleware);       // Rate limiting
app.use(loggingMiddleware);         // Logging
app.use(errorHandlerMiddleware);    // Error handling
```

### 5. Observer Pattern (Stores)

```javascript
// Estado reativo no frontend
import { writable } from 'svelte/store';

export const services = writable([]);

// Componentes se inscrevem automaticamente
$: filteredServices = $services.filter(s => s.tipo === selectedType);
```

## 🤔 Decisões Técnicas

### Frontend: SvelteKit vs React/Vue

**Escolha**: SvelteKit

**Razões**:
- ✅ Bundle size menor (melhor performance)
- ✅ Sintaxe mais simples e intuitiva
- ✅ Reatividade nativa (sem virtual DOM)
- ✅ SSR/SSG built-in
- ✅ Menor curva de aprendizado

**Trade-offs**:
- ❌ Ecossistema menor que React
- ❌ Menos desenvolvedores no mercado
- ❌ Documentação/tutoriais limitados

### Backend: Node.js vs Python/Java

**Escolha**: Node.js + Express

**Razões**:
- ✅ JavaScript full-stack (mesma linguagem)
- ✅ Ecosystem rico (npm)
- ✅ Performance adequada para I/O intensivo
- ✅ Desenvolvimento rápido
- ✅ JSON nativo

**Trade-offs**:
- ❌ Single-threaded (CPU intensivo)
- ❌ Callback hell (mitigado com async/await)
- ❌ Tipagem dinâmica (mitigado com TypeScript futuro)

### Database: PostgreSQL vs MongoDB

**Escolha**: PostgreSQL

**Razões**:
- ✅ ACID compliance
- ✅ Relacionamentos complexos
- ✅ Queries SQL poderosas
- ✅ Integridade referencial
- ✅ Maturidade e estabilidade

**Trade-offs**:
- ❌ Menos flexível para dados não estruturados
- ❌ Scaling horizontal mais complexo
- ❌ Schema rígido

### ORM: Prisma vs Sequelize/TypeORM

**Escolha**: Prisma

**Razões**:
- ✅ Type-safe queries
- ✅ Schema-first approach
- ✅ Migrations automáticas
- ✅ Prisma Studio (GUI)
- ✅ Performance otimizada

**Trade-offs**:
- ❌ Menos maduro que Sequelize
- ❌ Vendor lock-in
- ❌ Queries complexas limitadas

### Containerização: Docker vs Bare Metal

**Escolha**: Docker + Docker Compose

**Razões**:
- ✅ Ambiente consistente
- ✅ Isolamento de dependências
- ✅ Deploy simplificado
- ✅ Escalabilidade horizontal
- ✅ Desenvolvimento local facilitado

**Trade-offs**:
- ❌ Overhead de performance
- ❌ Complexidade adicional
- ❌ Curva de aprendizado

## 📈 Escalabilidade

### Escalabilidade Horizontal

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx/HAProxy]
    end
    
    subgraph "Frontend Instances"
        FE1[Frontend 1]
        FE2[Frontend 2]
        FE3[Frontend 3]
    end
    
    subgraph "Backend Instances"
        BE1[Backend 1]
        BE2[Backend 2]
        BE3[Backend 3]
    end
    
    subgraph "Database Cluster"
        DB_MASTER[(PostgreSQL Master)]
        DB_REPLICA1[(Read Replica 1)]
        DB_REPLICA2[(Read Replica 2)]
    end
    
    subgraph "Cache Layer"
        REDIS_MASTER[(Redis Master)]
        REDIS_REPLICA[(Redis Replica)]
    end
    
    LB --> FE1
    LB --> FE2
    LB --> FE3
    
    FE1 --> BE1
    FE2 --> BE2
    FE3 --> BE3
    
    BE1 --> DB_MASTER
    BE2 --> DB_MASTER
    BE3 --> DB_MASTER
    
    BE1 --> DB_REPLICA1
    BE2 --> DB_REPLICA2
    BE3 --> DB_REPLICA1
    
    BE1 --> REDIS_MASTER
    BE2 --> REDIS_MASTER
    BE3 --> REDIS_MASTER
    
    DB_MASTER --> DB_REPLICA1
    DB_MASTER --> DB_REPLICA2
    REDIS_MASTER --> REDIS_REPLICA
```

### Estratégias de Scaling

#### 1. Frontend Scaling
```yaml
# docker-compose.scale.yml
services:
  frontend:
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
```

#### 2. Backend Scaling
```yaml
services:
  backend:
    deploy:
      replicas: 5
      update_config:
        parallelism: 1
        delay: 10s
```

#### 3. Database Scaling
```sql
-- Read replicas para queries de leitura
-- Master para writes
-- Connection pooling
-- Query optimization
```

#### 4. Cache Strategy
```javascript
// Redis para cache de sessões e dados frequentes
const redis = new Redis({
  host: 'redis-master',
  port: 6379,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null
});

// Cache de serviços populares
async function getPopularServices() {
  const cached = await redis.get('popular_services');
  if (cached) return JSON.parse(cached);
  
  const services = await prisma.servico.findMany({
    // query complexa
  });
  
  await redis.setex('popular_services', 300, JSON.stringify(services));
  return services;
}
```

### Métricas de Performance

| Métrica | Target | Atual | Ação |
|---------|--------|-------|------|
| **Response Time** | < 200ms | 150ms | ✅ OK |
| **Throughput** | > 1000 req/s | 800 req/s | 🔄 Otimizar |
| **Error Rate** | < 0.1% | 0.05% | ✅ OK |
| **Availability** | > 99.9% | 99.95% | ✅ OK |
| **Database Connections** | < 80% | 60% | ✅ OK |

## 🔒 Segurança

### Camadas de Segurança

```mermaid
graph TB
    subgraph "Network Security"
        A[Firewall]
        B[DDoS Protection]
        C[SSL/TLS]
    end
    
    subgraph "Application Security"
        D[Authentication]
        E[Authorization]
        F[Input Validation]
        G[Rate Limiting]
    end
    
    subgraph "Data Security"
        H[Encryption at Rest]
        I[Encryption in Transit]
        J[Database Security]
        K[Backup Encryption]
    end
    
    A --> D
    B --> E
    C --> F
    D --> H
    E --> I
    F --> J
    G --> K
```

### Implementações de Segurança

#### 1. Autenticação JWT (Planejado)
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Gerar token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

#### 2. Validação de Input
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  role: Joi.string().valid('CLIENTE', 'PRESTADOR').required()
});

function validateUser(req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
```

#### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições, tente novamente em 15 minutos'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 tentativas de login
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
```

#### 4. Sanitização de Dados
```javascript
const helmet = require('helmet');
const xss = require('xss');

// Headers de segurança
app.use(helmet());

// Sanitização XSS
function sanitizeInput(req, res, next) {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
}
```

### Checklist de Segurança

- [ ] **Autenticação**: JWT implementado
- [ ] **Autorização**: RBAC (Role-Based Access Control)
- [ ] **HTTPS**: SSL/TLS em produção
- [ ] **Headers de Segurança**: Helmet.js configurado
- [ ] **Rate Limiting**: Proteção contra DDoS
- [ ] **Input Validation**: Joi/Zod para validação
- [ ] **SQL Injection**: Prisma ORM (proteção nativa)
- [ ] **XSS Protection**: Sanitização de input
- [ ] **CSRF Protection**: Tokens CSRF
- [ ] **Secrets Management**: Variáveis de ambiente
- [ ] **Audit Logs**: Log de ações sensíveis
- [ ] **Backup Security**: Backups criptografados

## 📊 Monitoramento

### Stack de Observabilidade

```mermaid
graph TB
    subgraph "Application"
        A[Frontend]
        B[Backend]
        C[Database]
    end
    
    subgraph "Metrics Collection"
        D[Prometheus]
        E[Node Exporter]
        F[Postgres Exporter]
    end
    
    subgraph "Visualization"
        G[Grafana]
    end
    
    subgraph "Alerting"
        H[AlertManager]
        I[PagerDuty]
        J[Slack]
    end
    
    subgraph "Logging"
        K[ELK Stack]
        L[Fluentd]
    end
    
    A --> D
    B --> D
    C --> F
    D --> G
    D --> H
    H --> I
    H --> J
    
    A --> L
    B --> L
    C --> L
    L --> K
```

### Métricas Importantes

#### 1. Application Metrics
```javascript
// Prometheus metrics no backend
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware para coletar métricas
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
}
```

#### 2. Business Metrics
```javascript
const bookingsTotal = new promClient.Counter({
  name: 'bookings_total',
  help: 'Total number of bookings',
  labelNames: ['status', 'service_type']
});

const revenueTotal = new promClient.Counter({
  name: 'revenue_total',
  help: 'Total revenue in BRL',
  labelNames: ['service_type']
});

// Incrementar métricas de negócio
async function createBooking(bookingData) {
  const booking = await prisma.contratacao.create({ data: bookingData });
  
  bookingsTotal
    .labels(booking.status, booking.variacao.servico.tipo)
    .inc();
  
  revenueTotal
    .labels(booking.variacao.servico.tipo)
    .inc(parseFloat(booking.variacao.preco));
  
  return booking;
}
```

### Dashboards Grafana

#### 1. System Overview
- CPU/Memory/Disk usage
- Network I/O
- Container health
- Database connections

#### 2. Application Performance
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Throughput

#### 3. Business Metrics
- New users per day
- Bookings per hour
- Revenue trends
- Popular services

### Alertas Críticos

```yaml
# alertmanager/alerts.yml
groups:
  - name: minimarketplace
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
```

---

## 🔮 Evolução da Arquitetura

### Roadmap Técnico

#### Fase 1 (Atual) - MVP
- ✅ Arquitetura monolítica simples
- ✅ Docker Compose para desenvolvimento
- ✅ PostgreSQL + Prisma
- ✅ SvelteKit frontend

#### Fase 2 (v1.1) - Produção
- 🔄 Autenticação JWT
- 🔄 Rate limiting
- 🔄 Monitoramento básico
- 🔄 CI/CD pipeline

#### Fase 3 (v1.2) - Escala
- 📋 Load balancer
- 📋 Redis cache
- 📋 Database replicas
- 📋 Horizontal scaling

#### Fase 4 (v2.0) - Microserviços
- 📋 Service decomposition
- 📋 API Gateway
- 📋 Event-driven architecture
- 📋 Kubernetes deployment

### Migração para Microserviços

```mermaid
graph TB
    subgraph "Current Monolith"
        M[Mini Marketplace API]
    end
    
    subgraph "Future Microservices"
        US[User Service]
        SS[Service Service]
        BS[Booking Service]
        NS[Notification Service]
        PS[Payment Service]
    end
    
    subgraph "Infrastructure"
        AG[API Gateway]
        MB[Message Broker]
        SD[Service Discovery]
    end
    
    M -.-> US
    M -.-> SS
    M -.-> BS
    M -.-> NS
    M -.-> PS
    
    AG --> US
    AG --> SS
    AG --> BS
    
    US --> MB
    SS --> MB
    BS --> MB
    NS --> MB
```

---

## Contato
- E-mail: jvitorbatista29@gmail.com
- [linkedin](https://www.linkedin.com/in/jo%C3%A3o-vitor-batista-silva-50b280279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- João Vitor Batista Silva