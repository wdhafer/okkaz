"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { login, loginWithGoogle } from "@/app/auth/actions";

const initialState = { status: "idle" as const, message: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="site-shell">
      <Navbar />
      <main className="auth-page">
        <section className="auth-card">
          <div className="eyebrow">Connexion</div>
          <h1 style={{ marginTop: 16 }}>Retrouvez vos annonces.</h1>
          <p className="muted">Connectez-vous pour générer, sauvegarder et préparer vos contenus marketplace.</p>

          <form action={loginWithGoogle} style={{ margin: "22px 0 14px" }}>
            <button className="btn btn-outline" style={{ width: "100%" }} type="submit">Continuer avec Google</button>
          </form>

          <form action={formAction} className="form-stack">
            <input className="input" name="email" type="email" placeholder="Email" required />
            <input className="input" name="password" type="password" placeholder="Mot de passe" required />
            {state.status === "error" ? <div className="alert">{state.message}</div> : null}
            <button className="btn btn-primary" disabled={pending} type="submit">
              {pending ? "Connexion" : "Se connecter"}
            </button>
          </form>

          <p className="muted" style={{ marginTop: 18 }}>
            Pas encore de compte ? <Link href="/signup" style={{ color: "var(--green)", fontWeight: 850 }}>Créer un compte</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
