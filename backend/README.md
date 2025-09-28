# Etrutura do Backend

```bash
backend/
│
├── prisma/
│   ├── schema.prisma      # modelos do banco
│   └── seed.js            # dados de exemplo
│
├── src/
│   ├── index.js           # ponto de entrada do servidor
│   ├── routes/
│   │   ├── usuarios.js
│   │   ├── servicos.js
│   │   ├── contratacoes.js
│   │   └── agendas.js
│   ├── controllers/       # lógica de negócio
│   │   ├── usuarioController.js
│   │   ├── servicoController.js
│   │   └── contratacaoController.js
│   └── middlewares/       # (auth, validações futuramente)
│
├── package.json
└── Dockerfile
```

# ERD Marketplace

```mermaid
erDiagram
    Usuario {
        bigint id PK
        string nome
        string email
        string senha_hash
        string role
        datetime criado_em
    }

    Servico {
        bigint id PK
        bigint prestador_id FK
        string tipo
        string nome
        string descricao
        datetime criado_em
    }

    VariacaoServico {
        bigint id PK
        bigint servico_id FK
        string nome
        decimal preco
        int duracao_min
    }

    Agenda {
        bigint id PK
        bigint prestador_id FK
        datetime data_inicio
        datetime data_fim
        boolean disponivel
    }

    Contratacao {
        bigint id PK
        bigint cliente_id FK
        bigint variacao_id FK
        bigint agenda_id FK
        string status
        datetime contratado_em
    }

    %% Relacionamentos
    Usuario ||--o{ Servico : "oferece"
    Servico ||--o{ VariacaoServico : "possui"
    Usuario ||--o{ Agenda : "define"
    Usuario ||--o{ Contratacao : "realiza"
    Agenda ||--o{ Contratacao : "reserva"
    VariacaoServico ||--o{ Contratacao : "escolhida"
```