"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

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

type Props = { user: User; listings: Listing[] };

export default function DashboardClient({ user, listings: initial }: Props) {
  const [listings, setListings] = useState<Listing[]>(initial);
  const [marking, setMarking] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState<string | null>(null);
  const [priceSuggestions, setPriceSuggestions] = useState<Record<string, PriceSuggestion>>({});
  const [openPrice, setOpenPrice] = useState<string | null>(null);

  async function markSold(id: string) {
    setMarking(id);
    const res = await fetch("/api/mark-sold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "sold" } : l))
      );
    }
    setMarking(null);
  }

  async function fetchPrice(listing: Listing) {
    if (priceSuggestions[listing.id]) {
      setOpenPrice(openPrice === listing.id ? null : listing.id);
      return;
    }
    setPriceLoading(listing.id);
    setOpenPrice(listing.id);
    const res = await fetch("/api/price-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: listing.id,
        titre: listing.titre,
        categorie: listing.categorie,
        etat: "bon",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setPriceSuggestions((prev) => ({ ...prev, [listing.id]: data }));
    }
    setPriceLoading(null);
  }

  const total = listings.length;
  const actives = listings.filter((l) => l.status === "active").length;
  const vendues = listings.filter((l) => l.status === "sold").length;
  const revenus = listings
    .filter((l) => l.status === "sold")
    .reduce((acc, l) => acc + (parseFloat(l.prix.replace(",", ".")) || 0), 0);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const firstName = user.email?.split("@")[0] ?? "vous";

  return (
    <>
      <style>{`
        .dash-page {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
        }

        .dash-glow {
          position: fixed;
          width: 800px; height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%);
          top: -300px; right: -200px;
          pointer-events: none; z-index: 0;
          animation: pulse-glow 10s ease-in-out infinite;
        }

        .dash-grid-bg {
          position: fixed;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .dash-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 0 48px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          border-bottom: 1px solid var(--border);
          background: rgba(10,10,15,0.82);
          backdrop-filter: blur(24px);
        }

        .dash-nav-center { display: flex; align-items: center; gap: 4px; }

        .dash-nav-item {
          font-size: 13px; font-weight: 500;
          color: var(--muted); text-decoration: none;
          padding: 5px 11px; border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .dash-nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .dash-nav-item.active { color: var(--text); background: rgba(255,255,255,0.06); }

        .dash-nav-right { display: flex; align-items: center; gap: 8px; }

        .dash-user-pill {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 500; color: var(--muted);
          padding: 5px 12px 5px 8px; border-radius: 20px;
          border: 1px solid var(--border); background: rgba(255,255,255,0.03);
          text-decoration: none; transition: border-color 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .dash-user-pill:hover { border-color: rgba(124,58,237,0.3); color: var(--text); }

        .dash-user-avatar {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--gradient);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff; flex-shrink: 0;
        }

        .dash-main {
          position: relative; z-index: 1;
          max-width: 1020px; margin: 0 auto;
          padding: 96px 48px 80px;
        }

        .dash-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px; gap: 16px; flex-wrap: wrap;
        }

        .dash-tag {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--violet2);
          margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
        }
        .dash-tag-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--violet2); box-shadow: 0 0 6px rgba(124,58,237,0.7);
        }

        .dash-main h1 {
          font-weight: 800; font-size: clamp(26px, 3.5vw, 40px);
          line-height: 1.0; letter-spacing: -0.04em; color: var(--text);
        }
        .dash-main h1 em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-new {
          background: var(--gradient); color: #fff; border: none;
          border-radius: 10px; padding: 11px 20px;
          font-family: inherit; font-weight: 600; font-size: 13px;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 0 32px rgba(124,58,237,0.22);
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap; letter-spacing: -0.01em;
        }
        .btn-new:hover { transform: scale(1.02); box-shadow: 0 0 48px rgba(124,58,237,0.35); }

        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 36px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px 22px;
          backdrop-filter: blur(20px);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.25), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .stat-card:hover { border-color: rgba(124,58,237,0.2); box-shadow: 0 0 32px rgba(124,58,237,0.05); transform: translateY(-1px); }
        .stat-card:hover::before { opacity: 1; }

        .stat-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(112,112,136,0.6); margin-bottom: 12px;
        }
        .stat-value { font-weight: 800; font-size: 30px; letter-spacing: -0.04em; color: var(--text); line-height: 1; }
        .stat-sub { font-size: 12px; color: rgba(112,112,136,0.5); margin-top: 4px; }

        .section-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; gap: 12px;
        }
        .section-row-title {
          font-size: 13px; font-weight: 700; color: var(--text);
          letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px;
        }
        .section-count {
          font-size: 11px; font-weight: 600; color: var(--muted);
          background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          padding: 1px 8px; border-radius: 20px;
        }

        .listings-grid { display: grid; gap: 8px; }

        .listing-wrap { display: flex; flex-direction: column; }

        .listing-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
          backdrop-filter: blur(20px);
          transition: border-color 0.2s, background 0.2s;
        }
        .listing-card.open {
          border-radius: 12px 12px 0 0;
          border-bottom-color: transparent;
        }
        .listing-card:hover { border-color: rgba(124,58,237,0.2); background: rgba(255,255,255,0.04); }

        .listing-info { flex: 1; min-width: 0; }

        .listing-titre {
          font-weight: 600; font-size: 14px; color: var(--text);
          margin-bottom: 5px; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; letter-spacing: -0.02em;
        }

        .listing-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

        .meta-text { font-size: 12px; color: rgba(112,112,136,0.6); }
        .meta-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(112,112,136,0.3); flex-shrink: 0; }

        .badge {
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 2px 8px;
          border-radius: 20px; border: 1px solid transparent;
        }
        .badge-active { color: #6EE7B7; background: rgba(110,231,183,0.07); border-color: rgba(110,231,183,0.18); }
        .badge-sold { color: rgba(112,112,136,0.6); background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06); }
        .badge-cat { color: #C084FC; background: rgba(124,58,237,0.07); border-color: rgba(124,58,237,0.18); }

        .listing-prix {
          font-weight: 800; font-size: 20px; color: var(--text);
          letter-spacing: -0.04em; white-space: nowrap; flex-shrink: 0;
        }
        .listing-prix span { font-size: 13px; color: var(--violet2); margin-left: 1px; }

        .btn-sold {
          background: transparent; border: 1px solid rgba(255,255,255,0.08);
          color: rgba(112,112,136,0.7); border-radius: 7px; padding: 7px 13px;
          font-size: 12px; font-weight: 500; font-family: inherit;
          cursor: pointer; white-space: nowrap;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          flex-shrink: 0; letter-spacing: -0.01em;
        }
        .btn-sold:hover:not(:disabled) { border-color: rgba(110,231,183,0.35); color: #6EE7B7; background: rgba(110,231,183,0.05); }
        .btn-sold:disabled { opacity: 0.35; cursor: not-allowed; }

        .btn-price {
          background: transparent; border: 1px solid rgba(124,58,237,0.2);
          color: var(--violet2); border-radius: 7px; padding: 7px 13px;
          font-size: 12px; font-weight: 500; font-family: inherit;
          cursor: pointer; white-space: nowrap;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          flex-shrink: 0; letter-spacing: -0.01em;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-price:hover:not(:disabled) { background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.4); }
        .btn-price:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── PRICE PANEL ───────────────────────── */
        .price-panel {
          border: 1px solid rgba(124,58,237,0.2);
          border-top: none; border-radius: 0 0 12px 12px;
          background: rgba(124,58,237,0.03);
          padding: 16px 20px;
          animation: fadeUp 0.2s ease both;
        }

        .price-panel-loading {
          display: flex; align-items: center; gap: 10px;
          color: var(--muted); font-size: 13px;
        }

        .price-bars {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 14px;
        }

        .price-bar {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 12px 14px;
          text-align: center;
        }
        .price-bar.recommande {
          border-color: rgba(124,58,237,0.3);
          background: rgba(124,58,237,0.06);
        }

        .price-bar-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(112,112,136,0.6);
          margin-bottom: 6px;
        }
        .price-bar.recommande .price-bar-label { color: var(--violet2); }

        .price-bar-value {
          font-size: 22px; font-weight: 800; letter-spacing: -0.04em;
          color: var(--text); line-height: 1;
        }
        .price-bar-value span { font-size: 13px; color: var(--muted); margin-left: 1px; }
        .price-bar.recommande .price-bar-value { color: #C084FC; }

        .price-analyse {
          font-size: 13px; color: var(--muted); line-height: 1.65;
          margin-bottom: 10px;
        }

        .price-facteurs {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .price-facteur {
          font-size: 11px; padding: 3px 9px; border-radius: 20px;
          background: rgba(124,58,237,0.07); border: 1px solid rgba(124,58,237,0.15);
          color: #C084FC;
        }

        /* ── SPINNER ────────────────────────────── */
        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(124,58,237,0.3); border-top-color: var(--violet2);
          border-radius: 50%; animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* ── EMPTY STATE ───────────────────────── */
        .empty-state {
          text-align: center; padding: 80px 24px; color: var(--muted);
          border: 1px dashed rgba(255,255,255,0.07); border-radius: 18px;
          background: rgba(255,255,255,0.02);
        }
        .empty-icon { font-size: 40px; margin-bottom: 16px; }
        .empty-text { font-size: 15px; margin-bottom: 24px; color: var(--muted); letter-spacing: -0.01em; }

        @media (max-width: 900px) { .dash-nav-center { display: none; } }
        @media (max-width: 700px) {
          .dash-nav { padding: 0 24px; }
          .dash-main { padding: 86px 24px 60px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .listing-card { flex-wrap: wrap; }
          .price-bars { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-glow" />
        <div className="dash-grid-bg" />

        <nav className="dash-nav">
          <Link href="/" className="okkaz-logo">OKKAZ<span>.io</span></Link>
          <div className="dash-nav-center">
            <Link href="/dashboard" className="dash-nav-item active">Dashboard</Link>
            <Link href="/generate" className="dash-nav-item">Générer</Link>
          </div>
          <div className="dash-nav-right">
            <Link href="/profile" className="dash-user-pill">
              <div className="dash-user-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>
              {firstName}
            </Link>
          </div>
        </nav>

        <div className="dash-main">
          <div className="dash-header">
            <div>
              <div className="dash-tag">
                <span className="dash-tag-dot" />
                Espace vendeur
              </div>
              <h1>Mes <em>annonces</em></h1>
            </div>
            <Link href="/generate" className="btn-new">
              + Nouvelle annonce
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{total}</div>
              <div className="stat-sub">annonces créées</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Actives</div>
              <div className="stat-value">{actives}</div>
              <div className="stat-sub">en cours de vente</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Vendues</div>
              <div className="stat-value">{vendues}</div>
              <div className="stat-sub">transactions réussies</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenus</div>
              <div className="stat-value">{revenus.toFixed(0)} €</div>
              <div className="stat-sub">estimés</div>
            </div>
          </div>

          <div className="section-row">
            <div className="section-row-title">
              Annonces
              <span className="section-count">{listings.length}</span>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p className="empty-text">Aucune annonce pour l&apos;instant.</p>
              <Link href="/generate" className="btn-new">
                Créer ma première annonce →
              </Link>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((l) => (
                <div key={l.id} className="listing-wrap">
                  <div className={`listing-card${openPrice === l.id ? " open" : ""}`}>
                    <div className="listing-info">
                      <div className="listing-titre">{l.titre}</div>
                      <div className="listing-meta">
                        <span className={`badge ${l.status === "active" ? "badge-active" : "badge-sold"}`}>
                          {l.status === "active" ? "Active" : "Vendue"}
                        </span>
                        <span className="badge badge-cat">{l.categorie}</span>
                        <span className="meta-sep" />
                        <span className="meta-text">{formatDate(l.created_at)}</span>
                      </div>
                    </div>
                    <div className="listing-prix">
                      {l.prix}<span>€</span>
                    </div>
                    <button
                      className="btn-price"
                      onClick={() => fetchPrice(l)}
                      disabled={priceLoading === l.id}
                    >
                      {priceLoading === l.id
                        ? <><span className="spinner" /> Analyse…</>
                        : openPrice === l.id
                        ? "▲ Prix"
                        : "◈ Prix marché"
                      }
                    </button>
                    {l.status === "active" && (
                      <button
                        className="btn-sold"
                        onClick={() => markSold(l.id)}
                        disabled={marking === l.id}
                      >
                        {marking === l.id ? "…" : "Marquer vendu"}
                      </button>
                    )}
                  </div>

                  {openPrice === l.id && (
                    <div className="price-panel">
                      {priceLoading === l.id ? (
                        <div className="price-panel-loading">
                          <span className="spinner" />
                          Analyse du marché en cours…
                        </div>
                      ) : priceSuggestions[l.id] ? (
                        <>
                          <div className="price-bars">
                            <div className="price-bar">
                              <div className="price-bar-label">Min</div>
                              <div className="price-bar-value">
                                {priceSuggestions[l.id].prix_min}<span>€</span>
                              </div>
                            </div>
                            <div className="price-bar recommande">
                              <div className="price-bar-label">Recommandé</div>
                              <div className="price-bar-value">
                                {priceSuggestions[l.id].prix_recommande}<span>€</span>
                              </div>
                            </div>
                            <div className="price-bar">
                              <div className="price-bar-label">Max</div>
                              <div className="price-bar-value">
                                {priceSuggestions[l.id].prix_max}<span>€</span>
                              </div>
                            </div>
                          </div>
                          <p className="price-analyse">{priceSuggestions[l.id].analyse}</p>
                          {priceSuggestions[l.id].facteurs && (
                            <div className="price-facteurs">
                              {priceSuggestions[l.id].facteurs!.map((f) => (
                                <span key={f} className="price-facteur">{f}</span>
                              ))}
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
