import fs from "fs";
import path from "path";

const pdfDir = path.join(process.cwd(), "frontend/public/pdf");

/**
 * Lista todos os PDFs disponíveis na pasta /frontend/public/pdf
 * Retorna um array com nome e caminho de cada PDF.
 */
export const listPDFs = (req, res) => {
  try {
    if (!fs.existsSync(pdfDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(pdfDir).filter((f) => f.endsWith(".pdf"));

    const list = files.map((f) => ({
      name: f.replace(".pdf", ""),
      file: f,
    }));

    res.json(list);
  } catch (err) {
    console.error("Erro ao listar PDFs:", err);
    res.status(500).json({ error: "Erro ao listar PDFs." });
  }
};