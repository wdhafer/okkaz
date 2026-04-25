"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import Logo from "./Logo";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(Boolean(data.user));
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Navigation principale">
          <Link href="/#fonctionnalites" className="nav-link">Fonctionnalités</Link>
          <Link href="/#comment-ca-marche" className="nav-link">Comment ça marche</Link>
          <Link href="/#marketplaces" className="nav-link">Marketplaces</Link>
          <Link href="/generate" className="nav-link">Générateur</Link>
          <Link href="/pricing" className="nav-link">Tarifs</Link>
        </nav>

        <div className="actions">
          {isLoggedIn ? (
            <>
              <div className="client-pill">
                <span className="client-avatar">{email?.slice(0, 1).toUpperCase() ?? "O"}</span>
                <span>
                  <strong>Espace client</strong>
                  <small>{email}</small>
                </span>
              </div>
              <Link href="/dashboard" className="ghost-button">Dashboard</Link>
              <Link href="/profile" className="ghost-button">Profil</Link>
              <Link href="/generate" className="btn btn-primary">Vendre</Link>
              <form action={logout}>
                <button type="submit" className="btn btn-lime">Déconnexion</button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ghost-button"
                onClick={() => router.push("/login")}
              >
                Connexion
              </button>
              <Link href="/signup" className="btn btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
