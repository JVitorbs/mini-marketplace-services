import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed...");

  // Limpa dados na ordem de dependência
  await prisma.contratacao.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.variacaoServico.deleteMany();
  await prisma.servico.deleteMany();
  // remover apenas os usuários que nosso seed cria
  await prisma.usuario.deleteMany({
    where: {
      email: {
        in: [
          "maria@teste.com",
          "joao@teste.com",
          "carlos@teste.com",
          "ana@teste.com",
          "roberto@teste.com"
        ]
      }
    }
  });

  // Cria/insere dados (idempotente se rodar de novo)
  const cliente = await prisma.usuario.upsert({
    where: { email: "joao@teste.com" },
    update: {},
    create: {
      nome: "João Cliente",
      email: "joao@teste.com",
      senhaHash: "456",
      role: "CLIENTE"
    }
  });

  const prestadores = [
    {
      email: "maria@teste.com",
      nome: "Maria das Dores",
      senhaHash: "123",
      tipo: "Manicure",
      servicos: [
        { nome: "Pé", preco: 20.0, duracaoMin: 30 },
        { nome: "Mão com pintura", preco: 35.0, duracaoMin: 60 }
      ],
      servicoNome: "Serviço de manicure excelente",
      servicoDescricao: "Profissional com 20 anos de experiência"
    },
    {
      email: "carlos@teste.com",
      nome: "Carlos Eletricista",
      senhaHash: "eletrica123",
      tipo: "Eletricista",
      servicos: [
        { nome: "Instalação de tomada", preco: 50.0, duracaoMin: 45 },
        { nome: "Reparo de curto", preco: 80.0, duracaoMin: 60 },
        { nome: "Troca de disjuntor", preco: 120.0, duracaoMin: 90 }
      ],
      servicoNome: "Serviços elétricos gerais",
      servicoDescricao: "Instalações, reparos e manutenção elétrica residencial"
    },
    {
      email: "ana@teste.com",
      nome: "Ana Pintora",
      senhaHash: "pintura123",
      tipo: "Pintor",
      servicos: [
        { nome: "Quarto (até 12m²)", preco: 200.0, duracaoMin: 180 },
        { nome: "Sala (até 20m²)", preco: 300.0, duracaoMin: 240 },
        { nome: "Pintura externa - metragem", preco: 25.0, duracaoMin: 60 }
      ],
      servicoNome: "Pintura residencial e comercial",
      servicoDescricao: "Pintura interna e externa com preparação de superfícies"
    },
    {
      email: "roberto@teste.com",
      nome: "Roberto Jardineiro",
      senhaHash: "jardim123",
      tipo: "Jardinagem",
      servicos: [
        { nome: "Pequeno (até 50m²)", preco: 40.0, duracaoMin: 45 },
        { nome: "Médio (50-150m²)", preco: 90.0, duracaoMin: 90 },
        { nome: "Poda e limpeza adicional", preco: 60.0, duracaoMin: 60 }
      ],
      servicoNome: "Corte de grama e manutenção de jardins",
      servicoDescricao: "Corte de grama, poda leve e limpeza de canteiros"
    }
  ];

  const created = [];
  for (const p of prestadores) {
    console.log(`➡️  Processando prestador: ${p.email}`);
    try {
      const up = await prisma.usuario.upsert({
        where: { email: p.email },
        update: {
          servicos: {
            create: {
              tipo: p.tipo,
              nome: p.servicoNome,
              descricao: p.servicoDescricao,
              variacoes: {
                create: p.servicos
              }
            }
          }
        },
        create: {
          nome: p.nome,
          email: p.email,
          senhaHash: p.senhaHash,
          role: "PRESTADOR",
          servicos: {
            create: {
              tipo: p.tipo,
              nome: p.servicoNome,
              descricao: p.servicoDescricao,
              variacoes: {
                create: p.servicos
              }
            }
          }
        }
      });
      console.log(`✅ Criado/Atualizado: ${p.email} (id=${up.id})`);
      created.push(up);
    } catch (e) {
      console.error(`❌ Erro no prestador ${p.email}:`, e.message || e);
    }
  }

  console.log({ cliente, created });
  console.log("✅ Seed concluído");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
