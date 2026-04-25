"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/ui/Navbar";

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

export default function GeneratePage() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [publishedOn, setPublishedOn] = useState<string[]>([]);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const inputRef = useRef<HTMLInputElement>(null);

  function refreshPreviews(next: File[]) {
    Promise.all(
      next.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then(setPreviews);
  }

  function addFiles(newFiles: File[]) {
    const images = newFiles.filter((file) => file.type.startsWith("image/"));
    setFiles((prev) => {
      const next = [...prev, ...images].slice(0, 5);
      refreshPreviews(next);
      return next;
    });
    setAnnonce(null);
    setSavedId(null);
    setPublishedOn([]);
    setError(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      refreshPreviews(next);
      return next;
    });
  }

  async function generate() {
    if (!files.length) return;
    setLoading(true);
    setError(null);
    setAnnonce(null);
    setActiveTab("general");

    const form = new FormData();
    form.append("lang", lang);
    files.forEach((file, index) => form.append(files.length === 1 ? "image" : `image_${index}`, file));

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok || data.error) setError(data.error ?? "Une erreur est survenue.");
    else setAnnonce(data);

    setLoading(false);
  }

  async function saveListing() {
    if (!annonce) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/save-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(annonce),
    });
    const data = await res.json();
    if (res.ok) setSavedId(data.id);
    else setError(data.error ?? "Erreur lors de la sauvegarde.");
    setSaving(false);
  }

  async function publishTo(platform: string) {
    if (!savedId) return;
    setPublishing(platform);
    setError(null);
    const res = await fetch(`/api/publish/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: savedId }),
    });
    const data = await res.json();
    if (res.ok) setPublishedOn((prev) => [...prev, platform]);
    else setError(data.error ?? `Erreur publication ${platform}.`);
    setPublishing(null);
  }

  const platforms: { key: ActiveTab; label: string }[] = [
    { key: "general", label: "Général" },
    { key: "vinted", label: "Vinted" },
    { key: "leboncoin", label: "LeBonCoin" },
    { key: "ebay", label: "eBay" },
  ];

  const currentContent =
    activeTab === "general"
      ? { titre: annonce?.titre ?? "", description: annonce?.description ?? "" }
      : annonce?.platforms?.[activeTab] ?? { titre: annonce?.titre ?? "", description: annonce?.description ?? "" };

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container tool-shell">
        <div className="page-kicker eyebrow">Générateur</div>
        <h1 className="page-title">Créez une annonce <span>prête à vendre</span>.</h1>
        <p className="lead">Ajoutez vos photos, choisissez la langue et laissez l’IA générer une annonce exploitable.</p>

        <div className="grid-3" style={{ marginTop: 30, alignItems: "start" }}>
          <section className="panel" style={{ gridColumn: "span 2" }}>
            <div className="tabs">
              <button className={`tab ${lang === "fr" ? "active" : ""}`} onClick={() => setLang("fr")}>Français</button>
              <button className={`tab ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>English</button>
            </div>

            {previews.length ? (
              <div className="photo-grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className="photo-slot"
                    onClick={() => inputRef.current?.click()}
                    aria-label={`Photo ${index + 1}`}
                  >
                    {previews[index] ? (
                      <>
                        <Image
                          src={previews[index]}
                          alt={`Photo importée ${index + 1}`}
                          fill
                          unoptimized
                          sizes="140px"
                          style={{ objectFit: "cover" }}
                        />
                        <span
                          className="remove"
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          x
                        </span>
                      </>
                    ) : (
                      <span className="muted">+</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className={`drop-zone ${isDragOver ? "over" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragOver(false);
                  addFiles(Array.from(event.dataTransfer.files));
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>Déposez vos photos</h2>
                  <p className="muted">JPG, PNG ou WebP. Jusqu’à cinq images.</p>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => event.target.files && addFiles(Array.from(event.target.files))}
            />

            <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={generate} disabled={!files.length || loading}>
              {loading ? "Analyse en cours" : "Générer l’annonce"}
            </button>
            {error ? <div className="alert" style={{ marginTop: 14 }}>{error}</div> : null}
          </section>

          <aside className="card">
            <h3>Ce que l’IA prépare</h3>
            <p>Titre, description, catégorie, état, prix conseillé et variantes marketplace.</p>
            <div className="badge-row" style={{ marginTop: 16 }}>
              <span className="badge badge-green">{files.length}/5 photos</span>
              <span className="badge">Gemini Vision</span>
            </div>
          </aside>
        </div>

        {annonce ? (
          <section className="panel" style={{ marginTop: 22 }}>
            <div className="section-head">
              <div>
                <div className="eyebrow">Résultat</div>
                <h2>{annonce.titre}</h2>
              </div>
              <div className="price">{annonce.prix}€</div>
            </div>

            <div className="tabs">
              {platforms.map((platform) => (
                <button
                  key={platform.key}
                  type="button"
                  className={`tab ${activeTab === platform.key ? "active" : ""}`}
                  onClick={() => setActiveTab(platform.key)}
                >
                  {platform.label}
                </button>
              ))}
            </div>

            <div className="result-grid">
              <div className="field-card">
                <span className="field-label">Titre</span>
                <span className="field-value">{currentContent.titre}</span>
              </div>
              <div className="field-card">
                <span className="field-label">Description</span>
                <span className="field-value">{currentContent.description}</span>
              </div>
              <div className="grid-3">
                <div className="field-card">
                  <span className="field-label">Catégorie</span>
                  <span className="field-value">{annonce.categorie}</span>
                </div>
                <div className="field-card">
                  <span className="field-label">Etat</span>
                  <span className="field-value">{annonce.etat ?? "Non précisé"}</span>
                </div>
                <div className="field-card">
                  <span className="field-label">Couleur</span>
                  <span className="field-value">{annonce.couleur ?? "Non précisée"}</span>
                </div>
              </div>
              {annonce.mots_cles?.length ? (
                <div className="badge-row">
                  {annonce.mots_cles.map((keyword) => <span key={keyword} className="badge">{keyword}</span>)}
                </div>
              ) : null}
            </div>

            <div className="hero-actions">
              <button className="btn btn-green" onClick={saveListing} disabled={saving || Boolean(savedId)}>
                {savedId ? "Annonce sauvegardée" : saving ? "Sauvegarde" : "Sauvegarder"}
              </button>
              {savedId ? <Link href="/dashboard" className="btn btn-outline">Voir le dashboard</Link> : null}
            </div>

            {savedId ? (
              <div className="badge-row" style={{ marginTop: 16 }}>
                {(["vinted", "leboncoin", "ebay"] as const).map((platform) => (
                  <button
                    key={platform}
                    className={`btn ${publishedOn.includes(platform) ? "btn-lime" : "btn-outline"}`}
                    onClick={() => publishTo(platform)}
                    disabled={Boolean(publishing) || publishedOn.includes(platform)}
                  >
                    {publishing === platform ? "Préparation" : publishedOn.includes(platform) ? `${platform} prêt` : `Préparer ${platform}`}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}
