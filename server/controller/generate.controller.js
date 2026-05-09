import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import { geminiGenerateResponse } from "../service/gemini.service.js";
import { buildPrompt } from "../utils/promtBuilder.js";

export const generatNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false,
    } = req.body;
    if (!topic) {
      return res.status(500).json({ message: "topic not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(500).json({ message: "user not found" });
    }
    if (user.credits < 10) {
      user.isCreditAvalable = false;
      await user.save();

      return res
        .status(403)
        .json({ message: "your credit is not sufficient for generate note" });
    }

    let prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    });
    console.log(revisionMode);
    let aiResponse = await geminiGenerateResponse(prompt);
    if (!aiResponse) {
      return res.status(500).json({ message: "gemini notes generate failed" });
    }

    const notes = await Notes.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: aiResponse,
    });
    user.credits -= 10;
    if (user.credits <= 10) {
      user.isCreditAvalable = false;
    }
    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }
    user.notes.push(notes._id);

    await user.save();
    return res
      .status(200)
      .json({ data: aiResponse, notesId: notes._id, creditLeft: user.credits });
  } catch (error) {
    return res.status(500).json({ message: `ai generate error ${error}` });
  }
};
export const fetchNotes = async (req, res) => {
  try {
    const userId = req.userId;
    // Added .sort() to ensure the newest notes appear first
    const notes = await Notes.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error while fetching notes: ${error.message}` });
  }
};
export const fetchNoteById = async (req, res) => {
  try {
    const userId = req.userId; // From your auth middleware
    const noteId = req.params.id; // Grab the ID from the URL

    // Find the note, but ONLY if it belongs to the logged-in user
    const note = await Notes.findOne({ _id: noteId, user: userId });

    if (!note) {
      return res
        .status(404)
        .json({
          message: "Note not found or you do not have permission to view it.",
        });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error while fetching single note: ${error.message}` });
  }
};
