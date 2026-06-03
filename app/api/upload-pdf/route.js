import pdf from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const length = formData.get("length") || "medium";

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);

    const extractedText = pdfData.text;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a professional summarizer.

Create a ${length} summary of the following PDF content.

Rules:
- Use bullet points.
- Keep it clear and concise.
- Include the most important information.

PDF Content:

${extractedText}
`,
    });

    return Response.json({
      summary: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
