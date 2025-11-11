import express from "express";
import { listSubjects, getQuizFile } from "../controllers/quizController.js";

const router = express.Router();

// Rota GET /api/quizzes → lista todos os temas (JSONs)
router.get("/", listSubjects);

// Rota GET /api/quizzes/:filename → retorna o conteúdo de um JSON específico
router.get("/:filename", getQuizFile);

export default router;