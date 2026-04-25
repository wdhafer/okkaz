import type {
  PublishAdapter,
  PublishRequest,
  PublishResult,
} from "./types";

const EBAY_API_URL =
  process.env.EBAY_SANDBOX === "true"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com";

function mapCategoryToEbay(category: string): string {
  const categoryMap: Record<string, string> = {
    electronique: "293",
    informatique: "58058",
    telephonie: "15032",
    vetements: "11450",
    chaussures: "63889",
    maison: "11700",
    jardin: "159912",
    sport: "888",
    jeux: "1249",
    livres: "267",
    musique: "11233",
    automobile: "6000",
    bijoux: "281",
  };

  const normalized = category
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  for (const [label, id] of Object.entries(categoryMap)) {
    if (normalized.includes(label)) return id;
  }

  return "99";
}

function buildEbayPayload(listing: PublishRequest) {
  return {
    sku: listing.listingId,
    availability: {
      shipToLocationAvailability: {
        quantity: 1,
      },
    },
    condition: listing.condition === "new" ? "NEW" : "USED_EXCELLENT",
    product: {
      title: listing.title.slice(0, 80),
      description: listing.description,
      imageUrls: listing.photos,
      aspects: {
        Brand: listing.brand ? [listing.brand] : undefined,
        Model: listing.model ? [listing.model] : undefined,
        Color: listing.color ? [listing.color] : undefined,
        Keywords: listing.keywords.length ? listing.keywords : undefined,
      },
    },
    offer: {
      marketplaceId: "EBAY_FR",
      format: "FIXED_PRICE",
      availableQuantity: 1,
      categoryId: mapCategoryToEbay(listing.category),
      pricingSummary: {
        price: {
          value: listing.price.toFixed(2),
          currency: listing.currency,
        },
      },
    },
  };
}

async function putInventoryItem(
  accessToken: string,
  listing: PublishRequest,
  payload: ReturnType<typeof buildEbayPayload>
) {
  const inventoryRes = await fetch(
    `${EBAY_API_URL}/sell/inventory/v1/inventory_item/${encodeURIComponent(
      listing.listingId
    )}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Content-Language": "fr-FR",
      },
      body: JSON.stringify({
        availability: payload.availability,
        condition: payload.condition,
        product: payload.product,
      }),
    }
  );

  if (!inventoryRes.ok) {
    const details = await inventoryRes.json().catch(() => ({}));
    throw new Error(`Erreur eBay inventory_item: ${JSON.stringify(details)}`);
  }
}

export const publishToEbay: PublishAdapter = async (
  listing
): Promise<PublishResult> => {
  const preparedPayload = buildEbayPayload(listing);
  const accessToken = process.env.EBAY_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      success: true,
      platform: "ebay",
      status: "manual_required",
      externalUrl: null,
      externalId: null,
      message:
        "Publication automatique eBay non configuree : EBAY_ACCESS_TOKEN est absent. Le payload officiel Inventory API est prepare.",
      preparedPayload,
    };
  }

  await putInventoryItem(accessToken, listing, preparedPayload);

  return {
    success: true,
    platform: "ebay",
    status: "published",
    externalUrl: null,
    externalId: listing.listingId,
    message:
      "Inventory item eBay cree ou mis a jour. La creation/publication d'offre reste a finaliser avec les policies vendeur eBay.",
    preparedPayload,
  };
};
