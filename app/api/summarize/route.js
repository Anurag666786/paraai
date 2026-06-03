import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { text, length } = await request.json();
    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a professional summarizer.

Create a ${length} summary of the following text.

Rules:
- Use bullet points.
- Keep it clear and easy to read.
- Include important facts only.

Text:

${text}
`,
    });

    return Response.json({
      summary: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
