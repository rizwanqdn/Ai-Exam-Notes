import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    classLevel: String,
    examType: String,
    revisionMode: {
      type: Boolean,
      default: false,
    },
    includeDiagram: {
      type: Boolean,
      default: false, // Changed to Boolean
    },
    includeChart: {
      type: Boolean,
      default: false, // Changed to Boolean
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }, // Automatically manages createdAt and updatedAt
);

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
