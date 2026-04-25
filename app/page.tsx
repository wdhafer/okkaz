import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

const categories = ["Téléphone", "Mode", "Maison", "Sport", "Gaming", "Luxe"];

const products = [
  {
    title: "iPhone 13",
    category: "Téléphonie",
    price: "349€",
    state: "Bon état",
  },
  {
    title: "Sneakers Nike",
    category: "Mode",
    price: "68€",
    state: "Très bon état",
  },
  {
    title: "Casque Sony",
    category: "Audio",
    price: "89€",
    state: "Comme neuf",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="market-hero">
          <div className="container">
            <div className="market-hero-grid">
              <div>
                <div className="eyebrow">Assistant vendeur IA</div>
                <h1>
                  Vendez <span>sans effort</span>.
                </h1>
                <p className="lead clean-lead">
                  OKKAZ transforme vos photos en annonce prête à publier, avec prix conseillé et textes adaptés aux marketplaces.
                </p>
                <div className="sell-search">
                  <span>Je veux vendre</span>
                  <input aria-label="Objet à vendre" placeholder="un téléphone, une paire, un meuble..." />
                  <Link href="/generate" className="btn btn-primary">Analyser</Link>
                </div>
                <div className="category-row" aria-label="Catégories populaires">
                  {categories.map((category) => (
                    <Link key={category} href="/generate">{category}</Link>
                  ))}
                </div>
              </div>

              <aside className="seller-card" aria-label="Résumé vendeur OKKAZ">
                <div className="seller-card-head">
                  <span>OKKAZ Score</span>
                  <strong>92%</strong>
                </div>
                <div className="seller-steps">
                  <div><span>1</span><strong>Photos reçues</strong><em>5 images</em></div>
                  <div><span>2</span><strong>Prix conseillé</strong><em>89€</em></div>
                  <div><span>3</span><strong>Annonce prête</strong><em>3 plateformes</em></div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="produit" className="section compact-section">
          <div className="container">
            <div className="section-head tight-head">
              <div>
                <div className="eyebrow">Marketplace-ready</div>
                <h2>Une annonce, trois canaux.</h2>
              </div>
              <Link href="/signup" className="btn btn-primary">Commencer</Link>
            </div>
            <div className="market-grid">
              {products.map((product) => (
                <article key={product.title} className="market-card">
                  <div className="product-visual">
                    <span>{product.title.slice(0, 1)}</span>
                  </div>
                  <div className="market-card-body">
                    <span className="field-label">{product.category}</span>
                    <h3>{product.title}</h3>
                    <p>{product.state}</p>
                    <div className="market-price-row">
                      <strong>{product.price}</strong>
                      <Link href="/generate">Préparer</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="section compact-section">
          <div className="container">
            <div className="feature-band">
              <div>
                <span className="feature-index">01</span>
                <h3>Génération</h3>
                <p>Titre, description, état, catégorie, mots-clés.</p>
              </div>
              <div>
                <span className="feature-index">02</span>
                <h3>Prix IA</h3>
                <p>Fourchette basse, haute et prix rapide.</p>
              </div>
              <div>
                <span className="feature-index">03</span>
                <h3>Publication</h3>
                <p>Vinted, LeBonCoin, eBay en payload propre.</p>
              </div>
              <div>
                <span className="feature-index">04</span>
                <h3>Négociation</h3>
                <p>Réponses acheteur et contre-offres assistées.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-section">
          <div className="container">
            <div className="workspace-panel">
              <div>
                <div className="eyebrow">Espace client</div>
                <h2>Un cockpit pour tout gérer.</h2>
                <p className="lead clean-lead">
                  Sauvegardez vos annonces, suivez les statuts, préparez les publications et marquez les ventes.
                </p>
                <div className="hero-actions">
                  <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
                  <Link href="/login" className="btn btn-outline">Connexion</Link>
                </div>
              </div>
              <div className="workspace-preview">
                <div className="workspace-top">
                  <strong>Dashboard</strong>
                  <span>8 actives</span>
                </div>
                <div className="workspace-kpis">
                  <div><strong>12</strong><span>Annonces</span></div>
                  <div><strong>426€</strong><span>Revenus</span></div>
                  <div><strong>3</strong><span>Canaux</span></div>
                </div>
                <div className="workspace-row"><span /> Casque Sony <strong>89€</strong></div>
                <div className="workspace-row"><span /> Sneakers Nike <strong>68€</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-section">
          <div className="container">
            <div className="final-cta">
              <div>
                <h2>Prêt à vendre ?</h2>
                <p>Créez un compte et lancez votre première annonce IA.</p>
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
