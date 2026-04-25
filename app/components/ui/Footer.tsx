import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p style={{ marginTop: 14, maxWidth: 320 }}>
            Une interface claire pour transformer vos photos en annonces prêtes à vendre.
          </p>
        </div>
        <div>
          <h4>Produit</h4>
          <Link href="/generate">Générateur</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/pricing">Tarifs</Link>
        </div>
        <div>
          <h4>Compte</h4>
          <Link href="/login">Connexion</Link>
          <Link href="/signup">Inscription</Link>
          <Link href="/profile">Profil</Link>
        </div>
        <div>
          <h4>Plateformes</h4>
          <Link href="/#marketplaces">Vinted</Link>
          <Link href="/#marketplaces">LeBonCoin</Link>
          <Link href="/#marketplaces">eBay</Link>
        </div>
      </div>
    </footer>
  );
}
