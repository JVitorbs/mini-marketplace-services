# Mini Marketplace Services

Sistema completo de marketplace para serviços locais com arquitetura moderna e containerizada.

## 🏗️ Arquitetura do Sistema

```mermaid
C4Context
    title Arquitetura Mini Marketplace

    Person(cliente, "Cliente", "Usuário que contrata serviços")
    Person(prestador, "Prestador", "Usuário que oferece serviços")
    
    System_Boundary(marketplace, "Mini Marketplace") {
        Container(frontend, "Frontend", "SvelteKit", "Interface web responsiva")
        Container(backend, "Backend API", "Node.js + Express", "API REST para negócios")
        ContainerDb(database, "Database", "PostgreSQL", "Dados persistentes")
    }
    
    Rel(cliente, frontend, "Navega e contrata")
    Rel(prestador, frontend, "Gerencia serviços")
    Rel(frontend, backend, "HTTP/JSON")
    Rel(backend, database, "Prisma ORM")
```

## 🚀 Stack Tecnológica

| Camada | Tecnologia | Função |
|--------|------------|--------|
| **Frontend** | SvelteKit + TailwindCSS | Interface moderna e responsiva |
| **Backend** | Node.js + Express + Prisma | API REST com ORM |
| **Database** | PostgreSQL | Persistência de dados |
| **Infra** | Docker + Docker Compose | Containerização e orquestração |

## 📊 Modelo de Dados

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

    Usuario ||--o{ Servico : prestador
    Usuario ||--o{ Agenda : prestador
    Usuario ||--o{ Contratacao : cliente
    Servico ||--o{ VariacaoServico : possui
    Agenda ||--o{ Contratacao : reserva
    VariacaoServico ||--o{ Contratacao : escolhida
```

## 🔄 Fluxo Principal

```mermaid
journey
    title Jornada do Cliente
    section Descoberta
      Acessa marketplace: 5: Cliente
      Filtra serviços: 4: Cliente
      Visualiza detalhes: 5: Cliente
    section Contratação
      Escolhe variação: 4: Cliente
      Seleciona horário: 3: Cliente
      Confirma booking: 5: Cliente
    section Prestador
      Recebe notificação: 4: Prestador
      Confirma agendamento: 5: Prestador
```

## ⚡ Execução Rápida

```bash
# Clone e execute
git clone <repo-url>
cd mini-marketplace-services
docker-compose up -d

# Acesse:
# 🌐 Frontend: http://localhost:5173
# 🔧 Backend: http://localhost:3000  
# 🗄️ Database: localhost:5433
```

## 📁 Estrutura

```
mini-marketplace-services/
├── 🎨 frontend/           # SvelteKit App
│   ├── src/lib/components/  # Componentes UI
│   ├── src/lib/stores/      # Estado global
│   └── src/routes/          # Páginas + API routes
├── ⚙️ backend/            # Node.js API
│   ├── prisma/             # Schema + Seeds
│   └── src/routes/         # Endpoints REST
└── 🐳 docker-compose.yml  # Orquestração
```

## 🎯 Funcionalidades Core

### 👤 Cliente
- Navegar catálogo de serviços
- Filtrar por categoria/localização
- Contratar serviços com agenda
- Gerenciar contratações

### 🔧 Prestador  
- Cadastrar serviços + variações
- Definir agenda de disponibilidade
- Receber e gerenciar contratações
- Dashboard de performance

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/servicos` | Lista serviços disponíveis |
| `POST` | `/servicos` | Cria serviço + variações |
| `POST` | `/contratacoes` | Efetua contratação |
| `GET` | `/contratacoes/cliente/:id` | Histórico do cliente |
| `POST` | `/usuarios` | Registra usuário |

## 🐳 Containerização

```yaml
# docker-compose.yml
services:
  db: postgres:16 (porta 5433)
  backend: node:20 (porta 3000) 
  frontend: node:20 (porta 5173)
```

**Volumes:**
- `db_data` - Persistência PostgreSQL
- `backend_node_modules` - Cache dependências
- `frontend_node_modules` - Cache dependências

## 🚧 Roadmap

- [ ] 🔐 Autenticação JWT + bcrypt
- [ ] 💳 Integração pagamentos (Stripe/PagSeguro)
- [ ] 📱 PWA + notificações push
- [ ] 📍 Geolocalização de serviços
- [ ] ⭐ Sistema de avaliações
- [ ] 📊 Analytics e métricas