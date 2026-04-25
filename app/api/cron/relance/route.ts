import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: stale, error } = await supabase
    .from("negotiations")
    .select("*, listings(titre, prix, description)")
    .eq("status", "replied")
    .lt("created_at", cutoff);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!stale || stale.length === 0) return Response.json({ relances: 0 });

  let count = 0;
  for (const neg of stale) {
    const listing = neg.listings as { titre: string; prix: string; description: string } | null;
    if (!listing) continue;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{
          text: `Tu es un assistant vendeur. Génère un message de relance court et amical (2-3 phrases) pour relancer un acheteur qui n'a pas répondu depuis 48h.

Annonce : ${listing.titre} — ${listing.prix}€
Dernier message de l'acheteur : "${neg.buyer_message}"

Retourne UNIQUEMENT le message de relance, sans guillemets.`,
        }],
      }],
    });

    const relanceMsg = response.text?.trim() ?? "";

    await supabase.from("negotiations").insert({
      listing_id: neg.listing_id,
      seller_id: neg.seller_id,
      buyer_message: "[RELANCE AUTOMATIQUE]",
      seller_reply: relanceMsg,
      status: "replied",
    });

    count++;
  }

  return Response.json({ relances: count });
}
