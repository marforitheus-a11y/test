import fs from "fs";
import path from "path";
import multer from "multer";
import fetch from "node-fetch";

const uploadDir = path.join(process.cwd(), "backend/uploads");
const dataDir = path.join(process.cwd(), "backend/data");
const jsonDir = path.join(process.cwd(), "frontend/public/json"); // onde fica o index.json e os temas do frontend

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

// configuração de upload de PDFs
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
export const upload = multer({ storage });

/**
 * Função principal — gera novas questões e atualiza index.json automaticamente
 */
export const generateQuestions = async (req, res) => {
  const { prompt, theme, qtd, pdfPages, pdfFiles } = req.body;

  try {
    // 🧠 Cria o prompt composto que será usado no Gemini
    const composedPrompt = `
Quero ${qtd} questões de nível concurso público sobre o tema "${theme}".
${pdfFiles?.length ? `Use como base os PDFs: ${pdfFiles.join(", ")}${pdfPages ? ` (páginas ${pdfPages})` : ""}.` : ""}
Formato de resposta: JSON array no padrão:
[
  {
    "id": "700001",
    "disciplina": "Legislação Federal",
    "assunto": "Tema da questão",
    "banca": "IDCAP (Simulado)",
    "instituicao": "Simulado Concurso Portuário",
    "ano": "2025",
    "cargo": "Analista Portuário (Simulado)",
    "nivel": "Superior",
    "enunciado": "Texto da questão.",
    "alternativas": { "A":"...", "B":"...", "C":"...", "D":"...", "E":"..." },
    "resposta_correta": "C",
    "comentario": "Comentário explicando a resposta correta."
  }
]
${prompt ? `Instruções adicionais: ${prompt}` : ""}
    `.trim();

    // ⚙️ AQUI você colocaria a chamada real ao Gemini:
    /*
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: composedPrompt }] }] }),
      }
    );
    const json = await response.json();
    const aiText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const questions = JSON.parse(aiText);
    */

    // 🔹 Simulação local de resposta (até conectar o Gemini)
    const questions = [];
    for (let i = 0; i < Number(qtd || 1); i++) {
      questions.push({
        id: String(Date.now() + i),
        disciplina: "Legislação Federal",
        assunto: theme,
        banca: "IDCAP (Simulado)",
        instituicao: "Simulado Concurso Portuário",
        ano: "2025",
        cargo: "Analista Portuário (Simulado)",
        nivel: "Superior",
        enunciado: `Questão gerada automaticamente sobre ${theme}.`,
        alternativas: { A: "Opção A", B: "Opção B", C: "Opção C", D: "Opção D", E: "Opção E" },
        resposta_correta: "C",
        comentario: "Comentário exemplo gerado automaticamente.",
      });
    }

    // 🔸 Nome seguro do arquivo
    const safeName = theme.replace(/[^a-z0-9_\-]/gi, "_");
    const newFileName = `${safeName}.json`;
    const filePath = path.join(jsonDir, newFileName);

    // 🔹 Salva ou adiciona as questões no arquivo JSON do tema
    let existing = [];
    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    existing.push(...questions);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");

    // ✅ Atualiza automaticamente o index.json (adiciona o novo tema se não existir)
    const indexPath = path.join(jsonDir, "index.json");
    let indexData = [];

    if (fs.existsSync(indexPath)) {
      try {
        indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
      } catch {
        indexData = [];
      }
    }

    // verifica se o tema já existe no index
    const alreadyExists = indexData.some((i) => i.file === newFileName);
    if (!alreadyExists) {
      indexData.push({
        name: theme,
        file: newFileName,
      });
      fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), "utf-8");
      console.log(`📘 index.json atualizado com novo tema: ${theme}`);
    }

    // 🔹 Retorna sucesso
    res.json({
      success: true,
      message: `Arquivo ${newFileName} atualizado e index.json sincronizado.`,
      questions,
    });
  } catch (err) {
    console.error("❌ Erro ao gerar questões:", err);
    res.status(500).json({ error: "Erro ao gerar e salvar questões." });
  }
};