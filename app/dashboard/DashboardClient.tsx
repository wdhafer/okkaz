"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import Navbar from "@/app/components/ui/Navbar";

type Listing = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  image_url: string | null;
  status: "active" | "sold";
  created_at: string;
};

type PriceSuggestion = {
  prix_min: number;
  prix_max: number;
  prix_recommande: number;
  analyse: string;
  facteurs?: string[];
};

type ChatMessage = { role: "user" | "assistant"; content: string; status?: string };

type Props = { user: User; listings: Listing[] };

export default function DashboardClient({ user, listings: initialListings }: Props) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [marking, setMarking] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState<string | null>(null);
  const [priceSuggestions, setPriceSuggestions] = useState<Record<string, PriceSuggestion>>({});
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState<Record<string, string>>({});
  const [chatLoading, setChatLoading] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState<string | null>(null);
  const [publishResults, setPublishResults] = useState<Record<string, Record<string, { titre: string; description: string }>>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const total = listings.length;
  const active = listings.filter((listing) => listing.status === "active").length;
  const sold = listings.filter((listing) => listing.status === "sold").length;
  const revenue = listings
    .filter((listing) => listing.status === "sold")
    .reduce((sum, listing) => sum + (parseFloat(listing.prix.replace(",", ".")) || 0), 0);

  async function markSold(id: string) {
    setMarking(id);
    const res = await fetch("/api/mark-sold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setListings((prev) => prev.map((listing) => listing.id === id ? { ...listing, status: "sold" } : listing));
    setMarking(null);
  }

  async function fetchPrice(listing: Listing) {
    setOpenPanel(`${listing.id}:price`);
    if (priceSuggestions[listing.id]) return;
    setPriceLoading(listing.id);
    const res = await fetch("/api/price-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listing.id, titre: listing.titre, categorie: listing.categorie, etat: "bon" }),
    });
    const data = await res.json();
    if (res.ok) setPriceSuggestions((prev) => ({ ...prev, [listing.id]: data }));
    setPriceLoading(null);
  }

  async function publishTo(listing: Listing, platform: string) {
    setOpenPanel(`${listing.id}:publish`);
    setPublishLoading(`${listing.id}:${platform}`);
    const res = await fetch(`/api/publish/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listing.id }),
    });
    const data = await res.json();
    if (res.ok && data.content) {
      setPublishResults((prev) => ({
        ...prev,
        [listing.id]: { ...(prev[listing.id] ?? {}), [platform]: data.content },
      }));
    }
    setPublishLoading(null);
  }

  async function sendMessage(listing: Listing) {
    const msg = chatInput[listing.id]?.trim();
    if (!msg) return;

    const history = chatMessages[listing.id] ?? [];
    const nextHistory: ChatMessage[] = [...history, { role: "user", content: msg }];
    setChatMessages((prev) => ({ ...prev, [listing.id]: nextHistory }));
    setChatInput((prev) => ({ ...prev, [listing.id]: "" }));
    setChatLoading(listing.id);
    setOpenPanel(`${listing.id}:chat`);

    const context = history.map((message) => ({ role: message.role, content: message.content }));
    const res = await fetch("/api/negotiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listing.id, buyer_message: msg, context }),
    });
    const data = await res.json();

    setChatMessages((prev) => ({
      ...prev,
      [listing.id]: [
        ...nextHistory,
        { role: "assistant", content: data.reply ?? data.error ?? "Erreur", status: data.offer_status },
      ],
    }));
    setChatLoading(null);
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container tool-shell">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Vos annonces <span>OKKAZ</span>.</h1>
            <p className="muted">Connecté avec {user.email}</p>
          </div>
          <Link href="/generate" className="btn btn-primary">Nouvelle annonce</Link>
        </div>

        <div className="grid-4" style={{ marginBottom: 22 }}>
          <div className="card"><span className="field-label">Total</span><div className="stat">{total}</div></div>
          <div className="card"><span className="field-label">Actives</span><div className="stat">{active}</div></div>
          <div className="card"><span className="field-label">Vendues</span><div className="stat">{sold}</div></div>
          <div className="card"><span className="field-label">Revenus</span><div className="stat">{revenue.toFixed(0)}€</div></div>
        </div>

        {listings.length === 0 ? (
          <section className="panel" style={{ textAlign: "center" }}>
            <h2>Aucune annonce pour le moment.</h2>
            <p className="muted">Générez votre première annonce à partir de quelques photos.</p>
            <Link href="/generate" className="btn btn-green" style={{ marginTop: 18 }}>Commencer</Link>
          </section>
        ) : (
          <section className="listing-list">
            {listings.map((listing) => {
              const price = priceSuggestions[listing.id];
              const publish = publishResults[listing.id] ?? {};
              const panel = openPanel?.startsWith(`${listing.id}:`) ? openPanel.split(":")[1] : null;

              return (
                <article key={listing.id} className="listing-card">
                  <div>
                    <h2 className="listing-title">{listing.titre}</h2>
                    <div className="badge-row">
                      <span className={`badge ${listing.status === "active" ? "badge-green" : ""}`}>{listing.status === "active" ? "Active" : "Vendue"}</span>
                      <span className="badge">{listing.categorie}</span>
                      <span className="badge">{formatDate(listing.created_at)}</span>
                    </div>
                    <p className="muted" style={{ marginTop: 10 }}>{listing.description}</p>
                  </div>
                  <div>
                    <div className="price" style={{ textAlign: "right", marginBottom: 14 }}>{listing.prix}€</div>
                    <div className="listing-actions">
                      <button className="btn btn-outline" onClick={() => fetchPrice(listing)} disabled={priceLoading === listing.id}>
                        {priceLoading === listing.id ? "Analyse" : "Prix IA"}
                      </button>
                      <button className="btn btn-outline" onClick={() => setOpenPanel(`${listing.id}:publish`)}>Publier</button>
                      <button className="btn btn-outline" onClick={() => setOpenPanel(`${listing.id}:chat`)}>Négocier</button>
                      {listing.status === "active" ? (
                        <button className="btn btn-lime" onClick={() => markSold(listing.id)} disabled={marking === listing.id}>
                          {marking === listing.id ? "Maj" : "Vendu"}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {panel === "price" ? (
                    <div className="subpanel">
                      {price ? (
                        <>
                          <div className="grid-3">
                            <div className="field-card"><span className="field-label">Bas</span><span className="price">{price.prix_min}€</span></div>
                            <div className="field-card"><span className="field-label">Recommandé</span><span className="price">{price.prix_recommande}€</span></div>
                            <div className="field-card"><span className="field-label">Haut</span><span className="price">{price.prix_max}€</span></div>
                          </div>
                          <p className="muted" style={{ marginTop: 12 }}>{price.analyse}</p>
                        </>
                      ) : <p className="muted">Calcul en cours...</p>}
                    </div>
                  ) : null}

                  {panel === "publish" ? (
                    <div className="subpanel">
                      <div className="badge-row">
                        {(["vinted", "leboncoin", "ebay"] as const).map((platform) => (
                          <button
                            key={platform}
                            className="btn btn-outline"
                            onClick={() => publishTo(listing, platform)}
                            disabled={publishLoading === `${listing.id}:${platform}`}
                          >
                            {publishLoading === `${listing.id}:${platform}` ? "Préparation" : `Préparer ${platform}`}
                          </button>
                        ))}
                      </div>
                      <div className="result-grid" style={{ marginTop: 14 }}>
                        {Object.entries(publish).map(([platform, content]) => (
                          <div key={platform} className="field-card">
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                              <span className="field-label">{platform}</span>
                              <button className="ghost-button" onClick={() => copyText(`${content.titre}\n\n${content.description}`, `${listing.id}:${platform}`)}>
                                {copied === `${listing.id}:${platform}` ? "Copié" : "Copier"}
                              </button>
                            </div>
                            <strong>{content.titre}</strong>
                            <p className="muted">{content.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {panel === "chat" ? (
                    <div className="subpanel">
                      <div className="result-grid" style={{ marginBottom: 12 }}>
                        {(chatMessages[listing.id] ?? []).map((message, index) => (
                          <div key={`${message.role}-${index}`} className="field-card">
                            <span className="field-label">{message.role === "user" ? "Acheteur" : "Assistant vendeur"} {message.status ? `· ${message.status}` : ""}</span>
                            <span className="field-value">{message.content}</span>
                          </div>
                        ))}
                      </div>
                      <div className="chat-row">
                        <input
                          className="input"
                          value={chatInput[listing.id] ?? ""}
                          placeholder="Ex: Bonjour, je vous propose 50€"
                          onChange={(event) => setChatInput((prev) => ({ ...prev, [listing.id]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") sendMessage(listing);
                          }}
                        />
                        <button className="btn btn-green" onClick={() => sendMessage(listing)} disabled={chatLoading === listing.id}>
                          {chatLoading === listing.id ? "Réponse" : "Envoyer"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
