"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(Boolean(data.user)));
  }, []);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="OKKAZ accueil">
          <span className="brand-mark">O</span>
          <span>OKKAZ</span>
        </Link>

        <nav className="nav-links" aria-label="Navigation principale">
          <Link href="/#comment-ca-marche" className="nav-link">Comment ça marche</Link>
          <Link href="/#marketplaces" className="nav-link">Marketplaces</Link>
          <Link href="/pricing" className="nav-link">Tarifs</Link>
        </nav>

        <div className="actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
          >
            {isLoggedIn ? "Dashboard" : "Connexion"}
          </button>
          <Link href={isLoggedIn ? "/generate" : "/signup"} className="btn btn-primary">
            {isLoggedIn ? "Vendre un objet" : "Inscription"}
          </Link>
        </div>
      </div>
    </header>
  );
}
