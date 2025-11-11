const BASE_URL = "http://localhost:3001/api";

export async function apiListPDFs(){
  const res = await fetch(`${BASE_URL}/pdfs`);
  return await res.json();
}
export async function apiUploadPDF(file){
  const form = new FormData();
  form.append("pdf", file);
  const res = await fetch(`${BASE_URL}/ai/upload`, { method: "POST", body: form });
  return await res.json();
}
export async function apiGenerateQuestions(data){
  const res = await fetch(`${BASE_URL}/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}
export async function apiListSubjects(){
  const res = await fetch(`${BASE_URL}/quizzes`);
  return await res.json();
}
export async function apiGetQuiz(filename){
  const res = await fetch(`${BASE_URL}/quizzes/${filename}`);
  return await res.json();
}