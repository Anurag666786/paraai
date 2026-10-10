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
    const base64Data = buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type || "application/pdf",
          },
        },
        `You are a professional summarizer.

Create a ${length} summary of the attached PDF document.

Rules:
- Use bullet points.
- Keep it clear and concise.
- Include the most important information.`,
      ],
    });

    return Response.json({
      summary: response.text,
    });
  } catch (error) {
    console.error("Failed to process PDF:", error);

    return Response.json(
      { error: error?.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}

