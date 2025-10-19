# Mini Marketplace Services

> Sistema completo de marketplace para serviços locais com arquitetura moderna e containerizada

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#️-arquitetura)
- [Tecnologias](#-tecnologias)
- [Modelo de Dados](#-modelo-de-dados)
- [Fluxos de Negócio](#-fluxos-de-negócio)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Reference](#-api-reference)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)

## 🎯 Visão Geral

O Mini Marketplace Services é uma plataforma que conecta prestadores de serviços locais com clientes, permitindo:

- **Prestadores**: Cadastrar serviços, definir preços/variações e gerenciar agenda
- **Clientes**: Descobrir serviços, comparar preços e agendar contratações
- **Administração**: Monitorar transações e performance da plataforma

### Status do Projeto
- ✅ **Backend API**: Funcional com CRUD completo
- ✅ **Frontend**: Interface responsiva com SvelteKit
- ✅ **Database**: Schema PostgreSQL + seeds
- ✅ **Containerização**: Docker Compose configurado
- 🚧 **Autenticação**: Em desenvolvimento
- 🚧 **Pagamentos**: Planejado

## 🏗️ Arquitetura

### Visão de Alto Nível

```mermaid
graph TD
    A[Cliente<br><small>Usuário que contrata serviços</small>] -->|HTTPS| B[Frontend<br><small>SvelteKit + Tailwind</small>]
    C[Prestador<br><small>Usuário que oferece serviços</small>] -->|HTTPS| B
    B -->|HTTP/JSON| D[Backend API<br><small>Node.js + Express + Prisma</small>]
    D -->|Prisma ORM| E[(Database<br><small>PostgreSQL 16</small>)]
    F[Docker<br><small>Containerização</small>] -->|Docker Compose| B
    F --> D
    F --> E
```

### Arquitetura de Componentes

```mermaid
graph TB
    subgraph "Frontend (SvelteKit)"
        A[Pages/Routes] --> B[Components]
        B --> C[Stores]
        C --> D[API Client]
    end
    
    subgraph "Backend (Node.js)"
        E[Express Server] --> F[Route Handlers]
        F --> G[Prisma Client]
        G --> H[Database]
    end
    
    subgraph "Infrastructure"
        I[Docker Compose]
        J[PostgreSQL]
        K[Volumes]
    end
    
    D --> E
    G --> J
    I --> E
    I --> J
    K --> J
```

## 🚀 Tecnologias

### Stack Principal

| Camada | Tecnologia | Versão | Função |
|--------|------------|--------|--------|
| **Frontend** | SvelteKit | ^2.43.5 | Framework web reativo |
| | TailwindCSS | ^3.4.10 | Estilização utilitária |
| | Vite | ^7.0.4 | Build tool e dev server |
| **Backend** | Node.js | 20 | Runtime JavaScript |
| | Express | ^4.19.0 | Framework web |
| | Prisma | ^6.17.1 | ORM e migrations |
| **Database** | PostgreSQL | 16 | Banco relacional |
| **DevOps** | Docker | - | Containerização |
| | Docker Compose | 3.9 | Orquestração |

### Dependências Detalhadas

**Frontend:**
```json
{
  "@sveltejs/kit": "^2.43.5",
  "@sveltejs/adapter-node": "^5.3.2",
  "tailwindcss": "^3.4.10",
  "vite": "^7.0.4",
  "cookie": "^0.7.2"
}
```

**Backend:**
```json
{
  "@prisma/client": "^6.17.1",
  "express": "^4.19.0",
  "cors": "^2.8.5",
  "prisma": "^6.17.1"
}
```

## 📊 Modelo de Dados

### Schema do Banco

```mermaid
erDiagram
    Usuario {
        int id PK
        string nome
        string email UK
        string senhaHash
        enum role "CLIENTE, PRESTADOR"
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
        enum status "ATIVA, CANCELADA"
        datetime contratadoEm
    }

    Usuario ||--o{ Servico : "prestador oferece"
    Usuario ||--o{ Agenda : "prestador define"
    Usuario ||--o{ Contratacao : "cliente contrata"
    Servico ||--o{ VariacaoServico : "possui variações"
    Agenda ||--o{ Contratacao : "reserva slot"
    VariacaoServico ||--o{ Contratacao : "variação escolhida"
```

### Regras de Negócio

1. **Usuários**:
   - Email único no sistema
   - Role define permissões (CLIENTE/PRESTADOR)
   - Prestador pode ser cliente também

2. **Serviços**:
   - Prestador pode ter múltiplos serviços
   - Cada serviço tem tipo/categoria
   - Variações definem preço e duração

3. **Agendamento**:
   - Slot de agenda fica indisponível após contratação
   - Contratação vincula cliente, variação e agenda
   - Status controla ciclo de vida da contratação

## 🔄 Fluxos de Negócio

### Jornada do Cliente

```mermaid
journey
    title Jornada do Cliente
    section Descoberta
      Acessa marketplace: 5: Cliente
      Filtra por categoria: 4: Cliente
      Visualiza detalhes do serviço: 5: Cliente
      Compara variações: 4: Cliente
    section Contratação
      Escolhe variação: 4: Cliente
      Verifica agenda disponível: 3: Cliente
      Seleciona horário: 3: Cliente
      Confirma contratação: 5: Cliente
    section Pós-Contratação
      Recebe confirmação: 5: Cliente
      Acompanha status: 4: Cliente
```

### Fluxo do Prestador

```mermaid
journey
    title Fluxo do Prestador
    section Cadastro
      Registra-se como prestador: 4: Prestador
      Cadastra primeiro serviço: 3: Prestador
      Define variações e preços: 4: Prestador
    section Gestão
      Define agenda disponível: 3: Prestador
      Recebe notificação de contratação: 5: Prestador
      Confirma agendamento: 5: Prestador
      Executa serviço: 5: Prestador
```

### Fluxo de Contratação (Sequência)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    C->>F: Seleciona serviço
    F->>B: GET /servicos/{id}
    B->>D: Busca serviço + variações
    D-->>B: Dados do serviço
    B-->>F: JSON response
    F-->>C: Exibe detalhes
    
    C->>F: Escolhe variação e horário
    F->>B: POST /contratacoes
    B->>D: Verifica disponibilidade
    D-->>B: Agenda disponível
    B->>D: Cria contratação
    B->>D: Marca agenda como ocupada
    D-->>B: Contratação criada
    B-->>F: Confirmação
    F-->>C: Sucesso
```

## ⚡ Instalação

### Pré-requisitos

- Docker & Docker Compose
- Git
- Node.js 20+ (para desenvolvimento local)

### Execução com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone <git@github.com:JVitorbs/mini-marketplace-services.git>
cd mini-marketplace-services

# 2. Execute com Docker Compose
docker-compose up -d

# 3. Verifique os logs
docker-compose logs -f

# 4. Acesse as aplicações
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: rode o prisma studio com "npx prisma studio" no terminal no diretorio do backend
```

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm start

# Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente

**Backend (.env):**
```env
DATABASE_URL="postgresql://admin:secret@localhost:5433/marketplace"
```

**Frontend:**
```env
VITE_API_BASE=http://localhost:3000
VITE_SERVER_API_BASE=http://backend:3000
```

## 📁 Estrutura do Projeto

```
mini-marketplace-services/
├── 📄 README.md                    # Documentação principal
├── 📄 docker-compose.yml           # Orquestração dos serviços
├── 📄 .dockerignore                # Arquivos ignorados no build
│
├── 🎨 frontend/                    # Aplicação SvelteKit
│   ├── 📁 src/
│   │   ├── 📁 lib/
│   │   │   ├── 📁 components/       # Componentes reutilizáveis
│   │   │   │   ├── ServiceCard.svelte
│   │   │   │   ├── ServiceFilter.svelte
│   │   │   │   ├── BookingForm.svelte
│   │   │   │   └── Navbar.svelte
│   │   │   ├── 📁 stores/           # Estado global (Svelte stores)
│   │   │   │   ├── serviceStore.ts
│   │   │   │   ├── userStore.ts
│   │   │   │   └── bookingStore.ts
│   │   │   ├── 📁 styles/           # Estilos globais
│   │   │   └── 📁 assets/           # Imagens e recursos
│   │   ├── 📁 routes/               # Páginas e API routes
│   │   │   ├── +page.svelte         # Página inicial
│   │   │   ├── +layout.svelte       # Layout base
│   │   │   ├── 📁 login/
│   │   │   ├── 📁 register/
│   │   │   ├── 📁 services/
│   │   │   └── 📁 prestador/
│   │   ├── app.html                 # Template HTML
│   │   └── app.css                  # Estilos globais
│   ├── 📄 package.json
│   ├── 📄 svelte.config.js
│   ├── 📄 tailwind.config.cjs
│   ├── 📄 vite.config.js
│   ├── 📄 Dockerfile
│   └── 📄 README.md
│
├── ⚙️ backend/                     # API Node.js
│   ├── 📁 src/
│   │   ├── index.js                 # Servidor Express
│   │   └── 📁 routes/               # Endpoints da API
│   │       ├── usuarios.js          # CRUD usuários
│   │       ├── servicos.js          # CRUD serviços
│   │       ├── contratacoes.js      # CRUD contratações
│   │       └── agendas.js           # CRUD agendas
│   ├── 📁 prisma/
│   │   ├── schema.prisma            # Schema do banco
│   │   ├── seed.js                  # Dados iniciais
│   │   └── 📁 migrations/           # Migrações do banco
│   ├── 📄 package.json
│   ├── 📄 Dockerfile
│   ├── 📄 .env
│   └── 📄 README.md
│
└── 📁 docs/                        # Documentação adicional
    ├── api.md                       # Documentação da API
    ├── deployment.md                # Guia de deploy
    └── contributing.md              # Guia de contribuição
```

## 🔌 API Reference

### Base URL
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://api.minimarketplace.com`

### Endpoints Principais

#### Usuários
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

```http
GET /usuarios
# Retorna lista de usuários
```

#### Serviços
```http
GET /servicos
# Lista todos os serviços com variações e prestador

POST /servicos
Content-Type: application/json

{
  "prestadorId": 1,
  "tipo": "Manicure",
  "nome": "Serviço de manicure",
  "descricao": "Descrição do serviço",
  "variacoes": [
    {
      "nome": "Básico",
      "preco": 25.00,
      "duracaoMin": 30
    }
  ]
}
```

#### Contratações
```http
POST /contratacoes
Content-Type: application/json

{
  "clienteId": 1,
  "variacaoId": 1,
  "agendaId": 1
}

GET /contratacoes/cliente/{id}
# Lista contratações de um cliente específico
```

### Códigos de Resposta

| Código | Descrição |
|--------|----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro de validação |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## 🛠 Desenvolvimento

### Comandos Úteis

```bash
# Docker
docker-compose up -d          # Inicia todos os serviços
docker-compose down            # Para todos os serviços
docker-compose logs -f backend # Logs do backend
docker-compose exec db psql -U admin -d marketplace # Acessa o banco

# Prisma
npx prisma studio              # Interface visual do banco
npx prisma db push             # Aplica mudanças no schema
npx prisma db seed             # Executa seed
npx prisma generate            # Gera cliente Prisma

# Frontend
npm run dev                    # Servidor de desenvolvimento
npm run build                  # Build para produção
npm run preview                # Preview do build
```

### Estrutura de Dados de Exemplo

**Serviço com Variações:**
```json
{
  "id": 1,
  "nome": "Serviço de Manicure",
  "descricao": "Profissional com 20 anos de experiência",
  "tipo": "Manicure",
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
```

### Padrões de Código

- **Backend**: ES6 modules, async/await, error handling
- **Frontend**: Composition API, TypeScript para stores, componentes reutilizáveis
- **Database**: Naming em português, relacionamentos explícitos
- **Docker**: Multi-stage builds, volumes para cache

## 🚀 Deploy

### Produção com Docker

```bash
# 1. Build das imagens
docker-compose -f docker-compose.prod.yml build

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 3. Verificação
docker-compose -f docker-compose.prod.yml ps
```

### Variáveis de Produção

```env
# Backend
DATABASE_URL=postgresql://user:pass@db:5432/marketplace
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_BASE=https://api.minimarketplace.com
```

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] SSL/TLS configurado
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo
- [ ] Logs centralizados
- [ ] Health checks funcionando

## 🚧 Roadmap

### Versão 1.1 (Próxima)
- [ ] 🔐 Autenticação JWT + bcrypt
- [ ] 🔒 Middleware de autorização
- [ ] 📧 Sistema de notificações por email
- [ ] 🎨 Melhorias na UI/UX

### Versão 1.2
- [ ] 💳 Integração com gateway de pagamento
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🔔 Notificações push
- [ ] 📊 Dashboard de analytics

### Versão 2.0
- [ ] 📍 Geolocalização de serviços
- [ ] ⭐ Sistema de avaliações e reviews
- [ ] 💬 Chat em tempo real
- [ ] 📱 App mobile nativo
- [ ] 🤖 Recomendações por IA

### Melhorias Técnicas
- [ ] Testes automatizados (Jest + Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento com Prometheus
- [ ] Cache com Redis
- [ ] CDN para assets estáticos

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação da API](./docs/api.md)
2. Verifique os [logs do sistema](#comandos-úteis)
3. Abra uma issue no repositório

## Contato
- E-mail: jvitorbatista29@gmail.com
- [linkedin](https://www.linkedin.com/in/jo%C3%A3o-vitor-batista-silva-50b280279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- João Vitor Batista Silva