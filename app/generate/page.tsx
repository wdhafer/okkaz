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
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setAnnonce(null);
    setError(null);
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --lilas:       #9B59B6;
          --lilas-light: #D7BDE2;
          --lilas-dim:   rgba(155,89,182,0.15);
          --bg:          #0D1B2A;
          --text:        #F0EDF6;
          --muted:       rgba(240,237,246,0.45);
          --border:      rgba(155,89,182,0.18);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .page { min-height: 100vh; position: relative; }

        .glow {
          position: fixed;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(155,89,182,0.12) 0%, transparent 70%);
          top: -200px; right: -150px;
          pointer-events: none; z-index: 0;
        }
        .glow-2 {
          position: fixed;
          width: 450px; height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(215,189,226,0.06) 0%, transparent 70%);
          bottom: 5%; left: -80px;
          pointer-events: none; z-index: 0;
        }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 22px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          border-bottom: 1px solid var(--border);
          background: rgba(13,27,42,0.8);
          backdrop-filter: blur(14px);
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: var(--text);
          text-decoration: none;
        }
        .logo span { color: var(--lilas); }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--lilas-light);
          text-decoration: none;
          border: 1px solid var(--border);
          padding: 6px 16px;
          border-radius: 20px;
          background: var(--lilas-dim);
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.75; }

        .main {
          position: relative; z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 120px 48px 80px;
        }

        .page-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--lilas-light);
          margin-bottom: 24px;
        }
        .page-tag::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: var(--lilas);
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1;
          letter-spacing: -2px;
          color: var(--text);
          margin-bottom: 12px;
        }
        h1 em { font-style: normal; color: var(--lilas); }

        .subtitle {
          font-size: 16px;
          font-weight: 300;
          color: var(--muted);
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(155,89,182,0.03);
          position: relative;
          overflow: hidden;
        }
        .drop-zone:hover, .drop-zone.over {
          border-color: var(--lilas);
          background: var(--lilas-dim);
        }

        .drop-zone img {
          max-height: 320px;
          max-width: 100%;
          border-radius: 10px;
          object-fit: contain;
        }

        .drop-icon {
          font-size: 40px;
          margin-bottom: 16px;
          display: block;
        }

        .drop-label {
          font-size: 15px;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .drop-sub {
          font-size: 12px;
          color: rgba(240,237,246,0.25);
        }

        .btn-primary {
          display: block;
          width: 100%;
          margin-top: 20px;
          background: var(--lilas);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 16px 28px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

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
          margin-top: 40px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(155,89,182,0.05);
          overflow: hidden;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        .result-header {
          padding: 20px 28px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .result-titre {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: var(--text);
        }

        .badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lilas-light);
          border: 1px solid var(--border);
          padding: 4px 12px;
          border-radius: 20px;
          background: var(--lilas-dim);
          white-space: nowrap;
        }

        .result-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--lilas);
        }

        .result-value {
          font-size: 14px;
          color: var(--text);
          line-height: 1.7;
        }

        .result-prix {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 32px;
          color: var(--text);
          letter-spacing: -1px;
        }
        .result-prix span {
          font-size: 18px;
          color: var(--lilas);
          margin-left: 4px;
        }

        .error-msg {
          margin-top: 20px;
          padding: 14px 18px;
          background: rgba(240,80,80,0.08);
          border: 1px solid rgba(240,80,80,0.2);
          border-radius: 8px;
          color: rgba(240,140,140,0.9);
          font-size: 14px;
        }

        @media (max-width: 640px) {
          nav { padding: 18px 24px; }
          .main { padding: 100px 24px 60px; }
        }
      `}</style>

      <div className="page">
        <div className="glow" />
        <div className="glow-2" />

        <nav>
          <Link href="/" className="logo">OKKAZ<span>.io</span></Link>
          <Link href="/" className="nav-link">← Accueil</Link>
        </nav>

        <div className="main">
          <div className="page-tag">IA · Vision</div>
          <h1>Générez votre<br /><em>annonce</em></h1>
          <p className="subtitle">
            Uploadez une photo de votre objet et laissez l'IA rédiger titre, description, prix et catégorie.
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
                <p className="drop-label">Glissez une photo ici ou cliquez pour choisir</p>
                <p className="drop-sub">JPG, PNG, WEBP — max 20 Mo</p>
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
              "Générer l'annonce"
            )}
          </button>

          {error && <div className="error-msg">{error}</div>}

          {annonce && (
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
          )}
        </div>
      </div>
    </>
  );
}
