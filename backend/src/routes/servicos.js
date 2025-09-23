import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar serviço + variações
router.post("/", async (req, res) => {
  try {
    const { prestadorId, tipo, nome, descricao, variacoes } = req.body;

    const servico = await prisma.servico.create({
      data: {
        prestadorId,
        tipo,
        nome,
        descricao,
        variacoes: {
          create: variacoes // array [{ nome, preco, duracaoMin }]
        }
      },
      include: { variacoes: true }
    });

    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar serviços
router.get("/", async (req, res) => {
  const servicos = await prisma.servico.findMany({
    include: { variacoes: true, prestador: true }
  });
  res.json(servicos);
});

export default router;
