import express from "express";
import { generateQuestions, upload } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateQuestions);
router.post("/upload", upload.single("pdf"), (req, res) => {
  res.json({ success: true, file: req.file.filename });
});

export default router;
