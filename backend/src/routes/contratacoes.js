import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar contratação
router.post("/", async (req, res) => {
  try {
    const { clienteId, variacaoId, agendaId } = req.body;

    // garantir que slot está disponível
    const agenda = await prisma.agenda.findUnique({ where: { id: agendaId } });
    if (!agenda || !agenda.disponivel) {
      return res.status(400).json({ error: "Slot indisponível" });
    }

    // criar contratação
    const contratacao = await prisma.contratacao.create({
      data: {
        clienteId,
        variacaoId,
        agendaId,
        status: "ATIVA"
      }
    });

    // marcar slot como indisponível
    await prisma.agenda.update({
      where: { id: agendaId },
      data: { disponivel: false }
    });

    res.json(contratacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar contratações de um cliente
router.get("/cliente/:id", async (req, res) => {
  const { id } = req.params;
  const contratos = await prisma.contratacao.findMany({
    where: { clienteId: Number(id) },
    include: { variacao: true, agenda: true }
  });
  res.json(contratos);
});

export default router;
