import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed...");

  const seedEmails = [
    "maria@teste.com",
    "joao@teste.com",
    "carlos@teste.com",
    "ana@teste.com",
    "roberto@teste.com"
  ];

  // Limpa dados na ordem correta
  await prisma.contratacao.deleteMany().catch(() => {});
  await prisma.agenda.deleteMany().catch(() => {});
  await prisma.variacaoServico.deleteMany().catch(() => {});
  await prisma.servico.deleteMany().catch(() => {});
  await prisma.usuario.deleteMany({ where: { email: { in: seedEmails } } }).catch(() => {});

  // Cliente base (create direto)
  try {
    const cliente = await prisma.usuario.create({
      data: {
        nome: "João Cliente",
        email: "joao@teste.com",
        senhaHash: "456",
        role: "CLIENTE"
      }
    });
    console.log(`✅ Cliente criado: ${cliente.email} (id=${cliente.id})`);
  } catch (e) {
    console.error("❌ Erro criando cliente:", e.message || e);
  }

  const prestadores = [
    {
      email: "maria@teste.com",
      nome: "Maria das Dores",
      senhaHash: "123",
      tipo: "Manicure",
      servicoNome: "Serviço de manicure excelente",
      servicoDescricao: "Profissional com 20 anos de experiência",
      servicos: [
        { nome: "Pé", preco: 20.0, duracaoMin: 30 },
        { nome: "Mão com pintura", preco: 35.0, duracaoMin: 60 }
      ]
    },
    {
      email: "carlos@teste.com",
      nome: "Carlos Eletricista",
      senhaHash: "eletrica123",
      tipo: "Eletricista",
      servicoNome: "Serviços elétricos gerais",
      servicoDescricao: "Instalações, reparos e manutenção elétrica residencial",
      servicos: [
        { nome: "Instalação de tomada", preco: 50.0, duracaoMin: 45 },
        { nome: "Reparo de curto", preco: 80.0, duracaoMin: 60 },
        { nome: "Troca de disjuntor", preco: 120.0, duracaoMin: 90 }
      ]
    },
    {
      email: "ana@teste.com",
      nome: "Ana Pintora",
      senhaHash: "pintura123",
      tipo: "Pintor",
      servicoNome: "Pintura residencial e comercial",
      servicoDescricao: "Pintura interna e externa com preparação de superfícies",
      servicos: [
        { nome: "Quarto (até 12m²)", preco: 200.0, duracaoMin: 180 },
        { nome: "Sala (até 20m²)", preco: 300.0, duracaoMin: 240 },
        { nome: "Pintura externa - metragem", preco: 25.0, duracaoMin: 60 }
      ]
    },
    {
      email: "roberto@teste.com",
      nome: "Roberto Jardineiro",
      senhaHash: "jardim123",
      tipo: "Jardinagem",
      servicoNome: "Corte de grama e manutenção de jardins",
      servicoDescricao: "Corte de grama, poda leve e limpeza de canteiros",
      servicos: [
        { nome: "Pequeno (até 50m²)", preco: 40.0, duracaoMin: 45 },
        { nome: "Médio (50-150m²)", preco: 90.0, duracaoMin: 90 },
        { nome: "Poda e limpeza adicional", preco: 60.0, duracaoMin: 60 }
      ]
    }
  ];

  const created = [];
  for (const p of prestadores) {
    console.log(`➡️  Criando prestador: ${p.email}`);
    try {
      const variacoes = p.servicos.map(v => ({
        nome: v.nome,
        preco: v.preco === undefined ? "0" : String(v.preco),
        duracaoMin: v.duracaoMin ?? 0
      }));

      const u = await prisma.usuario.create({
        data: {
          nome: p.nome,
          email: p.email,
          senhaHash: p.senhaHash,
          role: "PRESTADOR",
          servicos: {
            create: {
              tipo: p.tipo,
              nome: p.servicoNome,
              descricao: p.servicoDescricao,
              variacoes: { create: variacoes }
            }
          }
        },
        include: { servicos: { include: { variacoes: true } } }
      });

      console.log(`✅ Prestador criado: ${u.email} (id=${u.id}) - servico id=${u.servicos[0]?.id}`);
      created.push(u.email);
    } catch (e) {
      console.error(`❌ Falha criando ${p.email}:`, e.message || e);
    }
  }

  console.log("Resumo seed:", { created });
  console.log("✅ Seed concluído");
}

main()
  .catch((e) => {
    console.error("ERROR (main):", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
