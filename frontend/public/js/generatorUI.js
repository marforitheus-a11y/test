import { apiListPDFs, apiUploadPDF, apiGenerateQuestions } from "./api.js";

export function initGeneratorUI(){
  loadPDFSelect();

  document.getElementById("pdfUpload").addEventListener("change", async (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const res = await apiUploadPDF(f);
    alert("PDF enviado: " + res.file);
    loadPDFSelect();
  });

  document.getElementById("generateBtn").addEventListener("click", async ()=>{
    const promptExtra = document.getElementById("prompt").value;
    const theme = document.getElementById("themeName").value.trim();
    const qtd = parseInt(document.getElementById("questionCountAI").value);
    const pdfPages = document.getElementById("pdfPages").value;
    const pdfSelect = document.getElementById("pdfSelect");
    const pdfFiles = Array.from(pdfSelect.selectedOptions).map(o=>o.value);
    if(!theme || !qtd) return alert("Preencha tema e quantidade");
    const payload = { prompt: promptExtra, theme, qtd, pdfPages, pdfFiles };
    const res = await apiGenerateQuestions(payload);
    document.getElementById("generationResult").textContent = JSON.stringify(res, null, 2);
  });

  document.getElementById("clearGen").addEventListener("click", ()=>{
    document.getElementById("prompt").value="";
    document.getElementById("themeName").value="";
    document.getElementById("pdfPages").value="";
    document.getElementById("generationResult").textContent="Resultados aparecerão aqui";
  });
}

async function loadPDFSelect(){
  const pdfs = await apiListPDFs().catch(()=>[]);
  const sel = document.getElementById("pdfSelect");
  sel.innerHTML = pdfs.map(p=>`<option value="${p.file}">${p.name}</option>`).join("");
}