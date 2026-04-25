import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

const categories = ["iPhone", "Sneakers", "Casque", "Sac", "Console"];

const testimonials = [
  {
    quote: "J'ai vendu mon iPhone en 2h. Le prix suggéré était parfait et l'annonce bien mieux que ce que j'aurais écrit moi-même.",
    name: "Lucas M.",
    city: "Paris",
    sold: "iPhone 14 Pro — 780€",
    initial: "L",
  },
  {
    quote: "6 paires de sneakers vendues en une semaine. OKKAZ gère tout — les photos, les prix, les messages. Je fais presque rien.",
    name: "Sarah K.",
    city: "Lyon",
    sold: "6 sneakers — 1 240€",
    initial: "S",
    featured: true,
  },
  {
    quote: "La négociation auto m'a vendu. Plus besoin de répondre aux offres à 3h du mat. L'IA répond mieux que moi de toute façon.",
    name: "Romain D.",
    city: "Bordeaux",
    sold: "Console PS5 — 350€",
    initial: "R",
  },
];

const platforms = ["Vinted", "LeBonCoin", "eBay", "Vestiaire", "Vinted", "LeBonCoin", "eBay", "Vestiaire"];

export default function Home() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bm-hero">
          <div className="container bm-hero-grid">
            <div className="bm-copy">
              <p className="bm-kicker">OKKAZ.io — IA de revente</p>
              <h1>
                Vendez<br /><span>mieux.</span>
              </h1>
              <p className="bm-sub">
                Photos → Prix juste → Annonce parfaite.<br />
                Publiée partout en un clic.
              </p>
              <div className="bm-search">
                <input aria-label="Objet à vendre" placeholder="Que voulez-vous vendre ?" />
                <Link href="/generate">Générer →</Link>
              </div>
              <div className="bm-cats">
                {categories.map((c) => (
                  <Link key={c} href="/generate">{c}</Link>
                ))}
              </div>
            </div>

            <div className="bm-stage" aria-label="Aperçu OKKAZ">
              <div className="bm-device">
                <div className="bm-device-top">
                  <span>Annonce IA</span>
                  <strong>89€</strong>
                </div>
                <div className="bm-product-shot">
                  <div className="bm-product-orb">⚡</div>
                </div>
                <div className="bm-device-row">
                  <div>
                    <strong>Casque premium</strong>
                    <span>Vinted · LeBonCoin · eBay</span>
                  </div>
                  <Link href="/generate">Publier</Link>
                </div>
              </div>
              <div className="bm-floating-card one">
                <span>Prix conseillé</span>
                <strong>89€</strong>
              </div>
              <div className="bm-floating-card two">
                <span>Score annonce</span>
                <strong>92%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat-item">
              <strong>1 200<span>+</span></strong>
              <p>articles vendus via OKKAZ</p>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>3<span>×</span></strong>
              <p>plateformes publiées en simultané</p>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>89<span>%</span></strong>
              <p>d'annonces vendues sous 7 jours</p>
            </div>
          </div>
        </section>

        {/* ── Process strip ── */}
        <section className="bm-strip">
          <div className="container bm-strip-grid">
            <Link href="/generate">
              <span>01</span>
              <strong>Générer</strong>
            </Link>
            <Link href="/dashboard">
              <span>02</span>
              <strong>Suivre</strong>
            </Link>
            <Link href="/dashboard">
              <span>03</span>
              <strong>Publier</strong>
            </Link>
            <Link href="/dashboard">
              <span>04</span>
              <strong>Négocier</strong>
            </Link>
          </div>
        </section>

        {/* ── Bento features ── */}
        <section className="section">
          <div className="container">
            <div className="section-label-row">
              <p className="bm-kicker">Fonctionnalités</p>
              <h2 className="section-big-title">Tout pour vendre vite.</h2>
            </div>
            <div className="bento-grid">

              {/* Card 1 — Photos IA (large) */}
              <div className="bento-card bento-hero-card">
                <p className="bento-tag">Vision IA</p>
                <h3>Photos qui vendent</h3>
                <p>Télécharge tes photos. L'IA détecte l'objet, optimise le cadrage, génère un fond propre.</p>
                <div className="bento-photo-row">
                  <div className="bento-photo-thumb" data-label="Brut">📷</div>
                  <div className="bento-arrow">→</div>
                  <div className="bento-photo-thumb bright" data-label="IA">⚡</div>
                  <div className="bento-arrow">→</div>
                  <div className="bento-photo-thumb done" data-label="OK">✓</div>
                </div>
              </div>

              {/* Card 2 — Prix optimal (medium) */}
              <div className="bento-card bento-price-card">
                <p className="bento-tag">Estimation</p>
                <div className="bento-price-display">
                  <span>89€</span>
                  <em>+12% vs marché</em>
                </div>
                <h3>Prix optimal</h3>
                <p>Analyse du marché en temps réel pour vendre au meilleur prix.</p>
              </div>

              {/* Card 3 — Annonce parfaite */}
              <div className="bento-card bento-copy-card">
                <p className="bento-tag">Rédaction</p>
                <div className="bento-text-preview">
                  <span className="bento-text-line full" />
                  <span className="bento-text-line half" />
                  <span className="bento-text-line three-q" />
                  <span className="bento-text-line half" />
                </div>
                <h3>Annonce parfaite</h3>
                <p>Titre, description, mots-clés. Rédigés en 3 secondes.</p>
              </div>

              {/* Card 4 — Négociation IA */}
              <div className="bento-card bento-nego-card">
                <p className="bento-tag">Négo IA</p>
                <div className="bento-chat">
                  <div className="bento-bubble buyer">« 70€ ? »</div>
                  <div className="bento-bubble seller">« 82€, dernier prix. »</div>
                </div>
                <h3>Négociation auto</h3>
                <p>Répondez aux offres sans effort.</p>
              </div>

              {/* Card 5 — Multi-plateforme (large) */}
              <div className="bento-card bento-platform-card">
                <p className="bento-tag">Distribution</p>
                <h3>Partout en un clic</h3>
                <p>Une annonce publiée sur toutes vos plateformes simultanément.</p>
                <div className="bento-platforms">
                  <span>Vinted</span>
                  <span>LeBonCoin</span>
                  <span>eBay</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Marquee platforms ── */}
        <section className="marquee-section">
          <p className="marquee-label">Compatible avec</p>
          <div className="marquee-track-wrap" aria-hidden="true">
            <div className="marquee-track">
              {[...platforms, ...platforms].map((p, i) => (
                <span key={i} className="marquee-item">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="section">
          <div className="container">
            <div className="section-label-row">
              <p className="bm-kicker">Témoignages</p>
              <h2 className="section-big-title">Ils ont vendu mieux.</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((t) => (
                <div key={t.name} className={`testimonial-card${t.featured ? " featured" : ""}`}>
                  <div className="stars">{"★★★★★"}</div>
                  <p className="quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testimonial-footer">
                    <span className="t-avatar">{t.initial}</span>
                    <div>
                      <strong>{t.name}</strong>
                      <em>{t.city} · {t.sold}</em>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dashboard CTA ── */}
        <section className="bm-dashboard-section">
          <div className="container bm-dashboard">
            <div>
              <p className="bm-kicker">Espace client</p>
              <h2>Un bureau de vente.<br />Pas un formulaire.</h2>
              <Link href="/signup" className="bm-big-link">Créer mon compte →</Link>
            </div>
            <div className="bm-mini-dash">
              <div><span>Annonces</span><strong>12</strong></div>
              <div><span>Actives</span><strong>8</strong></div>
              <div><span>Revenus</span><strong>426€</strong></div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
