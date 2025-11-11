/**
 * Gera um ID único para cada questão ou operação.
 * Usa timestamp + parte aleatória.
 */
export function safeId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
  ).toUpperCase();
}

/**
 * Embaralha um array (útil para randomizar questões ou alternativas).
 * @param {Array} arr - Array a ser embaralhado.
 * @returns {Array} Novo array embaralhado.
 */
export function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Formata texto substituindo quebras de linha (\n) por <br>
 * para exibição segura em HTML.
 */
export function formatText(text) {
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
}

/**
 * Converte um nome de tema em um nome de arquivo seguro (sem caracteres especiais).
 * Exemplo: "Lei 12.815 - Parte 2" → "Lei_12_815_-_Parte_2"
 */
export function safeFilename(name) {
  return name.replace(/[^a-z0-9_\-]/gi, "_");
}

/**
 * Calcula percentual de acertos.
 */
export function percent(correct, total) {
  if (!total) return 0;
  return ((correct / total) * 100).toFixed(1);
}