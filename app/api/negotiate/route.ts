import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ConversationMessage = { role: "user" | "assistant"; content: string };

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
    buyer_message,
    context,
  }: {
    listing_id: string;
    buyer_message: string;
    context?: ConversationMessage[];
  } = body;

  if (!listing_id || !buyer_message?.trim()) {
    return Response.json({ error: "Champs manquants" }, { status: 400 });
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

  const prixActuel = parseFloat(listing.prix) || 0;
  const prixMin = prixActuel * 0.7;

  const offerMatch = buyer_message.match(/(\d+(?:[.,]\d{1,2})?)\s*€?/);
  const offeredPrice = offerMatch
    ? parseFloat(offerMatch[1].replace(",", "."))
    : null;

  const offerInstruction =
    offeredPrice !== null && offeredPrice < prixMin
      ? `L'acheteur propose ${offeredPrice}€ — en dessous du minimum (${prixMin.toFixed(0)}€). Décline poliment, explique pourquoi le prix est justifié et suggère un contre-prix entre ${prixMin.toFixed(0)}€ et ${prixActuel}€.`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `Tu es un assistant vendeur pour l'annonce suivante :
Titre: ${listing.titre}
Prix affiché: ${listing.prix}€
Description: ${listing.description}
Catégorie: ${listing.categorie}

Règles absolues :
- Réponds TOUJOURS en français, ton amical mais ferme
- Prix minimum acceptable : ${prixMin.toFixed(0)}€ (70% du prix affiché)
- Si offre < ${prixMin.toFixed(0)}€ → décline poliment, propose contre-prix
- Si question sur l'objet → réponds avec les informations disponibles
- Sois concis : 2-4 phrases maximum
${offerInstruction}`,
      },
      ...(context ?? []),
      { role: "user", content: buyer_message },
    ],
  });

  const reply = response.choices[0]?.message?.content ?? "";

  const offerStatus =
    offeredPrice === null
      ? "no_offer"
      : offeredPrice >= prixActuel
      ? "accepted"
      : offeredPrice >= prixMin
      ? "negotiable"
      : "too_low";

  const { data: negotiation, error: negError } = await supabase
    .from("negotiations")
    .insert({
      listing_id,
      seller_id: user.id,
      buyer_message,
      seller_reply: reply,
      offered_price: offeredPrice,
      status:
        offerStatus === "too_low"
          ? "rejected"
          : offerStatus === "accepted"
          ? "accepted"
          : "replied",
    })
    .select()
    .single();

  if (negError) {
    console.error("Error saving negotiation:", negError.message);
  }

  return Response.json({
    reply,
    negotiation_id: negotiation?.id ?? null,
    offer_status: offerStatus,
    prix_min: prixMin,
    prix_actuel: prixActuel,
  });
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

  let query = supabase
    .from("negotiations")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (listing_id) {
    query = query.eq("listing_id", listing_id);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
