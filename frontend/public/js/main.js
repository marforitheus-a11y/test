import { initGeneratorUI } from "./generatorUI.js";
import { renderFolderUI } from "./quizRenderer.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".tabs button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(tc=>tc.style.display = tc.id===tab ? "block" : "none");
    });
  });
  renderFolderUI(document.getElementById("appRoot"));
  initGeneratorUI();
});