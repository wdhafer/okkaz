import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { logout } from "@/app/auth/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const joinedAt = new Date(user.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Vendeur OKKAZ";

  const initials = String(displayName).slice(0, 1).toUpperCase();
  const emailConfirmed = user.email_confirmed_at ? "Confirmé" : "En attente";
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Première connexion";

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container client-space">
        <section className="client-hero">
          <div>
            <p className="bm-kicker">Espace client</p>
            <h1>{displayName}</h1>
            <p>Gérez vos coordonnées, vos préférences vendeur et vos accès OKKAZ.</p>
          </div>
          <div className="client-id-card">
            <div className="client-big-avatar">{initials}</div>
            <span>Compte vendeur</span>
            <strong>{emailConfirmed}</strong>
          </div>
        </section>

        <section className="client-grid">
          <article className="client-card large">
            <div className="client-card-head">
              <span>Coordonnées</span>
              <Link href="/profile">Modifier bientôt</Link>
            </div>
            <div className="client-fields">
              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Nom affiché</span>
                <strong>{displayName}</strong>
              </div>
              <div>
                <span>Téléphone</span>
                <strong>À compléter</strong>
              </div>
              <div>
                <span>Ville</span>
                <strong>À compléter</strong>
              </div>
            </div>
          </article>

          <article className="client-card">
            <div className="client-card-head">
              <span>Compte</span>
            </div>
            <div className="client-metrics">
              <div>
                <span>Membre depuis</span>
                <strong>{joinedAt}</strong>
              </div>
              <div>
                <span>Dernière connexion</span>
                <strong>{lastSignIn}</strong>
              </div>
              <div>
                <span>ID client</span>
                <code>{user.id}</code>
              </div>
            </div>
          </article>

          <article className="client-card">
            <div className="client-card-head">
              <span>Préférences vendeur</span>
            </div>
            <div className="client-tags">
              <span>EUR</span>
              <span>France</span>
              <span>Vinted</span>
              <span>LeBonCoin</span>
              <span>eBay</span>
            </div>
            <p className="muted">
              Les préférences avancées pourront être reliées à une table profil dédiée.
            </p>
          </article>

          <article className="client-card">
            <div className="client-card-head">
              <span>Sécurité</span>
            </div>
            <div className="security-row">
              <span>Email</span>
              <strong>{emailConfirmed}</strong>
            </div>
            <div className="security-row">
              <span>Connexion</span>
              <strong>Supabase Auth</strong>
            </div>
            <form action={logout}>
              <button className="btn btn-primary" type="submit">
                Se déconnecter
              </button>
            </form>
          </article>

          <article className="client-card large dark">
            <div>
              <span className="field-label">Actions rapides</span>
              <h2>Retournez vendre.</h2>
            </div>
            <div className="client-actions">
              <Link href="/generate" className="btn btn-primary">Créer une annonce</Link>
              <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
              <Link href="/pricing" className="btn btn-lime">Tarifs</Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
