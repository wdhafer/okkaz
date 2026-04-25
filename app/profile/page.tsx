import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { logout } from "@/app/auth/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const joinedAt = new Date(user.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container tool-shell">
        <div className="page-kicker eyebrow">Profil</div>
        <h1 className="page-title">Votre <span>compte</span>.</h1>
        <section className="panel" style={{ maxWidth: 680 }}>
          <div className="result-grid">
            <div className="field-card">
              <span className="field-label">Email</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="field-card">
              <span className="field-label">Membre depuis</span>
              <span className="field-value">{joinedAt}</span>
            </div>
            <div className="field-card">
              <span className="field-label">Identifiant</span>
              <span className="field-value" style={{ fontFamily: "monospace", fontSize: 13 }}>{user.id}</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn btn-outline">Retour dashboard</Link>
            <form action={logout}>
              <button className="btn btn-primary" type="submit">Se déconnecter</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
