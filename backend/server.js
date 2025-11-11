import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// rotas principais
app.use("/api/quizzes", quizRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/ai", aiRoutes);

// rota de teste
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API está viva 🚀" });
});

// ✅ exporta o app para a Vercel
export default app;

// ✅ só inicia servidor localmente
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Rodando localmente na porta ${PORT}`));
}
