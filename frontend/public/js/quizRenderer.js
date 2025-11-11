import { apiListSubjects, apiGetQuiz } from "./api.js";

/**
 * Renderiza o painel de seleção de matérias e o quiz.
 */
export async function renderFolderUI(container) {
  const html = document.createElement("div");
  html.innerHTML = `
    <div class="top-area">
      <div id="folderPanel" class="folder-panel"></div>
      <div class="controls">
        <label>Matéria selecionada</label>
        <div id="selectedSummary" class="select-summary">Nenhuma selecionada</div>
        <label>Quantidade de questões</label>
        <input type="number" id="questionCount" min="1" placeholder="Ex: 5">
        <div style="margin-top:10px">
          <button id="startBtn">Iniciar Quiz</button>
        </div>
      </div>
    </div>
    <div id="quizContainer"></div>
  `;
  container.appendChild(html);

  // Carregar lista de matérias (JSONs)
  try {
    const list = await apiListSubjects();
    buildFolders(list);
  } catch (e) {
    document.getElementById("folderPanel").textContent =
      "❌ Erro ao carregar matérias.";
  }
}

/**
 * Monta a lista em formato de pastas (leis, decretos, etc.)
 */
function buildFolders(list) {
  const root = document.getElementById("folderPanel");
  root.innerHTML = "";

  // Agrupa por prefixo (tudo antes do primeiro "–")
  const groups = {};
  list.forEach((s) => {
    const key = (s.name.split("–")[0] || s.name).trim();
    groups[key] = groups[key] || [];
    groups[key].push(s);
  });

  // Cria o layout de pastas expansíveis
  Object.keys(groups)
    .sort()
    .forEach((g) => {
      const folder = document.createElement("div");
      folder.className = "folder";

      const total = groups[g].reduce((a, b) => a + (b.count || 0), 0);
      folder.innerHTML = `
        <div class="folder-header">
          <div class="folder-title">📂 ${g}</div>
          <div class="folder-count">${total} questões</div>
        </div>
        <ul class="sublist" style="display:none;"></ul>
      `;

      const sublist = folder.querySelector(".sublist");
      groups[g].forEach((item) => {
        const li = document.createElement("li");
        li.className = "subitem";
        li.innerHTML = `
          <div class="name">${item.name}</div>
          <div class="meta">${item.count} questões</div>
        `;
        li.addEventListener("click", () => selectSub(item, li));
        sublist.appendChild(li);
      });

      const header = folder.querySelector(".folder-header");
      header.addEventListener("click", () => {
        sublist.style.display =
          sublist.style.display === "none" ? "block" : "none";
      });

      root.appendChild(folder);
    });
}

let selectedFile = null;

/**
 * Seleciona uma submatéria (páginas, capítulos, etc.)
 */
function selectSub(item, li) {
  document
    .querySelectorAll(".subitem.selected")
    .forEach((e) => e.classList.remove("selected"));
  li.classList.add("selected");

  selectedFile = item.file;
  document.getElementById(
    "selectedSummary"
  ).textContent = `${item.name} — ${item.count} questões`;
}

/**
 * Evento do botão "Iniciar Quiz"
 */
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "startBtn") {
    const count = parseInt(document.getElementById("questionCount").value);
    if (!selectedFile) return alert("Selecione um tema ou pasta.");
    if (!count || count < 1) return alert("Quantidade inválida.");
    startQuiz(selectedFile, count);
  }
});

/**
 * Carrega o arquivo JSON e inicia o quiz.
 */
async function startQuiz(filename, count) {
  const data = await apiGetQuiz(filename);
  const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, count);
  renderQuiz(shuffled);
}

/**
 * Renderiza as questões uma a uma.
 */
function renderQuiz(questions) {
  const container = document.getElementById("quizContainer");
  let current = 0;
  const userAnswers = {};

  function showQuestion(i) {
    const q = questions[i];
    container.innerHTML = `
      <div class="meta">
        <strong>Disciplina:</strong> ${q.disciplina || ""} •
        <strong>Banca:</strong> ${q.banca || ""}
      </div>
      <div class="question">
        <h2>${i + 1}. ${(q.enunciado || "").replace(/\n/g, "<br>")}</h2>
        <ul class="options">
          ${Object.entries(q.alternativas || {})
            .map(
              ([k, v]) =>
                `<li class="option" data-key="${k}">${k}) ${v}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    container.querySelectorAll(".option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const key = opt.getAttribute("data-key");
        const right = q.resposta_correta;
        if (key === right) opt.classList.add("correct");
        else opt.classList.add("wrong");

        userAnswers[q.id] = key;

        setTimeout(() => {
          if (i < questions.length - 1) showQuestion(i + 1);
          else showResults();
        }, 700);
      });
    });
  }

  /**
   * Exibe o resultado final e comentários das questões.
   */
  function showResults() {
    let html = `<h2>Resultado Final</h2>`;
    let correct = 0;

    questions.forEach((q) => {
      const user = userAnswers[q.id];
      if (user === q.resposta_correta) correct++;

      html += `
        <div class="question">
          <h3>${(q.enunciado || "").replace(/\n/g, "<br>")}</h3>
          <ul class="options">
            ${Object.entries(q.alternativas || {})
              .map(([k, v]) => {
                const cls =
                  k === q.resposta_correta
                    ? "correct"
                    : user === k
                    ? "wrong"
                    : "";
                return `<li class="option ${cls}">${k}) ${v}</li>`;
              })
              .join("")}
          </ul>
          ${
            q.comentario
              ? `<div class="comentario"><strong>Comentário:</strong> ${q.comentario.replace(
                  /\n/g,
                  "<br>"
                )}</div>`
              : ""
          }
        </div>
      `;
    });

    html += `
      <div class="result">
        <h3>Você acertou ${correct} de ${questions.length} questões.</h3>
        <button id="reloadBtn">Refazer Quiz</button>
      </div>
    `;

    container.innerHTML = html;
    document
      .getElementById("reloadBtn")
      .addEventListener("click", () => location.reload());
  }

  showQuestion(current);
}