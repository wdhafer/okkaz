import { createClient } from "@/lib/supabase/server";
import { publishToLeBonCoin } from "@/lib/publishers/leboncoin";
import {
  getListingIdFromBody,
  legacyListingToPublishRequest,
  mergePlatformUpdate,
  PublishValidationError,
  validatePublishBody,
  type PublishRequest,
  type PublishResult,
} from "@/lib/publishers/types";

type ListingRow = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  image_url: string | null;
  platforms: unknown;
};

function isLegacyPayload(body: unknown): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    "listing_id" in body &&
    !("listingId" in body)
  );
}

async function buildPublishRequest(
  body: unknown,
  listing: ListingRow
): Promise<PublishRequest> {
  if (isLegacyPayload(body)) {
    return legacyListingToPublishRequest(listing, body);
  }
  return validatePublishBody(body);
}

async function updateListingPlatform(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listing: ListingRow,
  result: PublishResult
) {
  const platforms = mergePlatformUpdate(listing.platforms, {
    platform: result.platform,
    status: result.status,
    externalId: result.externalId,
    externalUrl: result.externalUrl,
    updatedAt: new Date().toISOString(),
  });

  const { error } = await supabase
    .from("listings")
    .update({ platforms })
    .eq("id", listing.id);

  // TODO: keep this non-blocking for older databases where listings.platforms
  // has not been migrated yet.
  if (error && !error.message.toLowerCase().includes("platforms")) {
    throw new Error(error.message);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const listingId = getListingIdFromBody(body);

    if (!listingId) {
      return Response.json({ error: "listingId est obligatoire." }, { status: 400 });
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id,titre,description,prix,categorie,image_url,platforms")
      .eq("id", listingId)
      .eq("user_id", user.id)
      .single<ListingRow>();

    if (listingError || !listing) {
      return Response.json({ error: "Annonce introuvable." }, { status: 400 });
    }

    const publishRequest = await buildPublishRequest(body, listing);
    const result = await publishToLeBonCoin(publishRequest);
    await updateListingPlatform(supabase, listing, result);

    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof PublishValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Erreur serveur inconnue.";
    return Response.json(
      {
        success: false,
        platform: "leboncoin",
        status: "failed",
        externalUrl: null,
        externalId: null,
        message,
        preparedPayload: {},
      },
      { status: 500 }
    );
  }
}
