import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed...");

  // Usando upsert para o prestador
  const prestador = await prisma.usuario.upsert({
    where: { email: "maria@teste.com" },
    update: {}, // Não faz nada se já existir
    create: {
      nome: "Maria das Dores",
      email: "maria@teste.com",
      senhaHash: "123", // Lembre-se de usar hashes reais em produção
      role: "PRESTADOR",
      servicos: {
        create: {
          tipo: "Manicure",
          nome: "Serviço de manicure excelente",
          descricao: "Profissional com 20 anos de experiência",
          variacoes: {
            create: [
              { nome: "Pé", preco: 20.0, duracaoMin: 30 },
              { nome: "Mão com pintura", preco: 35.0, duracaoMin: 60 },
            ],
          }
        }
      }
    }
  });

  // Usando upsert para o cliente
  const cliente = await prisma.usuario.upsert({
    where: { email: "joao@teste.com" },
    update: {}, // Não faz nada se já existir
    create: {
      nome: "João Cliente",
      email: "joao@teste.com",
      senhaHash: "456", // Lembre-se de usar hashes reais em produção
      role: "CLIENTE"
    }
  });

  console.log({ prestador, cliente });
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
