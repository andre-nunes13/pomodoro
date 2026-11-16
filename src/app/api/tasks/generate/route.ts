import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { prompt, quantity = 5, language = "en" } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "A prompt is required" }, { status: 400 });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.REACT_APP_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are a high-productivity task organizer assistant in a retro Windows 98 desktop app.
Break down the user's project/goal into exactly ${quantity} actionable, clear, concise subtasks.
Respond ONLY with a valid JSON array of objects with the following schema:
[
  {
    "description": "Short specific actionable task title",
    "category": "Work" | "Study" | "Personal" | "Leisure" | "Other",
    "priority": "High" | "Medium" | "Low"
  }
]
Write the task descriptions in the requested language: "${language}".`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
          },
        });

        const text = response.text?.trim();
        if (text) {
          const tasks = JSON.parse(text);
          return NextResponse.json({ tasks, source: "gemini" });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to smart heuristic generator:", geminiError);
      }
    }

    // Smart heuristic fallback generator when API key is missing or offline
    const isPt = language === "pt";
    const isEs = language === "es";

    const defaultFallbacks = isPt
      ? [
          { description: `Definir escopo e metas para: ${prompt}`, category: "Work", priority: "High" },
          { description: `Pesquisar materiais e referências sobre ${prompt}`, category: "Study", priority: "Medium" },
          { description: `Criar primeiro esboço e plano de execução`, category: "Work", priority: "High" },
          { description: `Revisar e testar os resultados iniciais`, category: "Work", priority: "Medium" },
          { description: `Organizar entrega final e documentação`, category: "Other", priority: "Low" },
        ]
      : isEs
      ? [
          { description: `Definir alcance y objetivos para: ${prompt}`, category: "Work", priority: "High" },
          { description: `Investigar materiales de referencia sobre ${prompt}`, category: "Study", priority: "Medium" },
          { description: `Crear primer borrador y plan de acción`, category: "Work", priority: "High" },
          { description: `Revisar y probar resultados clave`, category: "Work", priority: "Medium" },
          { description: `Preparar entrega final y notas`, category: "Other", priority: "Low" },
        ]
      : [
          { description: `Define core scope & objectives for: ${prompt}`, category: "Work", priority: "High" },
          { description: `Research references and tools for ${prompt}`, category: "Study", priority: "Medium" },
          { description: `Build initial draft and action roadmap`, category: "Work", priority: "High" },
          { description: `Execute review and milestone testing`, category: "Work", priority: "Medium" },
          { description: `Finalize documentation and celebration`, category: "Other", priority: "Low" },
        ];

    const tasks = defaultFallbacks.slice(0, quantity);
    return NextResponse.json({ tasks, source: "smart_template" });
  } catch (error) {
    console.error("Task generation error:", error);
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
  }
}
