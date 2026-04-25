export type PublishPlatform = "vinted" | "leboncoin" | "ebay";

export type ListingCondition = "new" | "good" | "used";

export type PublishStatus = "published" | "manual_required" | "failed";

export type PublishRequest = {
  listingId: string;
  title: string;
  description: string;
  price: number;
  currency: "EUR";
  category: string;
  photos: string[];
  keywords: string[];
  condition: ListingCondition;
  brand: string | null;
  model: string | null;
  color: string | null;
};

export type PreparedPayload = Record<string, unknown>;

export type PublishResult = {
  success: boolean;
  platform: PublishPlatform;
  status: PublishStatus;
  externalUrl: string | null;
  externalId: string | null;
  message: string;
  preparedPayload: PreparedPayload;
};

export type PublishAdapter = (
  listing: PublishRequest
) => Promise<PublishResult>;

export type PlatformUpdate = {
  platform: PublishPlatform;
  status: PublishStatus;
  externalId: string | null;
  externalUrl: string | null;
  updatedAt: string;
};

export class PublishValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublishValidationError";
  }
}

type LegacyListing = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  image_url: string | null;
  platforms?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(
  value: unknown,
  field: string,
  options: { nullable?: boolean } = {}
): string | null {
  if (value === null && options.nullable) return null;
  if (typeof value !== "string") {
    throw new PublishValidationError(`${field} doit être une chaîne.`);
  }
  const trimmed = value.trim();
  if (!trimmed && !options.nullable) {
    throw new PublishValidationError(`${field} est obligatoire.`);
  }
  return trimmed || null;
}

function getStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new PublishValidationError(`${field} doit être un tableau.`);
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function validatePublishBody(body: unknown): PublishRequest {
  if (!isRecord(body)) {
    throw new PublishValidationError("Body JSON invalide.");
  }

  const listingId = getString(body.listingId, "listingId");
  const title = getString(body.title, "title");
  const description = getString(body.description, "description");
  const category = getString(body.category, "category");

  if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) {
    throw new PublishValidationError("price doit être un nombre positif.");
  }

  if (body.currency !== "EUR") {
    throw new PublishValidationError('currency doit être "EUR".');
  }

  if (!["new", "good", "used"].includes(String(body.condition))) {
    throw new PublishValidationError("condition doit être new, good ou used.");
  }

  return {
    listingId: listingId ?? "",
    title: title ?? "",
    description: description ?? "",
    price: body.price,
    currency: "EUR",
    category: category ?? "",
    photos: getStringArray(body.photos, "photos"),
    keywords: getStringArray(body.keywords, "keywords"),
    condition: body.condition as ListingCondition,
    brand: getString(body.brand, "brand", { nullable: true }),
    model: getString(body.model, "model", { nullable: true }),
    color: getString(body.color, "color", { nullable: true }),
  };
}

export function legacyListingToPublishRequest(
  listing: LegacyListing,
  body: unknown
): PublishRequest {
  const partial = isRecord(body) ? body : {};
  const price = Number.parseFloat(String(listing.prix).replace(",", "."));

  if (!Number.isFinite(price) || price <= 0) {
    throw new PublishValidationError("Le prix de l'annonce sauvegardée est invalide.");
  }

  return {
    listingId: listing.id,
    title: typeof partial.title === "string" ? partial.title : listing.titre,
    description:
      typeof partial.description === "string"
        ? partial.description
        : listing.description,
    price,
    currency: "EUR",
    category:
      typeof partial.category === "string" ? partial.category : listing.categorie,
    photos:
      Array.isArray(partial.photos) && partial.photos.every((item) => typeof item === "string")
        ? partial.photos
        : listing.image_url
        ? [listing.image_url]
        : [],
    keywords:
      Array.isArray(partial.keywords) && partial.keywords.every((item) => typeof item === "string")
        ? partial.keywords
        : [],
    condition:
      partial.condition === "new" || partial.condition === "used"
        ? partial.condition
        : "good",
    brand: typeof partial.brand === "string" ? partial.brand : null,
    model: typeof partial.model === "string" ? partial.model : null,
    color: typeof partial.color === "string" ? partial.color : null,
  };
}

export function getListingIdFromBody(body: unknown): string | null {
  if (!isRecord(body)) return null;
  if (typeof body.listingId === "string") return body.listingId;
  if (typeof body.listing_id === "string") return body.listing_id;
  return null;
}

export function mergePlatformUpdate(
  currentPlatforms: unknown,
  update: PlatformUpdate
): PlatformUpdate[] {
  const existing = Array.isArray(currentPlatforms)
    ? currentPlatforms.filter((item): item is PlatformUpdate => {
        return (
          isRecord(item) &&
          (item.platform === "vinted" ||
            item.platform === "leboncoin" ||
            item.platform === "ebay") &&
          (item.status === "published" ||
            item.status === "manual_required" ||
            item.status === "failed")
        );
      })
    : [];

  const withoutCurrent = existing.filter(
    (item) => item.platform !== update.platform
  );

  return [...withoutCurrent, update];
}

export function conditionLabel(condition: ListingCondition): string {
  if (condition === "new") return "Neuf";
  if (condition === "good") return "Bon état";
  return "Usé";
}
