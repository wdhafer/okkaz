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
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  return (
    <nav className="okkaz-nav">
      <Link href="/" className="okkaz-logo">
        OKKAZ<span>.io</span>
      </Link>

      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
        <Link href="/#features" className="okkaz-nav-link">Fonctionnalités</Link>
        <Link href="/pricing" className="okkaz-nav-link">Tarifs</Link>
        <Link href="/#about" className="okkaz-nav-link">À propos</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="okkaz-btn-ghost"
          onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
        >
          {isLoggedIn ? "Dashboard" : "Connexion"}
        </button>
        <Link href="/signup" className="okkaz-btn-primary">
          Essayer gratuitement
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .nav-center-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
