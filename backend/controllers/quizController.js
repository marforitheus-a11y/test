import fs from "fs";
import path from "path";

const jsonDir = path.join(process.cwd(), "frontend/public/json");

/**
 * Lista todos os temas disponíveis no index.json
 * Cada tema contém nome, arquivo e quantidade de questões.
 */
export const listSubjects = (req, res) => {
  try {
    const indexPath = path.join(jsonDir, "index.json");
    if (!fs.existsSync(indexPath)) {
      return res.json([]);
    }

    const raw = fs.readFileSync(indexPath, "utf-8");
    const arr = JSON.parse(raw);

    // Adiciona a contagem de questões de cada arquivo
    const enriched = arr.map((s) => {
      try {
        const filePath = path.join(jsonDir, s.file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return { ...s, count: Array.isArray(data) ? data.length : 0 };
      } catch {
        return { ...s, count: 0 };
      }
    });

    res.json(enriched);
  } catch (err) {
    console.error("Erro ao listar subjects:", err);
    res.status(500).json({ error: "Erro ao listar matérias." });
  }
};

/**
 * Lê o arquivo JSON de um tema específico e retorna as questões.
 */
export const getQuizFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(jsonDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Erro ao ler JSON:", err);
    res.status(500).json({ error: "Erro ao carregar o arquivo JSON." });
  }
};