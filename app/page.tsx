"use client";

import { useActionState } from "react";
import Link from "next/link";
import { joinWaitlist } from "./actions";

const initialState = { status: "idle" as const, message: "" };

export default function Home() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --lilas:       #9B59B6;
          --lilas-light: #D7BDE2;
          --lilas-dim:   rgba(155,89,182,0.15);
          --bg:          #0D1B2A;
          --text:        #F0EDF6;
          --muted:       rgba(240,237,246,0.45);
          --border:      rgba(155,89,182,0.18);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .page { min-height: 100vh; position: relative; }

        .glow {
          position: fixed;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(155,89,182,0.12) 0%, transparent 70%);
          top: -200px; right: -150px;
          pointer-events: none; z-index: 0;
        }
        .glow-2 {
          position: fixed;
          width: 450px; height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(215,189,226,0.06) 0%, transparent 70%);
          bottom: 5%; left: -80px;
          pointer-events: none; z-index: 0;
        }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 22px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          border-bottom: 1px solid var(--border);
          background: rgba(13,27,42,0.8);
          backdrop-filter: blur(14px);
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: var(--text);
        }
        .logo span { color: var(--lilas); }

        .nav-badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lilas-light);
          border: 1px solid var(--border);
          padding: 5px 14px;
          border-radius: 20px;
          background: var(--lilas-dim);
        }

        .hero {
          position: relative; z-index: 1;
          padding: 180px 48px 120px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--lilas-light);
          margin-bottom: 32px;
        }
        .tag::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: var(--lilas);
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(52px, 7vw, 88px);
          line-height: 0.95;
          letter-spacing: -3px;
          color: var(--text);
          margin-bottom: 32px;
        }
        h1 em { font-style: normal; color: var(--lilas); }

        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: var(--muted);
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 56px;
        }

        .form-wrap {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .form-wrap input {
          flex: 1;
          min-width: 240px;
          background: rgba(155,89,182,0.07);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-wrap input::placeholder { color: rgba(240,237,246,0.3); }
        .form-wrap input:focus { border-color: var(--lilas); box-shadow: 0 0 0 3px rgba(155,89,182,0.12); }

        .btn-primary {
          background: var(--lilas);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 28px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .form-note { font-size: 12px; color: rgba(240,237,246,0.3); }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: var(--lilas-light);
          padding: 14px 18px;
          background: var(--lilas-dim);
          border: 1px solid var(--border);
          border-radius: 8px;
          max-width: 420px;
        }

        .stats {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          margin-top: 80px;
          padding-top: 48px;
          border-top: 1px solid var(--border);
        }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 36px;
          color: var(--text);
          letter-spacing: -1px;
        }
        .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }

        .section {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 48px;
        }

        .section-tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--lilas);
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-tag::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2px;
        }
        .step-card {
          background: rgba(155,89,182,0.04);
          border: 1px solid var(--border);
          padding: 36px 28px;
          transition: background 0.2s, border-color 0.2s;
        }
        .step-card:hover { background: var(--lilas-dim); border-color: rgba(155,89,182,0.35); }
        .step-card:first-child { border-radius: 12px 0 0 12px; }
        .step-card:last-child  { border-radius: 0 12px 12px 0; }

        .step-num-big {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 48px;
          color: rgba(155,89,182,0.22);
          line-height: 1;
          margin-bottom: 20px;
        }
        .step-card h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--text);
          margin-bottom: 10px;
        }
        .step-card p { font-size: 13px; color: var(--muted); line-height: 1.7; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 48px;
        }
        .feature-card {
          background: rgba(155,89,182,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px;
          transition: background 0.2s, border-color 0.2s;
        }
        .feature-card:hover { background: var(--lilas-dim); border-color: rgba(155,89,182,0.35); }
        .feature-icon {
          width: 38px; height: 38px;
          background: var(--lilas-dim);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          margin-bottom: 16px;
        }
        .feature-card h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
          margin-bottom: 8px;
        }
        .feature-card p { font-size: 13px; color: var(--muted); line-height: 1.7; }

        footer {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 48px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-note { font-size: 12px; color: rgba(240,237,246,0.2); }

        @media (max-width: 640px) {
          nav { padding: 18px 24px; }
          .hero { padding: 130px 24px 80px; }
          .section { padding: 60px 24px; }
          .stats { gap: 32px; }
          .step-card:first-child, .step-card:last-child { border-radius: 12px; }
          footer { padding: 32px 24px; }
        }
      `}</style>

      <div className="page">
        <div className="glow" />
        <div className="glow-2" />

        <nav>
          <div className="logo">OKKAZ<span>.io</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/generate"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--lilas-light)",
                textDecoration: "none",
                border: "1px solid var(--border)",
                padding: "6px 16px",
                borderRadius: "20px",
                background: "var(--lilas-dim)",
              }}
            >
              Générer une annonce
            </Link>
            <span className="nav-badge">Bêta privée · 2026</span>
          </div>
        </nav>

        <div className="hero">
          <div className="tag">Agent IA · Seconde main</div>
          <h1>
            Vos placards<br />
            en <em>capital</em>,<br />
            en 10 secondes.
          </h1>
          <p className="hero-sub">
            Filmez un objet. L'IA génère l'annonce, la publie sur toutes les marketplaces et négocie pour vous — jusqu'à l'encaissement.
          </p>

          {state.status === "success" ? (
            <div className="success-msg">
              <span>✓</span>
              <span>{state.message}</span>
            </div>
          ) : (
            <>
              <form className="form-wrap" action={formAction}>
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  required
                />
                <button type="submit" className="btn-primary" disabled={pending}>
                  {pending ? "..." : "Rejoindre la bêta"}
                </button>
              </form>
              {state.status === "duplicate" || state.status === "error" ? (
                <p className="form-note" style={{ color: "rgba(240,100,100,0.8)" }}>
                  {state.message}
                </p>
              ) : (
                <p className="form-note">Accès gratuit · Aucune carte requise · 50 places disponibles</p>
              )}
            </>
          )}

          <div className="stats">
            {[
              { num: "15 Mds€", label: "dorment dans les foyers français" },
              { num: "10 sec",  label: "pour publier une annonce" },
              { num: "0€",      label: "de commission sur vos ventes" },
              { num: "24/7",    label: "l'IA négocie à votre place" },
            ].map((s) => (
              <div key={s.num}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-tag">Comment ça marche</div>
          <div className="steps-grid">
            {[
              { n: "01", title: "Filmez l'objet", desc: "10 secondes de vidéo ou une photo. L'IA identifie marque, état, catégorie instantanément." },
              { n: "02", title: "L'annonce se génère", desc: "Titre optimisé, description convaincante, prix suggéré basé sur les ventes réelles du marché." },
              { n: "03", title: "Publication omnicanale", desc: "Vinted, LeBonCoin, eBay — publiés en simultané. L'agent gère messages et négociations." },
              { n: "04", title: "Vous encaissez", desc: "Notification de vente. Paiement sécurisé. Zéro effort mental de votre côté." },
            ].map((s) => (
              <div className="step-card" key={s.n}>
                <div className="step-num-big">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-tag">Pourquoi OKKAZ</div>
          <div className="features-grid">
            {[
              { icon: "⚡", title: "Video-to-Listing",   desc: "GPT-4o Vision analyse votre vidéo et rédige une annonce professionnelle en moins de 5 secondes." },
              { icon: "🤖", title: "Négociateur IA",     desc: "L'agent répond aux acheteurs 24h/24 avec une stratégie de prix dynamique. Vous dormez, vos objets se vendent." },
              { icon: "📊", title: "Pricing intelligent", desc: "Prix suggéré basé sur les vraies transactions — pas les prix affichés qui ne se vendent jamais." },
              { icon: "🔄", title: "Multi-plateforme",   desc: "Une annonce, toutes les plateformes. Désindexation automatique dès la vente." },
              { icon: "🔒", title: "Zéro commission",    desc: "Abonnement fixe 9,90€/mois. On ne touche pas à vos ventes. Ce que vous vendez est entièrement à vous." },
              { icon: "📈", title: "Dashboard vendeur",  desc: "Suivez vos annonces, prix, taux de conversion par plateforme et revenus en temps réel." },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <footer>
          <div className="logo">OKKAZ<span style={{ color: "var(--lilas)" }}>.io</span></div>
          <span className="footer-note">© 2026 OKKAZ.io · Wahbi DHAFER · Document confidentiel</span>
        </footer>
      </div>
    </>
  );
}
