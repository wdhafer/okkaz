"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, loginWithGoogle } from "@/app/auth/actions";

const initialState = { status: "idle" as const, message: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

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

        .auth-logo-wrap {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-card h1 {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          text-align: center;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: var(--muted);
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-google:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); }

        .google-icon { width: 18px; height: 18px; flex-shrink: 0; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          font-size: 12px;
          color: var(--muted);
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
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
        }
        .btn-submit:hover:not(:disabled) { transform: scale(1.01); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-error {
          font-size: 13px;
          color: #FCA5A5;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          margin-top: 12px;
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

        @media (max-width: 640px) {
          .auth-nav { padding: 0 20px; }
          .auth-card { padding: 36px 24px; }
        }
      `}</style>

      <div className="auth-page">
        <nav className="auth-nav">
          <Link href="/" className="okkaz-logo">
            OKKAZ<span>.io</span>
          </Link>
          <Link href="/signup" className="okkaz-nav-link" style={{ fontSize: 13 }}>
            Créer un compte →
          </Link>
        </nav>

        <div className="auth-main">
          <div className="auth-card">
            <div className="auth-logo-wrap">
              <Link href="/" className="okkaz-logo" style={{ fontSize: 20 }}>
                OKKAZ<span>.io</span>
              </Link>
            </div>

            <h1>Bon retour</h1>
            <p className="auth-subtitle">Connectez-vous pour accéder à votre espace vendeur.</p>

            <form action={loginWithGoogle}>
              <button type="submit" className="btn-google">
                <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
            </form>

            <div className="auth-divider">ou</div>

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
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={pending}>
                {pending ? "Connexion…" : "Se connecter"}
              </button>
            </form>

            {state.status === "error" && (
              <div className="auth-error">{state.message}</div>
            )}

            <div className="auth-footer-link">
              Pas encore de compte ?{" "}
              <Link href="/signup">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
