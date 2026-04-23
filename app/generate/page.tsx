"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Annonce = {
  titre: string;
  description: string;
  prix: string;
  categorie: string;
};

export default function Generate() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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

  function handleFile(f: File) {
    setFile(f);
    setAnnonce(null);
    setError(null);
    setSaved(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  async function generate() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAnnonce(null);

    const form = new FormData();
    form.append("image", file);

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok || data.error) {
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      setAnnonce(data);
    }
    setLoading(false);
  }

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
          top: -15%;
          right: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .gen-page::after {
          content: '';
          position: fixed;
          bottom: -10%;
          left: -5%;
          width: 400px;
          height: 400px;
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
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          padding: 5px 11px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .gen-nav-link:hover { background: rgba(255,255,255,0.05); color: var(--text); }

        .gen-main {
          max-width: 780px;
          margin: 0 auto;
          padding: 96px 48px 80px;
          position: relative;
          z-index: 1;
        }

        .gen-header { margin-bottom: 36px; }

        .gen-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--violet2);
          margin-bottom: 16px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .gen-main h1 {
          font-weight: 800;
          font-size: clamp(36px, 5vw, 54px);
          line-height: 1.0;
          letter-spacing: -0.045em;
          color: var(--text);
          margin-bottom: 12px;
        }

        .gen-main h1 em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gen-subtitle {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
        }

        /* ── DROPZONE ──────────────────────────────── */
        .drop-zone {
          border: 2px dashed rgba(124,58,237,0.3);
          border-radius: 18px;
          padding: 56px 32px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          background: rgba(124,58,237,0.02);
          position: relative;
          overflow: hidden;
        }
        .drop-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.06), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .drop-zone:hover::before, .drop-zone.over::before { opacity: 1; }
        .drop-zone:hover, .drop-zone.over {
          border-color: rgba(124,58,237,0.55);
          background: rgba(124,58,237,0.04);
          box-shadow: 0 0 48px rgba(124,58,237,0.08), inset 0 0 0 1px rgba(124,58,237,0.1);
        }
        .drop-zone.over {
          animation: border-glow 1.5s ease-in-out infinite;
        }

        .drop-zone img {
          max-height: 340px;
          max-width: 100%;
          border-radius: 12px;
          object-fit: contain;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }

        .drop-icon {
          font-size: 44px;
          margin-bottom: 16px;
          display: block;
          position: relative;
          z-index: 1;
        }

        .drop-label {
          font-size: 15px;
          color: var(--text2);
          margin-bottom: 6px;
          font-weight: 600;
          position: relative;
          z-index: 1;
          letter-spacing: -0.02em;
        }
        .drop-sub {
          font-size: 12px;
          color: rgba(112,112,136,0.6);
          position: relative;
          z-index: 1;
        }

        .drop-change {
          margin-top: 12px;
          font-size: 12px;
          color: var(--violet2);
          font-weight: 500;
          position: relative;
          z-index: 1;
          opacity: 0.8;
        }

        /* ── BUTTONS ───────────────────────────────── */
        .btn-primary {
          display: block;
          width: 100%;
          margin-top: 16px;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 15px 28px;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 0 32px rgba(124,58,237,0.25), 0 4px 16px rgba(0,0,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: 0 0 48px rgba(124,58,237,0.4), 0 4px 24px rgba(0,0,0,0.4);
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-save {
          display: block;
          width: 100%;
          margin-top: 10px;
          background: rgba(255,255,255,0.04);
          color: var(--text2);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 13px 28px;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-save:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
          border-color: rgba(124,58,237,0.35);
          color: var(--text);
        }
        .btn-save:disabled { opacity: 0.35; cursor: not-allowed; }

        .save-success {
          margin-top: 10px;
          padding: 14px 20px;
          background: rgba(110,231,183,0.05);
          border: 1px solid rgba(110,231,183,0.18);
          border-radius: 10px;
          color: #6EE7B7;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          letter-spacing: -0.01em;
        }
        .save-success a {
          color: #6EE7B7;
          font-weight: 600;
          text-decoration: underline;
          white-space: nowrap;
          opacity: 0.85;
        }
        .save-success a:hover { opacity: 1; }

        /* ── SPINNER ───────────────────────────────── */
        .spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* ── RESULT CARD ───────────────────────────── */
        .result-card {
          margin-top: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: var(--bg2);
          overflow: hidden;
          animation: fadeUp 0.35s ease both;
          box-shadow: 0 0 60px rgba(124,58,237,0.08), 0 20px 40px rgba(0,0,0,0.3);
          position: relative;
        }
        .result-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.5) 30%, rgba(192,38,211,0.4) 70%, transparent 95%);
        }

        .result-header {
          padding: 20px 28px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          background: var(--bg3);
        }

        .result-titre {
          font-weight: 700;
          font-size: 17px;
          color: var(--text);
          letter-spacing: -0.03em;
        }

        .result-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--violet2);
          border: 1px solid rgba(124,58,237,0.22);
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(124,58,237,0.08);
          white-space: nowrap;
        }

        .result-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-row { display: flex; flex-direction: column; gap: 5px; }

        .result-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(112,112,136,0.6);
        }

        .result-value {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.75;
        }

        .result-prix {
          font-weight: 800;
          font-size: 40px;
          color: var(--text);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .result-prix span {
          font-size: 22px;
          color: var(--violet2);
          margin-left: 2px;
        }

        .error-msg {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 9px;
          color: #FCA5A5;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .gen-nav { padding: 0 24px; }
          .gen-main { padding: 80px 24px 60px; }
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
            <div className="gen-tag">Photo · IA · Annonce</div>
            <h1>Une photo.<br />Votre <em>annonce</em>.</h1>
            <p className="gen-subtitle">
              Prenez une photo. L&apos;annonce se génère automatiquement en 10 secondes.
            </p>
          </div>

          <div
            className={`drop-zone${isDragOver ? " over" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
          >
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Aperçu" />
                <p className="drop-change">Cliquer pour changer la photo</p>
              </>
            ) : (
              <>
                <span className="drop-icon">📷</span>
                <p className="drop-label">Glissez une photo ici</p>
                <p className="drop-sub">JPG, PNG, WEBP · max 20 Mo</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onInputChange}
            />
          </div>

          <button
            className="btn-primary"
            onClick={generate}
            disabled={!file || loading}
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
                <div className="result-header">
                  <span className="result-titre">{annonce.titre}</span>
                  <span className="result-badge">{annonce.categorie}</span>
                </div>
                <div className="result-body">
                  <div className="result-row">
                    <span className="result-label">Prix suggéré</span>
                    <span className="result-prix">
                      {annonce.prix}<span>€</span>
                    </span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">Description</span>
                    <span className="result-value">{annonce.description}</span>
                  </div>
                </div>
              </div>

              {saved ? (
                <div className="save-success">
                  <span>✓ Annonce sauvegardée avec succès.</span>
                  <Link href="/dashboard">Voir mes annonces →</Link>
                </div>
              ) : (
                <button
                  className="btn-save"
                  onClick={saveListing}
                  disabled={saving}
                >
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
