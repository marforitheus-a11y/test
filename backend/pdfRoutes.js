import express from "express";
import { listPDFs } from "../controllers/pdfController.js";

const router = express.Router();

// Rota GET /api/pdfs  →  lista todos os PDFs disponíveis
router.get("/", listPDFs);

export default router;