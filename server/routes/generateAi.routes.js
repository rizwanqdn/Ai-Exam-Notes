import express from "express";

import { fetchNoteById, fetchNotes, generatNotes } from "../controller/generate.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const aiGenerate = express.Router();

aiGenerate.post("/generate", isAuth, generatNotes);
aiGenerate.get("/fetchnotes", isAuth, fetchNotes);
aiGenerate.get("/fetchnotes/:id", isAuth, fetchNoteById);
export default aiGenerate;
