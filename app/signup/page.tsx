"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";

const initialState = { status: "idle" as const, message: "" };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
          content: '';
          position: fixed;
          top: -30%;
          left: -20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .auth-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: rgba(10,10,15,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
        }

        .auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 48px;
          position: relative;
          z-index: 1;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background: var(--bg2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.08);
        }

        .auth-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        .auth-card h1 {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .auth-card h1 em {
          font-style: normal;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .field-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
        }

        .field-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .field-input::placeholder { color: rgba(136,136,160,0.5); }
        .field-input:focus {
          border-color: var(--violet);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }

        .btn-submit {
          width: 100%;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(124,58,237,0.2);
          transition: transform 0.15s, opacity 0.15s;
          height: 44px;
          margin-top: 4px;
        }
        .btn-submit:hover:not(:disabled) { transform: scale(1.01); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .msg-error {
          font-size: 13px;
          color: #FCA5A5;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          margin-top: 12px;
        }

        .msg-success {
          font-size: 13px;
          color: #A78BFA;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 8px;
          padding: 12px 14px;
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-footer-link {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: var(--muted);
        }
        .auth-footer-link a {
          color: var(--violet);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .auth-footer-link a:hover { color: #A78BFA; }

        .terms {
          font-size: 11px;
          color: var(--muted);
          text-align: center;
          margin-top: 16px;
          line-height: 1.5;
          opacity: 0.6;
        }

        @media (max-width: 640px) {
          .auth-nav { padding: 0 20px; }
          .auth-card { padding: 36px 24px; }
        }
      `}</style>

      <div className="auth-page">
        <nav className="auth-nav">
          <Link href="/" className="okkaz-logo">OKKAZ<span>.io</span></Link>
          <Link href="/login" className="okkaz-nav-link" style={{ fontSize: 13 }}>
            Se connecter →
          </Link>
        </nav>

        <div className="auth-main">
          <div className="auth-card">
            <div className="auth-badge">Inscription</div>
            <h1>Rejoignez<br /><em>OKKAZ</em></h1>
            <p className="auth-subtitle">Créez votre compte et commencez à vendre en 10 secondes.</p>

            {state.status === "success" ? (
              <div className="msg-success">
                <span>✓</span>
                <span>{state.message}</span>
              </div>
            ) : (
              <form action={formAction}>
                <div className="field-group">
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="field-input"
                      placeholder="votre@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="password">Mot de passe</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="field-input"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      minLength={8}
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="confirm">Confirmer le mot de passe</label>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      className="field-input"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={pending}>
                  {pending ? "Création..." : "Créer mon compte"}
                </button>

                {state.status === "error" && (
                  <div className="msg-error">{state.message}</div>
                )}
              </form>
            )}

            <p className="terms">
              En créant un compte, vous acceptez nos conditions d&apos;utilisation.
            </p>

            <div className="auth-footer-link">
              Déjà un compte ?{" "}
              <Link href="/login">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
