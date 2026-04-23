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
          top: -20%;
          right: -15%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .gen-nav {
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

        .gen-nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .gen-nav-link:hover { background: rgba(255,255,255,0.05); color: var(--text); }

        .gen-main {
          max-width: 820px;
          margin: 0 auto;
          padding: 100px 48px 80px;
          position: relative;
          z-index: 1;
        }

        .gen-tag {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          margin-bottom: 20px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .gen-main h1 {
          font-weight: 800;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: var(--text);
          margin-bottom: 12px;
        }

        .gen-main h1 em {
          font-style: normal;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gen-subtitle {
          font-size: 16px;
          color: var(--muted);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .drop-zone {
          border: 2px dashed rgba(124,58,237,0.35);
          border-radius: 16px;
          padding: 56px 32px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(124,58,237,0.03);
          position: relative;
          overflow: hidden;
        }
        .drop-zone:hover, .drop-zone.over {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.07);
        }

        .drop-zone img {
          max-height: 320px;
          max-width: 100%;
          border-radius: 12px;
          object-fit: contain;
        }

        .drop-icon {
          font-size: 40px;
          margin-bottom: 16px;
          display: block;
        }

        .drop-label {
          font-size: 15px;
          color: var(--text);
          margin-bottom: 6px;
          font-weight: 500;
        }
        .drop-sub {
          font-size: 12px;
          color: var(--muted);
        }

        .btn-primary {
          display: block;
          width: 100%;
          margin-top: 16px;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 15px 28px;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(124,58,237,0.2);
          transition: transform 0.15s, opacity 0.15s;
        }
        .btn-primary:hover:not(:disabled) { transform: scale(1.01); }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-save {
          display: block;
          width: 100%;
          margin-top: 10px;
          background: rgba(255,255,255,0.04);
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 13px 28px;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-save:hover:not(:disabled) {
          background: rgba(255,255,255,0.07);
          border-color: rgba(124,58,237,0.4);
        }
        .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

        .save-success {
          margin-top: 10px;
          padding: 14px 18px;
          background: rgba(110,231,183,0.06);
          border: 1px solid rgba(110,231,183,0.2);
          border-radius: 8px;
          color: #6EE7B7;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .save-success a {
          color: #6EE7B7;
          font-weight: 600;
          text-decoration: underline;
          white-space: nowrap;
        }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .result-card {
          margin-top: 32px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: var(--bg2);
          overflow: hidden;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

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
          font-size: 18px;
          color: var(--text);
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--violet);
          border: 1px solid rgba(124,58,237,0.25);
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

        .result-row { display: flex; flex-direction: column; gap: 4px; }

        .result-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .result-value {
          font-size: 14px;
          color: var(--text);
          line-height: 1.7;
        }

        .result-prix {
          font-weight: 800;
          font-size: 36px;
          color: var(--text);
          letter-spacing: -0.03em;
        }
        .result-prix span {
          font-size: 20px;
          color: var(--violet);
          margin-left: 2px;
        }

        .error-msg {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #FCA5A5;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .gen-nav { padding: 0 24px; }
          .gen-main { padding: 84px 24px 60px; }
        }
      `}</style>

      <div className="gen-page">
        <nav className="gen-nav">
          <Link href="/" className="okkaz-logo">OKKAZ<span>.io</span></Link>
          <Link href="/" className="gen-nav-link">← Accueil</Link>
        </nav>

        <div className="gen-main">
          <div className="gen-tag">Photo · Annonce</div>
          <h1>Une photo.<br />Votre <em>annonce</em>.</h1>
          <p className="gen-subtitle">
            Prenez une photo. L&apos;annonce se génère automatiquement.
          </p>

          <div
            className="drop-zone"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Aperçu" />
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
              <><span className="spinner" />En cours…</>
            ) : (
              "Créer l'annonce"
            )}
          </button>

          {error && <div className="error-msg">{error}</div>}

          {annonce && (
            <>
              <div className="result-card">
                <div className="result-header">
                  <span className="result-titre">{annonce.titre}</span>
                  <span className="badge">{annonce.categorie}</span>
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
                  Annonce sauvegardée.
                  <Link href="/dashboard">Voir mes annonces →</Link>
                </div>
              ) : (
                <button
                  className="btn-save"
                  onClick={saveListing}
                  disabled={saving}
                >
                  {saving ? "Sauvegarde…" : "Sauvegarder"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
