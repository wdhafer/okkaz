import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const formData = await request.formData();

  const images: File[] = [];

  const singleImage = formData.get("image") as File | null;
  if (singleImage && singleImage.size > 0) images.push(singleImage);

  for (let i = 0; i < 5; i++) {
    const img = formData.get(`image_${i}`) as File | null;
    if (img && img.size > 0) images.push(img);
  }

  if (images.length === 0) {
    return Response.json({ error: "Aucune image fournie." }, { status: 400 });
  }

  const imageParts = await Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return {
        type: "image_url" as const,
        image_url: {
          url: `data:${file.type || "image/jpeg"};base64,${base64}`,
          detail: "high" as const,
        },
      };
    })
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: [
          ...imageParts,
          {
            type: "text",
            text: `Tu es un expert en vente d'objets d'occasion sur des marketplaces françaises (Vinted, LeBonCoin, eBay).
Analyse cet objet et retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) avec exactement ces champs :
{
  "titre": "titre accrocheur générique (max 60 caractères)",
  "description": "description de vente complète et convaincante (150-250 mots)",
  "prix": "prix suggéré en euros (nombre entier uniquement, ex: 45)",
  "categorie": "catégorie de l'objet (ex: Électronique, Vêtements, Maison, Sport, etc.)",
  "marque": "marque détectée ou null si inconnue",
  "modele": "modèle détecté ou null si inconnu",
  "etat": "neuf | bon | usé",
  "couleur": "couleur principale",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "platforms": {
    "vinted": {
      "titre": "titre Vinted (max 50 chars, style casual, emojis ok)",
      "description": "description Vinted (concise, emojis, 80-120 mots)"
    },
    "leboncoin": {
      "titre": "titre LeBonCoin (max 60 chars, précis, marque + modèle si connu)",
      "description": "description LeBonCoin (pratique, état, dimensions si pertinent, 100-150 mots)"
    },
    "ebay": {
      "titre": "titre eBay (max 80 chars, SEO, mots-clés en premier)",
      "description": "description eBay (structurée, professionnelle, 150-200 mots)"
    }
  }
}`,
          },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return Response.json({ error: "Réponse IA invalide." }, { status: 500 });
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return Response.json({ error: "Réponse IA invalide." }, { status: 500 });
    }
  }

  return Response.json(parsed);
}
