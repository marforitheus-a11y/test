/**
 * API simplificada que lê diretamente os arquivos JSON e PDFs
 * hospedados em /public/json e /public/pdf
 * (sem precisar do backend)
 */

const BASE_PATH_JSON = "/json";
const BASE_PATH_PDF = "/pdf";

/**
 * Lista os temas (JSONs) lendo o arquivo index.json
 */
export async function apiListSubjects() {
  const res = await fetch(`${BASE_PATH_JSON}/index.json`);
  if (!res.ok) throw new Error("Erro ao carregar index.json");
  return res.json();
}

/**
 * Lê um arquivo JSON de questões específico
 * (por exemplo, Lei_12815.json)
 */
export async function apiGetQuiz(filename) {
  const res = await fetch(`${BASE_PATH_JSON}/${filename}`);
  if (!res.ok) throw new Error(`Erro ao carregar o quiz ${filename}`);
  return res.json();
}

/**
 * Lista os PDFs disponíveis na pasta /pdf
 * (requer um arquivo de índice opcional pdf-index.json,
 * ou busca dinâmica a partir do servidor estático)
 */
export async function apiListPDFs() {
  // forma 1: se você tiver um arquivo pdf-index.json
  const res = await fetch(`${BASE_PATH_PDF}/pdf-index.json`);
  if (res.ok) {
    return res.json();
  }

  // forma 2: caso não exista índice, lista PDFs manualmente
  // (você pode personalizar a lista abaixo)
  return [
    { name: "Lei 12815", file: "Lei_12815.pdf", path: `${BASE_PATH_PDF}/Lei_12815.pdf` }
  ];
  /**
 * Envia prompt para o backend gerar questões com Gemini AI
 * e retorna o resultado no formato JSON de questões
 */
export async function apiGenerateQuestions(promptData) {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptData)
    });

    if (!res.ok) throw new Error(`Erro ao gerar questões: ${res.statusText}`);

    return await res.json();
  } catch (err) {
    console.error("Erro em apiGenerateQuestions:", err);
    throw err;
  }
}

}
