import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

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
    existingPlatforms.vinted &&
    (existingPlatforms.vinted as { status?: string }).status === "published"
  ) {
    return Response.json({ error: "Déjà publié sur Vinted" }, { status: 409 });
  }

  const optimized = await generateVintedContent(listing);

  const updatedPlatforms = {
    ...existingPlatforms,
    vinted: {
      status: "ready",
      titre: optimized.titre,
      description: optimized.description,
      prix_suggere: listing.prix,
      prepared_at: new Date().toISOString(),
      note: "Vinted ne dispose pas d'API publique officielle. Copiez le contenu ci-dessous pour publier manuellement.",
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
    platform: "vinted",
    content: {
      titre: optimized.titre,
      description: optimized.description,
      prix: listing.prix,
      categorie: listing.categorie,
    },
    instructions:
      "Vinted ne dispose pas d'API publique. Copiez le titre et la description ci-dessus pour créer votre annonce sur vinted.fr.",
  });
}

async function generateVintedContent(listing: {
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  platforms?: unknown;
}) {
  const platforms = listing.platforms as
    | { vinted?: { titre?: string; description?: string } }
    | undefined;
  if (platforms?.vinted?.titre) {
    return {
      titre: platforms.vinted.titre,
      description: platforms.vinted.description ?? listing.description,
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Reformule ce titre et cette description pour Vinted (style casual, emojis bienvenus, communauté jeune).

Titre original : ${listing.titre}
Description originale : ${listing.description}
Catégorie : ${listing.categorie}

Retourne UNIQUEMENT un JSON valide :
{"titre": "...", "description": "..."}

Contraintes : titre max 50 chars, description 80-120 mots.`,
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
