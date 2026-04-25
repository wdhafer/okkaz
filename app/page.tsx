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
                Vendez <span>sans effort</span>.
              </h1>
              <p className="lead">
                OKKAZ transforme vos photos en annonces prêtes à publier, avec prix conseillé,
                versions marketplace et assistant de négociation.
              </p>
              <div className="hero-actions">
                <Link href="/signup" className="btn btn-primary">Créer un compte gratuit</Link>
                <Link href="/login" className="btn btn-outline">Se connecter</Link>
                <Link href="/generate" className="btn btn-lime">Tester le générateur</Link>
              </div>
              <div className="quick-links" aria-label="Accès rapides">
                <Link href="/signup">Inscription</Link>
                <Link href="/login">Login</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/profile">Profil</Link>
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

        <section id="fonctionnalites" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Fonctionnalités</div>
                <h2>Tout le parcours vendeur est accessible.</h2>
              </div>
              <Link href="/signup" className="btn btn-primary">Démarrer</Link>
            </div>
            <div className="feature-grid">
              <Link href="/signup" className="feature-card">
                <span className="feature-index">01</span>
                <h3>Inscription avec confirmation email</h3>
                <p>Création de compte via Supabase avec email de confirmation activé.</p>
              </Link>
              <Link href="/login" className="feature-card">
                <span className="feature-index">02</span>
                <h3>Connexion vendeur</h3>
                <p>Accès sécurisé au dashboard avec email/mot de passe ou Google OAuth.</p>
              </Link>
              <Link href="/generate" className="feature-card">
                <span className="feature-index">03</span>
                <h3>Génération par photo</h3>
                <p>Upload jusqu’à cinq photos, analyse IA, titre, description, état et prix.</p>
              </Link>
              <Link href="/dashboard" className="feature-card">
                <span className="feature-index">04</span>
                <h3>Dashboard annonces</h3>
                <p>Liste des annonces, statut active/vendue, revenus estimés et actions rapides.</p>
              </Link>
              <Link href="/dashboard" className="feature-card">
                <span className="feature-index">05</span>
                <h3>Publication marketplace</h3>
                <p>Préparation de textes optimisés pour Vinted, LeBonCoin et eBay.</p>
              </Link>
              <Link href="/dashboard" className="feature-card">
                <span className="feature-index">06</span>
                <h3>Négociation assistée</h3>
                <p>Réponses IA aux acheteurs avec prix minimum et statut de l’offre.</p>
              </Link>
              <Link href="/dashboard" className="feature-card">
                <span className="feature-index">07</span>
                <h3>Suggestion de prix</h3>
                <p>Fourchette basse, recommandée et haute avec analyse de marché.</p>
              </Link>
              <Link href="/profile" className="feature-card">
                <span className="feature-index">08</span>
                <h3>Profil et déconnexion</h3>
                <p>Page compte, email utilisateur, date d’inscription et sortie de session.</p>
              </Link>
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

        <section className="section">
          <div className="container">
            <div className="experience-panel">
              <div>
                <div className="eyebrow">Expérience vendeur</div>
                <h2>Un espace client qui ressemble à un vrai centre de contrôle.</h2>
                <p className="lead">
                  Après connexion, l’utilisateur retrouve ses annonces, ses estimations, les contenus
                  prêts pour chaque plateforme et l’assistant de négociation dans un seul espace.
                </p>
                <div className="hero-actions">
                  <Link href="/dashboard" className="btn btn-primary">Ouvrir l’espace client</Link>
                  <Link href="/generate" className="btn btn-outline">Créer une annonce</Link>
                </div>
              </div>
              <div className="desk-preview" aria-label="Aperçu espace client">
                <div className="desk-top">
                  <span>OKKAZ Desk</span>
                  <span>4 annonces actives</span>
                </div>
                <div className="desk-stats">
                  <div><strong>12</strong><span>Annonces</span></div>
                  <div><strong>8</strong><span>Actives</span></div>
                  <div><strong>426€</strong><span>Revenus</span></div>
                </div>
                <div className="desk-list">
                  <div>
                    <span className="desk-dot" />
                    <strong>Casque premium</strong>
                    <em>89€</em>
                  </div>
                  <div>
                    <span className="desk-dot" />
                    <strong>Sac cuir lilas</strong>
                    <em>54€</em>
                  </div>
                  <div>
                    <span className="desk-dot" />
                    <strong>Montre vintage</strong>
                    <em>120€</em>
                  </div>
                </div>
                <div className="desk-message">
                  <span className="field-label">Assistant négociation</span>
                  “Votre offre est intéressante. Je peux vous le laisser à 82€ si vous confirmez aujourd’hui.”
                </div>
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
            <div className="panel account-panel">
              <div>
                <div className="eyebrow">Espace utilisateur</div>
                <h2 style={{ marginTop: 14 }}>Inscription, login et dashboard.</h2>
                <p className="muted">Les accès principaux sont disponibles ici et dans la barre de navigation.</p>
                <div className="hero-actions">
                  <Link href="/signup" className="btn btn-primary">S’inscrire</Link>
                  <Link href="/login" className="btn btn-outline">Se connecter</Link>
                  <Link href="/dashboard" className="btn btn-lime">Ouvrir le dashboard</Link>
                </div>
              </div>
              <div className="account-card">
                <span className="field-label">Parcours recommandé</span>
                <strong>1. Inscription</strong>
                <span>2. Confirmation email</span>
                <span>3. Connexion</span>
                <span>4. Génération d’annonce</span>
                <span>5. Dashboard vendeur</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="panel waitlist-panel">
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
