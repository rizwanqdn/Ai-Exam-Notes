import process from "node:process";

const Gemini_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

export const geminiGenerateResponse = async (prompt) => {
  try {
    const url = `${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown API Error");
    }

    // Navigating the response object to find the text
    // Path: candidates[0] -> content -> parts[0] -> text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("no rext return from gemini");
    }
    let cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};
