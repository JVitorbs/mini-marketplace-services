import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar usuário
router.post("/", async (req, res) => {
  try {
    const { nome, email, senhaHash, role } = req.body;
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, role }
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar usuários
router.get("/", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

export default router;
