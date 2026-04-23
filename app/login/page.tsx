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
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--bg);
        }

        /* Left branding panel */
        .auth-panel-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          overflow: hidden;
        }

        .auth-panel-left::before {
          content: '';
          position: absolute;
          top: -20%;
          left: -20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-panel-left::after {
          content: '';
          position: absolute;
          bottom: -10%;
          right: -10%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Dot grid */
        .auth-panel-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        .auth-panel-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-panel-quote {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.035em;
          color: var(--text);
          line-height: 1.2;
          max-width: 360px;
          margin-bottom: 20px;
        }

        .auth-panel-quote em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-panel-sub {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          max-width: 320px;
        }

        .auth-panel-stats {
          display: flex;
          gap: 32px;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .auth-stat { display: flex; flex-direction: column; gap: 2px; }
        .auth-stat-val {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
        }
        .auth-stat-val em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-stat-label { font-size: 12px; color: var(--muted); }

        .auth-panel-footer {
          position: relative;
          z-index: 1;
        }

        /* Right form panel */
        .auth-panel-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 64px;
          position: relative;
          overflow: hidden;
        }

        .auth-panel-right::before {
          content: '';
          position: fixed;
          top: -10%;
          right: -10%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-card {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 1;
        }

        .auth-card-logo {
          margin-bottom: 36px;
        }

        .auth-card h1 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.65;
        }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--text2);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-google:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.16); }

        .google-icon { width: 18px; height: 18px; flex-shrink: 0; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          font-size: 12px;
          color: rgba(112,112,136,0.5);
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(112,112,136,0.8);
          letter-spacing: 0.01em;
        }

        .field-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          padding: 11px 15px;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .field-input::placeholder { color: rgba(112,112,136,0.4); }
        .field-input:focus {
          border-color: rgba(124,58,237,0.55);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: rgba(255,255,255,0.05);
        }

        .btn-submit {
          width: 100%;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 13px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 0 32px rgba(124,58,237,0.25), 0 4px 16px rgba(0,0,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          height: 44px;
          letter-spacing: -0.01em;
        }
        .btn-submit:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: 0 0 48px rgba(124,58,237,0.35), 0 4px 20px rgba(0,0,0,0.4);
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-error {
          font-size: 13px;
          color: #FCA5A5;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 8px;
          padding: 10px 14px;
          margin-top: 14px;
        }

        .auth-footer-link {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: var(--muted);
        }
        .auth-footer-link a {
          color: var(--violet2);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .auth-footer-link a:hover { color: #C4B5FD; }

        @media (max-width: 900px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-panel-left { display: none; }
          .auth-panel-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left branding panel */}
        <div className="auth-panel-left">
          <div className="auth-panel-bg" />
          <Link href="/" className="okkaz-logo" style={{ position: "relative", zIndex: 1 }}>
            OKKAZ<span>.io</span>
          </Link>
          <div className="auth-panel-content">
            <p className="auth-panel-quote">
              Vendez vos objets<br />en <em>10 secondes</em>
            </p>
            <p className="auth-panel-sub">
              Une photo. Une annonce parfaite. L&apos;IA négocie à votre place
              sur Vinted, LeBonCoin et eBay.
            </p>
            <div className="auth-panel-stats">
              <div className="auth-stat">
                <span className="auth-stat-val"><em>3x</em></span>
                <span className="auth-stat-label">Plus vite</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-val"><em>100%</em></span>
                <span className="auth-stat-label">Pour vous</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-val">3</span>
                <span className="auth-stat-label">Plateformes</span>
              </div>
            </div>
          </div>
          <div className="auth-panel-footer" />
        </div>

        {/* Right form panel */}
        <div className="auth-panel-right">
          <div className="auth-card">
            <div className="auth-card-logo">
              <Link href="/" className="okkaz-logo" style={{ fontSize: 19 }}>
                OKKAZ<span>.io</span>
              </Link>
            </div>

            <h1>Bon retour</h1>
            <p className="auth-subtitle">Connectez-vous pour accéder à votre espace vendeur.</p>

            <form action={loginWithGoogle}>
              <button type="submit" className="btn-google">
                <svg className="google-icon" viewBox="0 0 24 24">
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
