"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { resendConfirmation, signup } from "@/app/auth/actions";

const initialState = { status: "idle" as const, message: "" };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [resendState, resendAction, resendPending] = useActionState(
    resendConfirmation,
    initialState
  );

  return (
    <div className="site-shell">
      <Navbar />
      <main className="auth-page">
        <section className="auth-card">
          <div className="eyebrow">Inscription</div>
          <h1 style={{ marginTop: 16 }}>Créez votre espace vendeur.</h1>
          <p className="muted">Commencez gratuitement et générez vos premières annonces en quelques minutes.</p>

          <form action={formAction} className="form-stack" style={{ marginTop: 22 }}>
            <input className="input" name="email" type="email" placeholder="Email" required />
            <input className="input" name="password" type="password" placeholder="Mot de passe" required minLength={6} />
            <input className="input" name="confirm" type="password" placeholder="Confirmer le mot de passe" required minLength={6} />
            {state.message ? <div className={`alert ${state.status === "success" ? "success" : ""}`}>{state.message}</div> : null}
            <button className="btn btn-primary" disabled={pending} type="submit">
              {pending ? "Création" : "Créer mon compte"}
            </button>
          </form>

          <div className="field-card" style={{ marginTop: 18 }}>
            <span className="field-label">Email non reçu</span>
            <form action={resendAction} className="form-stack">
              <input className="input" name="email" type="email" placeholder="Votre email" required />
              {resendState.message ? (
                <div className={`alert ${resendState.status === "success" ? "success" : ""}`}>
                  {resendState.message}
                </div>
              ) : null}
              <button className="btn btn-outline" disabled={resendPending} type="submit">
                {resendPending ? "Renvoi" : "Renvoyer l’email de confirmation"}
              </button>
            </form>
          </div>

          <p className="muted" style={{ marginTop: 18 }}>
            Déjà inscrit ? <Link href="/login" style={{ color: "var(--green)", fontWeight: 850 }}>Se connecter</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
