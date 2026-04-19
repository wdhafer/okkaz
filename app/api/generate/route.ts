import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return Response.json({ error: "Aucune image fournie." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: file.type || "image/jpeg",
              data: base64,
            },
          },
          {
            text: `Tu es un expert en vente d'objets d'occasion sur des marketplaces françaises (Vinted, LeBonCoin, eBay).
Analyse cet objet et retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) avec exactement ces champs :
{
  "titre": "titre accrocheur de l'annonce (max 60 caractères)",
  "description": "description de vente complète et convaincante (150-250 mots)",
  "prix": "prix suggéré en euros (nombre entier uniquement, ex: 45)",
  "categorie": "catégorie de l'objet (ex: Électronique, Vêtements, Maison, Sport, etc.)"
}`,
          },
        ],
      },
    ],
  });

  const raw = response.text ?? "";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return Response.json({ error: "Réponse IA invalide." }, { status: 500 });
    }
    parsed = JSON.parse(match[0]);
  }

  return Response.json(parsed);
}
