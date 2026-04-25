"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type PlatformContent = { titre: string; description: string };

type Annonce = {
  titre: string;
  description: string;
  prix: string;
  categorie: string;
  marque?: string | null;
  modele?: string | null;
  etat?: string;
  couleur?: string;
  mots_cles?: string[];
  platforms?: {
    vinted?: PlatformContent;
    leboncoin?: PlatformContent;
    ebay?: PlatformContent;
  };
};

type ActiveTab = "general" | "vinted" | "leboncoin" | "ebay";

export default function Generate() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [publishedOn, setPublishedOn] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function saveListing() {
    if (!annonce) return;
    setSaving(true);
    const res = await fetch("/api/save-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(annonce),
    });
    if (res.ok) {
      setSaved(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Erreur lors de la sauvegarde.");
    }
    setSaving(false);
  }

  async function publishTo(platform: string, listingId: string) {
    setPublishing(platform);
    const res = await fetch(`/api/publish/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
    });
    if (res.ok) {
      setPublishedOn((prev) => [...prev, platform]);
    } else {
      const d = await res.json();
      setError(d.error ?? `Erreur publication ${platform}.`);
    }
    setPublishing(null);
  }

  function addFiles(newFiles: File[]) {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => {
      const combined = [...prev, ...images].slice(0, 5);
      const readers = combined.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = (e) => resolve(e.target?.result as string);
            r.readAsDataURL(f);
          })
      );
      Promise.all(readers).then(setPreviews);
      return combined;
    });
    setAnnonce(null);
    setError(null);
    setSaved(false);
    setPublishedOn([]);
  }

  function removeFile(idx: number) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      const readers = next.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = (e) => resolve(e.target?.result as string);
            r.readAsDataURL(f);
          })
      );
      Promise.all(readers).then(setPreviews);
      return next;
    });
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  }

  async function generate() {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    setAnnonce(null);
    setActiveTab("general");

    const form = new FormData();
    if (files.length === 1) {
      form.append("image", files[0]);
    } else {
      files.forEach((f, i) => form.append(`image_${i}`, f));
    }

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok || data.error) {
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      setAnnonce(data);
    }
    setLoading(false);
  }

  const platforms: { key: ActiveTab; label: string; emoji: string }[] = [
    { key: "general", label: "Général", emoji: "✦" },
    { key: "vinted", label: "Vinted", emoji: "🟢" },
    { key: "leboncoin", label: "LeBonCoin", emoji: "🟠" },
    { key: "ebay", label: "eBay", emoji: "🔵" },
  ];

  const currentContent =
    activeTab === "general"
      ? { titre: annonce?.titre ?? "", description: annonce?.description ?? "" }
      : annonce?.platforms?.[activeTab] ?? {
          titre: annonce?.titre ?? "",
          description: annonce?.description ?? "",
        };

  return (
    <>
      <style>{`
        .gen-page {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }
        .gen-page::before {
          content: '';
          position: fixed;
          top: -15%; right: -10%;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .gen-page::after {
          content: '';
          position: fixed;
          bottom: -10%; left: -5%;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(192,38,211,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .gen-nav {
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
        .gen-nav-right { display: flex; align-items: center; gap: 8px; }
        .gen-nav-link {
          font-size: 13px; font-weight: 500;
          color: var(--muted); text-decoration: none;
          padding: 5px 11px; border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .gen-nav-link:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .gen-main {
          max-width: 820px;
          margin: 0 auto;
          padding: 96px 48px 80px;
          position: relative; z-index: 1;
        }
        .gen-header { margin-bottom: 36px; }
        .gen-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--violet2); margin-bottom: 16px;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
          padding: 4px 12px; border-radius: 20px;
        }
        .gen-main h1 {
          font-weight: 800; font-size: clamp(36px, 5vw, 54px);
          line-height: 1.0; letter-spacing: -0.045em;
          color: var(--text); margin-bottom: 12px;
        }
        .gen-main h1 em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gen-subtitle { font-size: 15px; color: var(--muted); line-height: 1.7; }

        /* ── PHOTO GRID ──────────────────────────── */
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }
        .photo-slot {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 2px dashed rgba(124,58,237,0.25);
          background: rgba(124,58,237,0.02);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .photo-slot:hover { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.05); }
        .photo-slot img {
          width: 100%; height: 100%;
          object-fit: cover; border-radius: 10px;
        }
        .photo-slot-plus { font-size: 22px; color: rgba(124,58,237,0.4); }
        .photo-remove {
          position: absolute; top: 5px; right: 5px;
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(0,0,0,0.65); border: none;
          color: #fff; font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          z-index: 2;
        }
        .photo-remove:hover { background: rgba(239,68,68,0.8); }
        .photo-count {
          font-size: 12px; color: rgba(112,112,136,0.5);
          margin-bottom: 10px; text-align: right;
        }

        /* ── DROP ZONE (empty) ─────────────────────── */
        .drop-zone {
          border: 2px dashed rgba(124,58,237,0.3);
          border-radius: 18px; padding: 48px 32px;
          text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          background: rgba(124,58,237,0.02);
          position: relative; overflow: hidden;
        }
        .drop-zone::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.06), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .drop-zone:hover::before, .drop-zone.over::before { opacity: 1; }
        .drop-zone:hover, .drop-zone.over {
          border-color: rgba(124,58,237,0.55);
          background: rgba(124,58,237,0.04);
          box-shadow: 0 0 48px rgba(124,58,237,0.08), inset 0 0 0 1px rgba(124,58,237,0.1);
        }
        .drop-icon { font-size: 40px; margin-bottom: 14px; display: block; position: relative; z-index: 1; }
        .drop-label { font-size: 15px; color: var(--text2); margin-bottom: 6px; font-weight: 600; position: relative; z-index: 1; letter-spacing: -0.02em; }
        .drop-sub { font-size: 12px; color: rgba(112,112,136,0.6); position: relative; z-index: 1; }

        /* ── BUTTONS ──────────────────────────────── */
        .btn-primary {
          display: block; width: 100%; margin-top: 16px;
          background: var(--gradient); color: #fff;
          border: none; border-radius: 10px; padding: 15px 28px;
          font-family: inherit; font-weight: 600; font-size: 15px;
          cursor: pointer;
          box-shadow: 0 0 32px rgba(124,58,237,0.25), 0 4px 16px rgba(0,0,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover:not(:disabled) { transform: scale(1.01); box-shadow: 0 0 48px rgba(124,58,237,0.4), 0 4px 24px rgba(0,0,0,0.4); }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-save {
          display: block; width: 100%; margin-top: 10px;
          background: rgba(255,255,255,0.04); color: var(--text2);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 10px;
          padding: 13px 28px; font-family: inherit; font-weight: 600;
          font-size: 15px; cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-save:hover:not(:disabled) { background: rgba(255,255,255,0.06); border-color: rgba(124,58,237,0.35); color: var(--text); }
        .btn-save:disabled { opacity: 0.35; cursor: not-allowed; }

        .save-success {
          margin-top: 10px; padding: 14px 20px;
          background: rgba(110,231,183,0.05);
          border: 1px solid rgba(110,231,183,0.18);
          border-radius: 10px; color: #6EE7B7; font-size: 14px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          letter-spacing: -0.01em;
        }
        .save-success a { color: #6EE7B7; font-weight: 600; text-decoration: underline; white-space: nowrap; opacity: 0.85; }
        .save-success a:hover { opacity: 1; }

        /* ── SPINNER ──────────────────────────────── */
        .spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }

        /* ── RESULT CARD ─────────────────────────── */
        .result-card {
          margin-top: 28px;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 18px;
          background: var(--bg2); overflow: hidden;
          animation: fadeUp 0.35s ease both;
          box-shadow: 0 0 60px rgba(124,58,237,0.08), 0 20px 40px rgba(0,0,0,0.3);
          position: relative;
        }
        .result-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.5) 30%, rgba(192,38,211,0.4) 70%, transparent 95%);
        }

        /* ── TAGS ROW ────────────────────────────── */
        .tags-row {
          padding: 14px 28px;
          border-bottom: 1px solid var(--border);
          display: flex; flex-wrap: wrap; gap: 8px;
          background: var(--bg3);
        }
        .tag-pill {
          font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
          padding: 3px 10px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--muted); background: rgba(255,255,255,0.03);
        }
        .tag-pill.etat-neuf { color: #6EE7B7; border-color: rgba(110,231,183,0.2); background: rgba(110,231,183,0.05); }
        .tag-pill.etat-bon { color: #93C5FD; border-color: rgba(147,197,253,0.2); background: rgba(147,197,253,0.05); }
        .tag-pill.etat-use { color: #FCA5A5; border-color: rgba(252,165,165,0.2); background: rgba(252,165,165,0.05); }

        /* ── PLATFORM TABS ───────────────────────── */
        .platform-tabs {
          display: flex; gap: 2px;
          padding: 12px 28px 0;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
        }
        .platform-tab {
          font-size: 12px; font-weight: 600; letter-spacing: -0.01em;
          padding: 7px 14px; border-radius: 8px 8px 0 0;
          border: 1px solid transparent; border-bottom: none;
          cursor: pointer; transition: all 0.15s;
          color: var(--muted); background: transparent;
          font-family: inherit;
        }
        .platform-tab:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .platform-tab.active {
          color: var(--text); background: var(--bg2);
          border-color: rgba(255,255,255,0.08);
          border-bottom-color: var(--bg2);
          margin-bottom: -1px;
        }

        /* ── RESULT HEADER ───────────────────────── */
        .result-header {
          padding: 20px 28px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .result-titre { font-weight: 700; font-size: 17px; color: var(--text); letter-spacing: -0.03em; }
        .result-badge {
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--violet2);
          border: 1px solid rgba(124,58,237,0.22);
          padding: 3px 10px; border-radius: 20px;
          background: rgba(124,58,237,0.08); white-space: nowrap;
        }
        .result-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .result-row { display: flex; flex-direction: column; gap: 5px; }
        .result-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(112,112,136,0.6); }
        .result-value { font-size: 14px; color: var(--text2); line-height: 1.75; white-space: pre-wrap; }
        .result-prix { font-weight: 800; font-size: 40px; color: var(--text); letter-spacing: -0.04em; line-height: 1; }
        .result-prix span { font-size: 22px; color: var(--violet2); margin-left: 2px; }

        /* ── KEYWORDS ────────────────────────────── */
        .keywords-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .keyword-chip {
          font-size: 11px; font-weight: 500;
          padding: 3px 9px; border-radius: 20px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.18);
          color: #C084FC;
        }

        /* ── PUBLISH BUTTONS ─────────────────────── */
        .publish-row {
          display: flex; gap: 8px; flex-wrap: wrap;
          padding: 16px 28px;
          border-top: 1px solid var(--border);
          background: var(--bg3);
        }
        .btn-publish {
          flex: 1; min-width: 120px;
          padding: 10px 16px; border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: var(--text2); font-size: 13px; font-weight: 600;
          font-family: inherit; cursor: pointer;
          transition: all 0.15s; letter-spacing: -0.01em;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .btn-publish:hover:not(:disabled) { background: rgba(255,255,255,0.07); border-color: rgba(124,58,237,0.3); color: var(--text); }
        .btn-publish:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-publish.done { color: #6EE7B7; border-color: rgba(110,231,183,0.2); background: rgba(110,231,183,0.05); }

        /* ── COPY BUTTON ─────────────────────────── */
        .btn-copy {
          margin-left: auto;
          padding: 4px 10px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(112,112,136,0.6); font-size: 11px;
          font-family: inherit; cursor: pointer;
          transition: all 0.15s;
        }
        .btn-copy:hover { color: var(--text); border-color: rgba(124,58,237,0.3); }

        /* ── ERROR ───────────────────────────────── */
        .error-msg {
          margin-top: 16px; padding: 12px 16px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 9px; color: #FCA5A5; font-size: 14px;
        }

        @media (max-width: 640px) {
          .gen-nav { padding: 0 24px; }
          .gen-main { padding: 80px 24px 60px; }
          .photos-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="gen-page">
        <nav className="gen-nav">
          <Link href="/" className="okkaz-logo">OKKAZ<span>.io</span></Link>
          <div className="gen-nav-right">
            <Link href="/dashboard" className="gen-nav-link">Dashboard</Link>
            <Link href="/" className="gen-nav-link">← Accueil</Link>
          </div>
        </nav>

        <div className="gen-main">
          <div className="gen-header">
            <div className="gen-tag">Photos · IA · Annonce</div>
            <h1>Jusqu&apos;à 5 photos.<br />Votre <em>annonce</em>.</h1>
            <p className="gen-subtitle">
              Ajoutez jusqu&apos;à 5 photos. L&apos;IA génère une annonce optimisée pour chaque plateforme.
            </p>
          </div>

          {files.length > 0 ? (
            <>
              <div className="photos-grid">
                {files.map((_, idx) => (
                  <div key={idx} className="photo-slot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previews[idx]} alt={`Photo ${idx + 1}`} />
                    <button className="photo-remove" onClick={() => removeFile(idx)}>✕</button>
                  </div>
                ))}
                {files.length < 5 && (
                  <div className="photo-slot" onClick={() => inputRef.current?.click()}>
                    <span className="photo-slot-plus">+</span>
                  </div>
                )}
              </div>
              <p className="photo-count">{files.length}/5 photo{files.length > 1 ? "s" : ""}</p>
            </>
          ) : (
            <div
              className={`drop-zone${isDragOver ? " over" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
            >
              <span className="drop-icon">📷</span>
              <p className="drop-label">Glissez vos photos ici</p>
              <p className="drop-sub">Jusqu&apos;à 5 photos · JPG, PNG, WEBP · max 20 Mo</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={onInputChange}
          />

          <button
            className="btn-primary"
            onClick={generate}
            disabled={files.length === 0 || loading}
          >
            {loading ? (
              <><span className="spinner" />Analyse en cours…</>
            ) : (
              "Créer l'annonce →"
            )}
          </button>

          {error && <div className="error-msg">{error}</div>}

          {annonce && (
            <>
              <div className="result-card">
                {/* Tags : marque, modèle, état, couleur */}
                <div className="tags-row">
                  {annonce.etat && (
                    <span className={`tag-pill etat-${annonce.etat === "neuf" ? "neuf" : annonce.etat === "bon" ? "bon" : "use"}`}>
                      {annonce.etat === "neuf" ? "Neuf" : annonce.etat === "bon" ? "Bon état" : "Usé"}
                    </span>
                  )}
                  {annonce.marque && <span className="tag-pill">{annonce.marque}</span>}
                  {annonce.modele && <span className="tag-pill">{annonce.modele}</span>}
                  {annonce.couleur && <span className="tag-pill">{annonce.couleur}</span>}
                  <span className="tag-pill">{annonce.categorie}</span>
                </div>

                {/* Onglets plateformes */}
                <div className="platform-tabs">
                  {platforms.map((p) => (
                    <button
                      key={p.key}
                      className={`platform-tab${activeTab === p.key ? " active" : ""}`}
                      onClick={() => setActiveTab(p.key)}
                    >
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>

                {/* Titre + catégorie */}
                <div className="result-header">
                  <span className="result-titre">{currentContent.titre}</span>
                  <span className="result-badge">{annonce.categorie}</span>
                </div>

                <div className="result-body">
                  {/* Prix (seulement sur l'onglet général) */}
                  {activeTab === "general" && (
                    <div className="result-row">
                      <span className="result-label">Prix suggéré</span>
                      <span className="result-prix">{annonce.prix}<span>€</span></span>
                    </div>
                  )}

                  {/* Description */}
                  <div className="result-row">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="result-label">Description</span>
                      <button
                        className="btn-copy"
                        onClick={() => navigator.clipboard.writeText(currentContent.description)}
                      >
                        Copier
                      </button>
                    </div>
                    <span className="result-value">{currentContent.description}</span>
                  </div>

                  {/* Mots-clés (onglet général) */}
                  {activeTab === "general" && annonce.mots_cles && annonce.mots_cles.length > 0 && (
                    <div className="result-row">
                      <span className="result-label">Mots-clés SEO</span>
                      <div className="keywords-row">
                        {annonce.mots_cles.map((kw) => (
                          <span key={kw} className="keyword-chip">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons publication (visibles après sauvegarde) */}
                {saved && (
                  <div className="publish-row">
                    {(["vinted", "leboncoin", "ebay"] as const).map((p) => (
                      <button
                        key={p}
                        className={`btn-publish${publishedOn.includes(p) ? " done" : ""}`}
                        disabled={!!publishing || publishedOn.includes(p)}
                        onClick={() => {
                          /* listing_id needed — reload from dashboard for now */
                          setError("Ouvrez le dashboard pour publier depuis une annonce sauvegardée.");
                        }}
                      >
                        {publishing === p ? <><span className="spinner" />…</> : publishedOn.includes(p) ? `✓ ${p}` : `Publier sur ${p}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {saved ? (
                <div className="save-success">
                  <span>✓ Annonce sauvegardée avec succès.</span>
                  <Link href="/dashboard">Voir mes annonces →</Link>
                </div>
              ) : (
                <button className="btn-save" onClick={saveListing} disabled={saving}>
                  {saving ? "Sauvegarde…" : "Sauvegarder dans le dashboard"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
