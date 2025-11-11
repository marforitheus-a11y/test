import express from "express";
import cors from "cors";
import path from "path";
import quizRoutes from "./routes/quizRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api/quizzes", quizRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/ai", aiRoutes);

// Exporta o app para a Vercel
export default app;

// (Opcional: servidor local para desenvolvimento)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Backend rodando localmente na porta ${PORT}`));
}
