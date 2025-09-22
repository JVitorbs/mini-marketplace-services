import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // cria prestador
  const prestador = await prisma.usuario.create({
    data: {
      nome: "Maria das Dores",
      email: "maria@teste.com",
      senhaHash: "123",
      role: "PRESTADOR",
      servicos: {
        create: {
          tipo: "Manicure",
          nome: "Serviço de manicure excelente",
          descricao: "Profissional com 20 anos de experiência",
          variacoes: {
            create: [
              { nome: "Pé", preco: 20.0, duracaoMin: 30 },
              { nome: "Mão com pintura", preco: 35.0, duracaoMin: 60 }
            ]
          }
        }
      }
    }
  });

  // cria cliente
  await prisma.usuario.create({
    data: {
      nome: "João Cliente",
      email: "joao@teste.com",
      senhaHash: "456",
      role: "CLIENTE"
    }
  });

  console.log("✅ Seed concluído");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
