import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import usuarioRoutes from "./routes/usuarios.js";
import servicoRoutes from "./routes/servicos.js";
import contratacaoRoutes from "./routes/contratacoes.js";
import agendaRoutes from "./routes/agendas.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/servicos", servicoRoutes);
app.use("/contratacoes", contratacaoRoutes);
app.use("/agendas", agendaRoutes);

// Teste de saúde
app.get("/", (req, res) => res.json({ status: "API rodando 🚀" }));

app.listen(3000, () => {
  console.log("✅ Backend rodando em http://localhost:3000");
});
