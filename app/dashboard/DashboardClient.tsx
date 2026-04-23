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

type Props = { user: User; listings: Listing[] };

export default function DashboardClient({ user, listings: initial }: Props) {
  const [listings, setListings] = useState<Listing[]>(initial);
  const [marking, setMarking] = useState<string | null>(null);

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
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
          top: -200px; right: -150px;
          pointer-events: none; z-index: 0;
        }

        .dash-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 0 48px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          border-bottom: 1px solid var(--border);
          background: rgba(10,10,15,0.85);
          backdrop-filter: blur(20px);
        }

        .dash-nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dash-nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          border: 1px solid var(--border);
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          transition: border-color 0.2s, color 0.2s;
        }
        .dash-nav-link:hover { border-color: rgba(124,58,237,0.3); color: var(--text); }

        .dash-main {
          position: relative; z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 100px 48px 80px;
        }

        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dash-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dash-tag::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: var(--violet);
        }

        .dash-main h1 {
          font-weight: 800;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--text);
        }

        .dash-main h1 em {
          font-style: normal;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-new {
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 12px 22px;
          font-family: inherit;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 30px rgba(124,58,237,0.2);
          transition: transform 0.15s, opacity 0.15s;
          white-space: nowrap;
        }
        .btn-new:hover { transform: scale(1.02); opacity: 0.9; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px 22px;
          backdrop-filter: blur(20px);
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(124,58,237,0.25); }

        .stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          margin-bottom: 10px;
        }

        .stat-value {
          font-weight: 800;
          font-size: 28px;
          letter-spacing: -0.03em;
          color: var(--text);
        }

        .listings-grid { display: grid; gap: 12px; }

        .listing-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          backdrop-filter: blur(20px);
          transition: border-color 0.2s;
        }
        .listing-card:hover { border-color: rgba(124,58,237,0.25); }

        .listing-info { flex: 1; min-width: 0; }

        .listing-titre {
          font-weight: 700;
          font-size: 16px;
          color: var(--text);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .listing-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .meta-text { font-size: 13px; color: var(--muted); }

        .badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid transparent;
        }
        .badge-active {
          color: #6EE7B7;
          background: rgba(110,231,183,0.08);
          border-color: rgba(110,231,183,0.2);
        }
        .badge-sold {
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border-color: var(--border);
        }
        .badge-cat {
          color: #C084FC;
          background: rgba(124,58,237,0.08);
          border-color: rgba(124,58,237,0.2);
        }

        .listing-prix {
          font-weight: 800;
          font-size: 22px;
          color: var(--text);
          letter-spacing: -0.03em;
          white-space: nowrap;
        }
        .listing-prix span { font-size: 14px; color: var(--violet); margin-left: 2px; }

        .btn-sold {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-sold:hover:not(:disabled) {
          border-color: rgba(110,231,183,0.4);
          color: #6EE7B7;
        }
        .btn-sold:disabled { opacity: 0.4; cursor: not-allowed; }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          color: var(--muted);
          border: 1px dashed rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
        }
        .empty-icon { font-size: 40px; margin-bottom: 16px; }
        .empty-text { font-size: 15px; margin-bottom: 20px; }

        @media (max-width: 700px) {
          .dash-nav { padding: 0 24px; }
          .dash-main { padding: 90px 24px 60px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .listing-card { flex-wrap: wrap; }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-glow" />

        <nav className="dash-nav">
          <Link href="/" className="okkaz-logo">OKKAZ<span>.io</span></Link>
          <div className="dash-nav-links">
            <Link href="/profile" className="dash-nav-link">Profil</Link>
          </div>
        </nav>

        <div className="dash-main">
          <div className="dash-header">
            <div>
              <div className="dash-tag">Espace vendeur</div>
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
            </div>
            <div className="stat-card">
              <div className="stat-label">Actives</div>
              <div className="stat-value">{actives}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Vendues</div>
              <div className="stat-value">{vendues}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenus estimés</div>
              <div className="stat-value">{revenus.toFixed(0)} €</div>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p className="empty-text">Aucune annonce pour l&apos;instant.</p>
              <Link href="/generate" className="btn-new">
                Créer ma première annonce
              </Link>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((l) => (
                <div key={l.id} className="listing-card">
                  <div className="listing-info">
                    <div className="listing-titre">{l.titre}</div>
                    <div className="listing-meta">
                      <span className={`badge ${l.status === "active" ? "badge-active" : "badge-sold"}`}>
                        {l.status === "active" ? "Active" : "Vendue"}
                      </span>
                      <span className="badge badge-cat">{l.categorie}</span>
                      <span className="meta-text">{formatDate(l.created_at)}</span>
                    </div>
                  </div>
                  <div className="listing-prix">
                    {l.prix}<span>€</span>
                  </div>
                  {l.status === "active" && (
                    <button
                      className="btn-sold"
                      onClick={() => markSold(l.id)}
                      disabled={marking === l.id}
                    >
                      {marking === l.id ? "..." : "Marquer vendu"}
                    </button>
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
