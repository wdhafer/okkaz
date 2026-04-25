"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import { joinWaitlist } from "./actions";

const initialState = { status: "idle" as const, message: "" };

export default function Home() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Assistant de revente IA</div>
              <h1>
                Vendez vos objets <span>plus vite</span>, sans écrire l’annonce.
              </h1>
              <p className="lead">
                OKKAZ analyse vos photos, estime un prix crédible et prépare des annonces adaptées
                à Vinted, LeBonCoin et eBay. L’expérience est pensée comme un back-office de
                marketplace: claire, rapide, orientée conversion.
              </p>
              <div className="hero-actions">
                <Link href="/generate" className="btn btn-primary">Générer une annonce</Link>
                <Link href="/pricing" className="btn btn-outline">Voir les tarifs</Link>
              </div>
            </div>

            <div className="hero-card" aria-label="Aperçu annonce générée">
              <div className="hero-card-top">
                <span>Annonce prête</span>
                <span>Prix IA: 89€</span>
              </div>
              <div className="hero-product">
                <div className="photo-stage">
                  <div className="photo-object" />
                </div>
                <div className="product-meta">
                  <div>
                    <h3>Casque audio premium reconditionné</h3>
                    <p className="muted">Bon état · Electronique · 5 photos</p>
                  </div>
                  <div className="price">89€</div>
                </div>
                <div className="badge-row" style={{ marginTop: 18 }}>
                  <span className="badge badge-green">Prix conseillé</span>
                  <span className="badge">Vinted</span>
                  <span className="badge">LeBonCoin</span>
                  <span className="badge">eBay</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comment-ca-marche" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Flux simple</div>
                <h2>De la photo à la vente en trois étapes.</h2>
              </div>
            </div>
            <div className="grid-3">
              <div className="card">
                <div className="stat">1</div>
                <h3>Ajoutez vos photos</h3>
                <p>Déposez jusqu’à cinq images. L’IA identifie l’objet, son état, sa catégorie et les détails utiles.</p>
              </div>
              <div className="card">
                <div className="stat">2</div>
                <h3>Validez l’annonce</h3>
                <p>Vous obtenez un titre, une description, des mots-clés et une estimation de prix exploitable.</p>
              </div>
              <div className="card">
                <div className="stat">3</div>
                <h3>Publiez et négociez</h3>
                <p>Le dashboard prépare les versions marketplace et aide à répondre aux acheteurs.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplaces" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Multi-plateformes</div>
                <h2>Un contenu ajusté pour chaque canal.</h2>
              </div>
              <Link href="/generate" className="btn btn-lime">Tester maintenant</Link>
            </div>
            <div className="grid-3">
              <div className="card">
                <h3>Vinted</h3>
                <p>Ton plus direct, description courte, formulation pensée pour une lecture mobile.</p>
              </div>
              <div className="card">
                <h3>LeBonCoin</h3>
                <p>Annonce précise, rassurante, avec les informations pratiques attendues par les acheteurs.</p>
              </div>
              <div className="card">
                <h3>eBay</h3>
                <p>Titre SEO, structure professionnelle et préparation API lorsque les identifiants sont configurés.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="panel" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Bêta privée</div>
                <h2 style={{ marginTop: 14 }}>Rejoindre la liste d’attente.</h2>
                <p className="muted">Laissez votre email pour être prévenu des prochaines ouvertures.</p>
              </div>
              <form action={formAction} style={{ display: "flex", gap: 10, minWidth: 320 }}>
                <input className="input" name="email" type="email" placeholder="vous@email.com" required />
                <button className="btn btn-green" disabled={pending} type="submit">
                  {pending ? "Envoi" : "Rejoindre"}
                </button>
              </form>
              {state.message ? (
                <div className={`alert ${state.status === "success" || state.status === "duplicate" ? "success" : ""}`} style={{ gridColumn: "1 / -1" }}>
                  {state.message}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
