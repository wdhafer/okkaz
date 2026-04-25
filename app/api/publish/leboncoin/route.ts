import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { listing_id }: { listing_id: string } = body;

  if (!listing_id) {
    return Response.json({ error: "listing_id requis" }, { status: 400 });
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listing_id)
    .eq("user_id", user.id)
    .single();

  if (listingError || !listing) {
    return Response.json({ error: "Annonce introuvable" }, { status: 404 });
  }

  const existingPlatforms = (listing.platforms as Record<string, unknown>) ?? {};
  if (
    existingPlatforms.leboncoin &&
    (existingPlatforms.leboncoin as { status?: string }).status === "published"
  ) {
    return Response.json(
      { error: "Déjà publié sur LeBonCoin" },
      { status: 409 }
    );
  }

  const optimized = await generateLeBonCoinContent(listing);

  const updatedPlatforms = {
    ...existingPlatforms,
    leboncoin: {
      status: "ready",
      titre: optimized.titre,
      description: optimized.description,
      prix_suggere: listing.prix,
      prepared_at: new Date().toISOString(),
      note: "LeBonCoin ne dispose pas d'API publique officielle. Copiez le contenu ci-dessous pour publier manuellement.",
    },
  };

  const { error: updateError } = await supabase
    .from("listings")
    .update({ platforms: updatedPlatforms })
    .eq("id", listing_id);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({
    status: "ready",
    platform: "leboncoin",
    content: {
      titre: optimized.titre,
      description: optimized.description,
      prix: listing.prix,
      categorie: listing.categorie,
    },
    instructions:
      "LeBonCoin ne dispose pas d'API publique. Copiez le titre et la description ci-dessus pour créer votre annonce sur leboncoin.fr.",
  });
}

async function generateLeBonCoinContent(listing: {
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  platforms?: unknown;
}) {
  const platforms = listing.platforms as
    | { leboncoin?: { titre?: string; description?: string } }
    | undefined;
  if (platforms?.leboncoin?.titre) {
    return {
      titre: platforms.leboncoin.titre,
      description: platforms.leboncoin.description ?? listing.description,
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Reformule ce titre et cette description pour LeBonCoin (style pratique, précis, sans emojis, public large).

Titre original : ${listing.titre}
Description originale : ${listing.description}
Catégorie : ${listing.categorie}

Retourne UNIQUEMENT un JSON valide :
{"titre": "...", "description": "..."}

Contraintes : titre max 60 chars, description 100-150 mots, mentionner l'état de l'objet.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    return match
      ? JSON.parse(match[0])
      : { titre: listing.titre, description: listing.description };
  }
}
