"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import { joinWaitlist } from "./actions";

const initialState = { status: "idle" as const, message: "" };

export default function Home() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  return (
    <>
      <style>{`
        .page { min-height: 100vh; }

        /* HERO */
        .hero {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 160px 32px 120px;
          max-width: 960px;
          margin: 0 auto;
        }

        .hero-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 600px;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.25), transparent);
          pointer-events: none;
          z-index: 0;
        }

        .hero > * { position: relative; z-index: 1; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #C084FC;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.3);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 32px;
          letter-spacing: 0.02em;
        }

        .hero h1 {
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #FFFFFF;
          max-width: 720px;
          margin-bottom: 24px;
        }

        .hero-sub {
          font-size: 20px;
          color: var(--muted);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        .hero-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 16px;
        }

        .btn-hero-primary {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: var(--gradient);
          border: none;
          padding: 13px 28px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 40px rgba(124,58,237,0.3), 0 4px 16px rgba(0,0,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-hero-primary:hover { transform: scale(1.02); box-shadow: 0 0 60px rgba(124,58,237,0.4), 0 4px 24px rgba(0,0,0,0.4); }

        .btn-hero-outline {
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 13px 28px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-hero-outline:hover { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.06); }

        .hero-note { font-size: 12px; color: var(--muted); letter-spacing: 0.02em; }

        /* MOCKUP */
        .mockup-wrap {
          width: 100%;
          max-width: 760px;
          margin: 72px auto 0;
          background: var(--bg2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 0 80px rgba(124,58,237,0.12), 0 40px 80px rgba(0,0,0,0.4);
          overflow: hidden;
        }

        .mockup-bar {
          height: 40px;
          background: var(--bg3);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 6px;
        }

        .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }

        .mockup-body { display: grid; grid-template-columns: 1fr 1fr; }

        .mockup-left {
          padding: 28px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .mockup-right { padding: 28px; }

        .mockup-upload {
          border: 2px dashed rgba(124,58,237,0.4);
          border-radius: 12px;
          padding: 36px 16px;
          text-align: center;
          background: rgba(124,58,237,0.04);
        }
        .mockup-upload-icon { font-size: 28px; margin-bottom: 8px; }
        .mockup-upload-text { font-size: 12px; color: var(--muted); }

        .mockup-result-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          background: rgba(124,58,237,0.1);
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .mockup-result-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
        }

        .mockup-result-price {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 12px;
        }
        .mockup-result-price span { font-size: 16px; color: var(--violet); margin-left: 2px; }

        .mockup-result-desc {
          font-size: 11px;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .mockup-btn {
          width: 100%;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 9px;
          font-size: 12px;
          font-weight: 600;
          font-family: inherit;
          cursor: default;
          box-shadow: 0 0 20px rgba(124,58,237,0.25);
        }

        /* LOGOS */
        .logos-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          background: var(--bg2);
        }

        .logos-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(136,136,160,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .logos-platform {
          font-size: 14px;
          font-weight: 600;
          color: rgba(240,240,245,0.35);
          padding: 6px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          transition: color 0.2s;
        }
        .logos-platform:hover { color: rgba(240,240,245,0.8); }

        /* FEATURES */
        .features-grid-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 48px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet);
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 16px;
          color: var(--muted);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .feature-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px 28px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: rgba(124,58,237,0.3);
          box-shadow: 0 0 40px rgba(124,58,237,0.08);
          transform: translateY(-2px);
        }

        .feature-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .feature-card p {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
        }

        /* HOW IT WORKS */
        .how-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 48px 120px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          position: relative;
        }

        .steps-grid::before {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(16.66% + 16px);
          right: calc(16.66% + 16px);
          height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.4), rgba(192,38,211,0.4));
        }

        .step-item { text-align: center; padding: 0 12px; }

        .step-num-wrap {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 18px;
          font-weight: 700;
          color: var(--violet);
          position: relative;
          z-index: 1;
        }

        .step-item h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }

        .step-item p { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* TESTIMONIALS */
        .testimonials-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px 120px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .testimonial-card:hover { border-color: rgba(124,58,237,0.25); box-shadow: 0 0 30px rgba(124,58,237,0.06); }

        .testimonial-stars {
          font-size: 14px;
          color: var(--violet);
          margin-bottom: 16px;
          letter-spacing: 2px;
        }

        .testimonial-text {
          font-size: 14px;
          color: var(--text);
          line-height: 1.75;
          margin-bottom: 20px;
          font-style: italic;
          opacity: 0.85;
        }

        .testimonial-author { display: flex; align-items: center; gap: 12px; }

        .testimonial-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          background: var(--gradient);
          color: #fff;
          flex-shrink: 0;
        }

        .testimonial-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .testimonial-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* FINAL CTA */
        .cta-section {
          padding: 80px 48px 120px;
          display: flex;
          justify-content: center;
        }

        .cta-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 64px 80px;
          text-align: center;
          max-width: 640px;
          width: 100%;
          box-shadow: 0 0 80px rgba(124,58,237,0.1);
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent);
        }

        .cta-card h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 16px;
        }

        .cta-card p {
          font-size: 16px;
          color: var(--muted);
          max-width: 380px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .waitlist-form {
          display: flex;
          gap: 8px;
          justify-content: center;
          max-width: 420px;
          margin: 0 auto 12px;
          flex-wrap: wrap;
        }

        .waitlist-input {
          flex: 1;
          min-width: 200px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .waitlist-input::placeholder { color: var(--muted); }
        .waitlist-input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }

        .waitlist-btn {
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 0 30px rgba(124,58,237,0.25);
          transition: transform 0.15s, opacity 0.15s;
        }
        .waitlist-btn:hover { transform: scale(1.02); }
        .waitlist-btn:disabled { opacity: 0.5; cursor: default; transform: none; }

        .waitlist-note { font-size: 12px; color: var(--muted); }

        .success-msg {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #A78BFA;
          padding: 12px 20px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 8px;
        }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .steps-grid { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
          .testimonials-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .mockup-body { grid-template-columns: 1fr; }
          .mockup-left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .cta-card { padding: 48px 32px; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 20px 80px; }
          .features-grid-section { padding: 80px 20px; }
          .how-section { padding: 0 20px 80px; }
          .testimonials-section { padding: 0 20px 80px; }
          .cta-section { padding: 40px 20px 80px; }
          .logos-bar { padding: 20px; gap: 8px; }
        }
      `}</style>

      <div className="page">
        <Navbar />

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-badge">✦ Propulsé par l&apos;IA</div>
          <h1>Vendez vos objets en 10 secondes.</h1>
          <p className="hero-sub">
            Une photo. Une annonce parfaite. Publiée sur toutes les plateformes.
            L&apos;IA négocie à votre place.
          </p>
          <div className="hero-ctas">
            <Link href="/signup" className="btn-hero-primary">
              Essayer gratuitement →
            </Link>
            <Link href="/generate" className="btn-hero-outline">
              Voir une démo
            </Link>
          </div>
          <p className="hero-note">Gratuit · Pas de carte bancaire · 50 places</p>

          <div className="mockup-wrap">
            <div className="mockup-bar">
              <div className="mockup-dot" style={{ background: "#ff5f57" }} />
              <div className="mockup-dot" style={{ background: "#febc2e" }} />
              <div className="mockup-dot" style={{ background: "#28c840" }} />
            </div>
            <div className="mockup-body">
              <div className="mockup-left">
                <div className="mockup-upload">
                  <div className="mockup-upload-icon">📷</div>
                  <div className="mockup-upload-text">Glissez votre photo ici</div>
                </div>
              </div>
              <div className="mockup-right">
                <div className="mockup-result-label">Annonce générée</div>
                <div className="mockup-result-title">Nike Air Max 90 — Taille 42</div>
                <div className="mockup-result-price">45<span>€</span></div>
                <div className="mockup-result-desc">
                  Très bon état, portées 3 fois. Coloris blanc/gris.
                  Semelle propre, lacets d&apos;origine inclus.
                </div>
                <button className="mockup-btn">Publier sur Vinted, LeBonCoin, eBay</button>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <div className="logos-bar">
          <span className="logos-label">Vendeurs actifs sur</span>
          <span className="logos-platform">Vinted</span>
          <span className="logos-label">·</span>
          <span className="logos-platform">LeBonCoin</span>
          <span className="logos-label">·</span>
          <span className="logos-platform">eBay</span>
        </div>

        {/* FEATURES */}
        <section className="features-grid-section" id="features">
          <div className="section-header">
            <div className="section-eyebrow">Fonctionnalités</div>
            <h2 className="section-title">Tout ce dont vous avez besoin</h2>
            <p className="section-sub">De la photo à la vente, tout est automatisé.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: "📸", title: "Photo → Annonce en 3 sec", desc: "Notre IA analyse ta photo et génère titre, description, prix optimal et catégorie automatiquement." },
              { icon: "🚀", title: "Publie partout d'un clic", desc: "Vinted, LeBonCoin, eBay. Une seule action, toutes les plateformes. Retrait automatique à la vente." },
              { icon: "💬", title: "L'IA négocie à ta place", desc: "Répond aux acheteurs, filtre les offres, gère les questions 24h/24. Tu es notifié quand c'est vendu." },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="section-header">
            <div className="section-eyebrow">Comment ça marche</div>
            <h2 className="section-title">3 étapes, c&apos;est tout</h2>
          </div>
          <div className="steps-grid">
            {[
              { n: "1", title: "Upload ta photo", desc: "Prends une photo de ton objet. N'importe quel angle, n'importe quelle qualité." },
              { n: "2", title: "L'IA génère ton annonce", desc: "Titre optimisé, description complète, prix juste — en moins de 10 secondes." },
              { n: "3", title: "Publie en 1 clic", desc: "Toutes les plateformes en simultané. L'IA gère les acheteurs pour toi." },
            ].map((s) => (
              <div key={s.n} className="step-item">
                <div className="step-num-wrap">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials-section">
          <div className="section-header">
            <div className="section-eyebrow">Témoignages</div>
            <h2 className="section-title">Ils ont déjà vidé leurs placards.</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { text: "J'ai gagné 340€ en un seul weekend. Je n'aurais jamais imaginé que c'était aussi rapide. Les annonces se rédigent toutes seules !", name: "Sophie", meta: "34 ans · Vendu 12 articles", init: "S" },
              { text: "10 minutes au lieu de 2 heures par annonce. Je posais 10 secondes pour la photo et tout le reste était fait. Incroyable.", name: "Marc", meta: "28 ans · Vendu 8 articles", init: "M" },
              { text: "Vendu en 3 heures. Mon vélo traînait dans le garage depuis 2 ans. Une photo et c'était réglé avant même le déjeuner.", name: "Isabelle", meta: "41 ans · Vendu 5 articles", init: "I" },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.init}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <h2>Prêt à vider vos placards ?</h2>
            <p>Rejoignez la bêta. Gratuit, sans carte bancaire, sans engagement.</p>
            {state.status === "success" ? (
              <div className="success-msg">
                <span>✓</span>
                <span>{state.message}</span>
              </div>
            ) : (
              <>
                <form className="waitlist-form" action={formAction}>
                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    className="waitlist-input"
                    required
                  />
                  <button type="submit" className="waitlist-btn" disabled={pending}>
                    {pending ? "…" : "Rejoindre la bêta"}
                  </button>
                </form>
                {(state.status === "duplicate" || state.status === "error") ? (
                  <p className="waitlist-note" style={{ color: "#f87171" }}>{state.message}</p>
                ) : (
                  <p className="waitlist-note">Gratuit · Pas de carte · 50 places</p>
                )}
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
