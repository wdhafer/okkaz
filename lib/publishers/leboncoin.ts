import {
  conditionLabel,
  type PublishAdapter,
  type PublishRequest,
  type PublishResult,
} from "./types";

function buildLeBonCoinPayload(listing: PublishRequest) {
  return {
    subject: listing.title.slice(0, 80),
    body: [
      listing.description,
      "",
      `Etat : ${conditionLabel(listing.condition)}`,
      listing.brand ? `Marque : ${listing.brand}` : null,
      listing.model ? `Modele : ${listing.model}` : null,
      listing.color ? `Couleur : ${listing.color}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    price: Math.round(listing.price * 100),
    priceDisplay: `${listing.price.toFixed(2)} ${listing.currency}`,
    category: listing.category,
    images: listing.photos,
    attributes: {
      brand: listing.brand,
      model: listing.model,
      color: listing.color,
      keywords: listing.keywords,
    },
  };
}

export const publishToLeBonCoin: PublishAdapter = async (
  listing
): Promise<PublishResult> => {
  return {
    success: true,
    platform: "leboncoin",
    status: "manual_required",
    externalUrl: null,
    externalId: null,
    message:
      "Publication automatique LeBonCoin non configuree : aucune API officielle ou credential autorise n'est disponible. Le payload est pret a copier-coller.",
    preparedPayload: buildLeBonCoinPayload(listing),
  };
};
