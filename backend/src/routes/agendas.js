// src/routes/agendas.js
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Rota de agendas funcionando 🚀" });
});

export default router;
