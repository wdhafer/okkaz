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

        .auth-perks {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .auth-perk {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .auth-perk-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .auth-perk-text {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }
        .auth-perk-text strong {
          color: var(--text2);
          font-weight: 600;
          display: block;
          font-size: 13px;
          margin-bottom: 1px;
        }

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

        .auth-card-logo { margin-bottom: 36px; }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--violet2);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .auth-card h1 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .auth-card h1 em {
          font-style: normal;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.65;
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
          margin-top: 4px;
          letter-spacing: -0.01em;
        }
        .btn-submit:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: 0 0 48px rgba(124,58,237,0.35), 0 4px 20px rgba(0,0,0,0.4);
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .msg-error {
          font-size: 13px;
          color: #FCA5A5;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 8px;
          padding: 10px 14px;
          margin-top: 14px;
        }

        .msg-success {
          font-size: 13px;
          color: #C084FC;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 10px;
          padding: 14px 16px;
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .terms {
          font-size: 11px;
          color: rgba(112,112,136,0.45);
          text-align: center;
          margin-top: 16px;
          line-height: 1.6;
        }

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
              Commencez à vendre<br />en <em>10 secondes</em>
            </p>
            <p className="auth-panel-sub">
              Rejoignez des milliers de vendeurs qui ont vidé leurs placards
              grâce à l&apos;IA.
            </p>
            <div className="auth-perks">
              {[
                { icon: "📸", title: "Photo → Annonce en 3 sec", desc: "L'IA génère le titre, la description et le prix optimal" },
                { icon: "🚀", title: "Publication simultanée", desc: "Vinted, LeBonCoin, eBay en un clic" },
                { icon: "💬", title: "Négociation automatique", desc: "L'IA répond aux acheteurs 24h/24 à votre place" },
              ].map((p) => (
                <div key={p.title} className="auth-perk">
                  <div className="auth-perk-icon">{p.icon}</div>
                  <div className="auth-perk-text">
                    <strong>{p.title}</strong>
                    {p.desc}
                  </div>
                </div>
              ))}
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

            <div className="auth-badge">Inscription gratuite</div>
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
                  {pending ? "Création..." : "Créer mon compte →"}
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
