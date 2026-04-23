import Link from "next/link";

export default function Footer() {
  return (
    <footer className="okkaz-footer">
      <div className="okkaz-footer-inner">
        <div className="okkaz-footer-top">
          <div>
            <Link href="/" className="okkaz-logo">
              OKKAZ<span>.io</span>
            </Link>
            <p className="okkaz-footer-desc">
              Vendez vos objets en quelques secondes grâce à l'intelligence artificielle.
              Annonces, prix et réponses — tout automatisé.
            </p>
          </div>
          <div className="okkaz-footer-col">
            <h4>Produit</h4>
            <Link href="/#features">Fonctionnalités</Link>
            <Link href="/pricing">Tarifs</Link>
            <Link href="/generate">Générer une annonce</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div className="okkaz-footer-col">
            <h4>Ressources</h4>
            <Link href="/#about">À propos</Link>
            <Link href="/pricing#faq">FAQ</Link>
            <Link href="/login">Connexion</Link>
            <Link href="/signup">Inscription</Link>
          </div>
          <div className="okkaz-footer-col">
            <h4>Légal</h4>
            <Link href="#">Mentions légales</Link>
            <Link href="#">Politique de confidentialité</Link>
            <Link href="#">CGU</Link>
          </div>
        </div>
        <div className="okkaz-footer-bottom">
          <span>© 2026 OKKAZ.io · Wahbi DHAFER</span>
          <span>Document confidentiel · Bêta</span>
        </div>
      </div>
    </footer>
  );
}
