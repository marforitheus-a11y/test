import fs from "fs";
import path from "path";

// Caminho compatível com o ambiente serverless da Vercel
const pdfDir  = path.resolve("./frontend/public/pdf");

/**
 * Lista todos os arquivos PDF disponíveis para estudo.
 */
export const listPDFs = (req, res) => {
  try {
    console.log("📁 Buscando PDFs em:", pdfDir);

    if (!fs.existsSync(pdfDir)) {
      console.warn("⚠️ Pasta de PDFs não encontrada:", pdfDir);
      return res.json([]);
    }

    const files = fs.readdirSync(pdfDir).filter((f) => f.endsWith(".pdf"));

    const list = files.map((f) => ({
      name: f.replace(/\.pdf$/i, ""),
      file: f,
      path: `/pdf/${f}`,
    }));

    res.json(list);
  } catch (err) {
    console.error("💥 Erro ao listar PDFs:", err.message);
    res.status(500).json({ error: "Erro interno ao listar PDFs." });
  }
};
