import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const formData = await request.formData();
    const lang = (formData.get("lang") as string) || "fr";

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
          inlineData: {
            mimeType: file.type || "image/jpeg",
            data: base64,
          },
        };
      })
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            {
              text: lang === "en"
                ? `You are an expert in selling second-hand items on marketplaces (eBay, Vinted, Facebook Marketplace).
Analyze this object and return ONLY a valid JSON (no markdown, no backticks) with exactly these fields:
{
  "titre": "catchy generic title (max 60 chars)",
  "description": "complete and convincing sales description (150-250 words)",
  "prix": "suggested price in euros (integer only, e.g. 45)",
  "categorie": "item category (e.g. Electronics, Clothing, Home, Sports, etc.)",
  "marque": "detected brand or null if unknown",
  "modele": "detected model or null if unknown",
  "etat": "new | good | used",
  "couleur": "main color",
  "mots_cles": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "platforms": {
    "vinted": {
      "titre": "Vinted title (max 50 chars, casual style, emojis ok)",
      "description": "Vinted description (concise, emojis, 80-120 words)"
    },
    "leboncoin": {
      "titre": "LeBonCoin title (max 60 chars, precise, brand + model if known)",
      "description": "LeBonCoin description (practical, condition, 100-150 words)"
    },
    "ebay": {
      "titre": "eBay title (max 80 chars, SEO, keywords first)",
      "description": "eBay description (structured, professional, 150-200 words)"
    }
  }
}`
                : `Tu es un expert en vente d'objets d'occasion sur des marketplaces françaises (Vinted, LeBonCoin, eBay).
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

    const raw = response.text ?? "";

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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return Response.json({ error: message }, { status: 500 });
  }
}
