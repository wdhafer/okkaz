import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

export default function Home() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="hero clean-hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">OKKAZ AI</div>
              <h1>
                Vendez <span>sans effort</span>.
              </h1>
              <p className="lead clean-lead">
                Photos, prix, annonce, publication et négociation dans un seul espace vendeur.
              </p>
              <div className="hero-actions">
                <Link href="/signup" className="btn btn-primary">Commencer</Link>
                <Link href="/login" className="btn btn-outline">Connexion</Link>
              </div>
            </div>

            <div className="hero-card clean-preview" aria-label="Aperçu OKKAZ">
              <div className="hero-card-top">
                <span>Annonce IA</span>
                <span>89€</span>
              </div>
              <div className="hero-product">
                <div className="photo-stage">
                  <div className="photo-object" />
                </div>
                <div className="product-meta">
                  <div>
                    <h3>Casque premium</h3>
                    <p className="muted">Prêt pour Vinted, LeBonCoin, eBay</p>
                  </div>
                  <div className="price">89€</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="produit" className="section compact-section">
          <div className="container">
            <div className="clean-strip">
              <div>
                <span className="feature-index">01</span>
                <h3>Générer</h3>
                <p>Une annonce complète depuis vos photos.</p>
              </div>
              <div>
                <span className="feature-index">02</span>
                <h3>Publier</h3>
                <p>Des textes adaptés à chaque marketplace.</p>
              </div>
              <div>
                <span className="feature-index">03</span>
                <h3>Négocier</h3>
                <p>Des réponses claires pour vos acheteurs.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="section compact-section">
          <div className="container">
            <div className="experience-panel clean-desk">
              <div>
                <div className="eyebrow">Espace client</div>
                <h2>Votre cockpit vendeur.</h2>
                <p className="lead clean-lead">
                  Suivez vos annonces, préparez vos publications et marquez vos ventes.
                </p>
                <div className="hero-actions">
                  <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
                  <Link href="/generate" className="btn btn-outline">Générer</Link>
                </div>
              </div>
              <div className="desk-preview" aria-label="Aperçu dashboard">
                <div className="desk-top">
                  <span>Dashboard</span>
                  <span>4 actives</span>
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
                    <strong>Sac lilas</strong>
                    <em>54€</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-section">
          <div className="container">
            <div className="final-cta">
              <div>
                <h2>Prêt à vendre ?</h2>
                <p>Créez un compte, confirmez votre email et lancez votre première annonce.</p>
              </div>
              <Link href="/signup" className="btn btn-primary">Inscription</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
