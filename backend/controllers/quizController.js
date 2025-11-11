import fs from "fs";
import path from "path";

// Caminho seguro e compatível com Vercel (usa path.resolve)
const jsonDir = path.resolve("./frontend/public/json");

/**
 * Lista todos os temas (arquivos JSON) definidos no index.json.
 */
export const listSubjects = (req, res) => {
  try {
    const indexPath = path.join(jsonDir, "index.json");
    console.log("📂 Buscando lista de quizzes em:", indexPath);

    if (!fs.existsSync(indexPath)) {
      console.warn("⚠️ Nenhum index.json encontrado, retornando lista vazia");
      return res.json([]);
    }

    const raw = fs.readFileSync(indexPath, "utf-8");
    const arr = JSON.parse(raw);

    const enriched = arr.map((s) => {
      try {
        const filePath = path.join(jsonDir, s.file);
        if (!fs.existsSync(filePath)) {
          console.warn("⚠️ Arquivo ausente:", filePath);
          return { ...s, count: 0 };
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return { ...s, count: Array.isArray(data) ? data.length : 0 };
      } catch (err) {
        console.error("❌ Erro ao ler arquivo de questões:", s.file, err.message);
        return { ...s, count: 0 };
      }
    });

    res.json(enriched);
  } catch (err) {
    console.error("💥 Erro geral em listSubjects:", err.message);
    res.status(500).json({ error: "Erro interno ao listar quizzes." });
  }
};

/**
 * Lê e retorna o conteúdo de um arquivo JSON de questões específico.
 */
export const getQuizFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(jsonDir, filename);
    console.log("📘 Carregando arquivo de questões:", filePath);

    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ Arquivo não encontrado:", filename);
      return res.status(404).json({ error: "Arquivo de questões não encontrado." });
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);
    res.json(parsed);
  } catch (err) {
    console.error("💥 Erro ao carregar quiz:", err.message);
    res.status(500).json({ error: "Erro interno ao carregar o quiz." });
  }
};
