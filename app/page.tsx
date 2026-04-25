import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

const categories = ["iPhone", "Sneakers", "Casque", "Sac", "Console"];

export default function Home() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="bm-hero">
          <div className="container bm-hero-grid">
            <div className="bm-copy">
              <p className="bm-kicker">OKKAZ.io</p>
              <h1>
                Revendez <span>mieux</span>.
              </h1>
              <p className="bm-sub">
                Photos. Prix. Annonce. Publication. Tout est prêt.
              </p>
              <div className="bm-search">
                <input aria-label="Objet à vendre" placeholder="Que voulez-vous vendre ?" />
                <Link href="/generate">Générer</Link>
              </div>
              <div className="bm-cats">
                {categories.map((category) => (
                  <Link key={category} href="/generate">{category}</Link>
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
                  <div className="bm-product-orb">O</div>
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

        <section className="bm-dashboard-section">
          <div className="container bm-dashboard">
            <div>
              <p className="bm-kicker">Espace client</p>
              <h2>Un bureau de vente. Pas un formulaire.</h2>
              <Link href="/signup" className="bm-big-link">Créer mon compte</Link>
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
