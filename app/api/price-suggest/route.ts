import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const {
    listing_id,
    titre,
    categorie,
    etat,
    marque,
    modele,
  }: {
    listing_id?: string;
    titre: string;
    categorie: string;
    etat: "neuf" | "bon" | "usé";
    marque?: string | null;
    modele?: string | null;
  } = body;

  if (!titre || !categorie || !etat) {
    return Response.json({ error: "Champs manquants" }, { status: 400 });
  }

  const itemDesc = [marque, modele, titre].filter(Boolean).join(" ");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyse le marché de l'occasion en France pour cet objet et propose une fourchette de prix réaliste.

Objet : ${itemDesc}
Catégorie : ${categorie}
État : ${etat}

Utilise tes connaissances du marché de l'occasion français (Vinted, LeBonCoin, eBay.fr) pour estimer les prix actuels.

Retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) :
{
  "prix_min": <nombre entier, prix bas du marché>,
  "prix_max": <nombre entier, prix haut du marché>,
  "prix_recommande": <nombre entier, prix optimal pour vendre rapidement>,
  "analyse": "explication courte de la fourchette (2-3 phrases)",
  "facteurs": ["facteur1", "facteur2", "facteur3"]
}`,
          },
        ],
      },
    ],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const raw = response.text ?? "";

  let parsed: {
    prix_min: number;
    prix_max: number;
    prix_recommande: number;
    analyse: string;
    facteurs?: string[];
  };

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

  if (listing_id) {
    const { error: histError } = await supabase.from("price_history").insert({
      listing_id,
      user_id: user.id,
      prix_min: parsed.prix_min,
      prix_max: parsed.prix_max,
      prix_recommande: parsed.prix_recommande,
      "analyse": parsed.analyse,
    });

    if (histError) {
      console.error("Error saving price history:", histError.message);
    }
  }

  return Response.json(parsed);
}

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listing_id = searchParams.get("listing_id");

  if (!listing_id) {
    return Response.json({ error: "listing_id requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("listing_id", listing_id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
