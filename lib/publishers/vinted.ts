import {
  conditionLabel,
  type PublishAdapter,
  type PublishResult,
  type PublishRequest,
} from "./types";

function buildVintedPayload(listing: PublishRequest) {
  return {
    title: listing.title.slice(0, 80),
    description: [
      listing.description,
      "",
      `Etat : ${conditionLabel(listing.condition)}`,
      listing.brand ? `Marque : ${listing.brand}` : null,
      listing.model ? `Modele : ${listing.model}` : null,
      listing.color ? `Couleur : ${listing.color}` : null,
      listing.keywords.length ? `Mots-cles : ${listing.keywords.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    price: listing.price,
    currency: listing.currency,
    category: listing.category,
    photos: listing.photos,
  };
}

export const publishToVinted: PublishAdapter = async (
  listing
): Promise<PublishResult> => {
  return {
    success: true,
    platform: "vinted",
    status: "manual_required",
    externalUrl: null,
    externalId: null,
    message:
      "Publication automatique Vinted non configuree : aucune API officielle ou credential autorise n'est disponible. Le payload est pret a copier-coller.",
    preparedPayload: buildVintedPayload(listing),
  };
};
