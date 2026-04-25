import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const EBAY_API_URL =
  process.env.EBAY_SANDBOX === "true"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com";

async function getEbayToken(): Promise<string | null> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch(`${EBAY_API_URL}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function POST(request: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    existingPlatforms.ebay &&
    (existingPlatforms.ebay as { status?: string }).status === "published"
  ) {
    return Response.json({ error: "Déjà publié sur eBay" }, { status: 409 });
  }

  const optimized = await generateEbayContent(listing);

  const token = await getEbayToken();

  if (!token) {
    const updatedPlatforms = {
      ...existingPlatforms,
      ebay: {
        status: "ready",
        titre: optimized.titre,
        description: optimized.description,
        prix_suggere: listing.prix,
        prepared_at: new Date().toISOString(),
        note: "Configurez EBAY_CLIENT_ID et EBAY_CLIENT_SECRET pour activer la publication automatique.",
      },
    };

    await supabase
      .from("listings")
      .update({ platforms: updatedPlatforms })
      .eq("id", listing_id);

    return Response.json({
      status: "ready",
      platform: "ebay",
      content: {
        titre: optimized.titre,
        description: optimized.description,
        prix: listing.prix,
      },
      instructions:
        "Ajoutez EBAY_CLIENT_ID et EBAY_CLIENT_SECRET dans .env.local pour activer la publication automatique via l'API eBay.",
    });
  }

  const ebayPayload = {
    title: optimized.titre,
    description: optimized.description,
    primaryCategory: { categoryId: mapCategoryToEbay(listing.categorie) },
    startPrice: { value: listing.prix, currencyID: "EUR" },
    country: "FR",
    currency: "EUR",
    dispatchTimeMax: 3,
    listingDuration: "Days_30",
    listingType: "FixedPriceItem",
    paymentMethods: ["PayPal"],
    returnPolicy: {
      returnsAcceptedOption: "ReturnsAccepted",
      refundOption: "MoneyBack",
      returnsWithinOption: "Days_30",
      shippingCostPaidByOption: "Buyer",
    },
    shippingDetails: {
      shippingServiceOptions: [
        {
          shippingServicePriority: 1,
          shippingService: "FR_LaPosteColissimo",
          shippingServiceCost: { value: "5.99", currencyID: "EUR" },
        },
      ],
    },
    site: "France",
  };

  const ebayRes = await fetch(
    `${EBAY_API_URL}/sell/inventory/v1/offer`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": "fr-FR",
      },
      body: JSON.stringify(ebayPayload),
    }
  );

  if (!ebayRes.ok) {
    const errData = await ebayRes.json().catch(() => ({}));
    const updatedPlatforms = {
      ...existingPlatforms,
      ebay: {
        status: "error",
        error: JSON.stringify(errData),
        titre: optimized.titre,
        description: optimized.description,
        prepared_at: new Date().toISOString(),
      },
    };
    await supabase
      .from("listings")
      .update({ platforms: updatedPlatforms })
      .eq("id", listing_id);
    return Response.json(
      { error: "Erreur eBay API", details: errData },
      { status: 502 }
    );
  }

  const ebayData = await ebayRes.json();
  const listingUrl = `https://www.ebay.fr/itm/${ebayData.itemId ?? ""}`;

  const updatedPlatforms = {
    ...existingPlatforms,
    ebay: {
      status: "published",
      item_id: ebayData.itemId,
      listing_url: listingUrl,
      titre: optimized.titre,
      description: optimized.description,
      published_at: new Date().toISOString(),
    },
  };

  await supabase
    .from("listings")
    .update({ platforms: updatedPlatforms })
    .eq("id", listing_id);

  return Response.json({
    status: "published",
    platform: "ebay",
    item_id: ebayData.itemId,
    listing_url: listingUrl,
  });
}

function mapCategoryToEbay(categorie: string): string {
  const categoryMap: Record<string, string> = {
    Électronique: "293",
    Informatique: "58058",
    Téléphonie: "15032",
    Vêtements: "11450",
    Chaussures: "63889",
    Maison: "11700",
    Jardin: "159912",
    Sport: "888",
    Jeux: "1249",
    Livres: "267",
    Musique: "11233",
    Automobile: "6000",
    Bijoux: "281",
    "Art & Antiquités": "20081",
  };

  for (const [key, id] of Object.entries(categoryMap)) {
    if (categorie.toLowerCase().includes(key.toLowerCase())) return id;
  }
  return "99";
}

async function generateEbayContent(listing: {
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  platforms?: unknown;
}) {
  const platforms = listing.platforms as
    | { ebay?: { titre?: string; description?: string } }
    | undefined;
  if (platforms?.ebay?.titre) {
    return {
      titre: platforms.ebay.titre,
      description: platforms.ebay.description ?? listing.description,
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Reformule ce titre et cette description pour eBay (SEO, professionnel, mots-clés en premier).

Titre original : ${listing.titre}
Description originale : ${listing.description}
Catégorie : ${listing.categorie}

Retourne UNIQUEMENT un JSON valide :
{"titre": "...", "description": "..."}

Contraintes : titre max 80 chars (commence par les mots-clés principaux), description 150-200 mots (structurée, professionnelle, liste les caractéristiques).`,
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
