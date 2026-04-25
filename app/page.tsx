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
        /* ── BASE ─────────────────────────────────────────── */
        .page { min-height: 100vh; }

        /* ── HERO ─────────────────────────────────────────── */
        .hero-section {
          padding: 140px 48px 80px;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .hero-left {}

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          color: var(--violet2);
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 5px 12px;
          border-radius: 6px;
          margin-bottom: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #A855F7;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .hero h1 {
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 24px;
        }

        .hero-accent {
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }

        .hero-desc {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 420px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-primary {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: var(--gradient);
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 40px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(124,58,237,0.45), 0 8px 32px rgba(0,0,0,0.4);
        }

        .btn-ghost {
          font-size: 14px;
          font-weight: 500;
          color: var(--text2);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 13px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover {
          border-color: rgba(124,58,237,0.4);
          background: rgba(124,58,237,0.05);
        }

        /* Hero right — product mockup card */
        .hero-card {
          background: var(--bg2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 80px rgba(124,58,237,0.12), 0 40px 80px rgba(0,0,0,0.5);
          position: relative;
        }
        .hero-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--gradient);
          opacity: 0.7;
        }

        .hero-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg3);
        }
        .hch-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hch-spacer { flex: 1; }
        .hch-tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--violet2);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .hero-card-upload {
          padding: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hcu-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(112,112,136,0.5);
          margin-bottom: 12px;
        }
        .hcu-zone {
          border: 1.5px dashed rgba(124,58,237,0.3);
          border-radius: 12px;
          padding: 32px 16px;
          text-align: center;
          background: rgba(124,58,237,0.03);
        }
        .hcu-icon { font-size: 26px; margin-bottom: 8px; }
        .hcu-text { font-size: 12px; color: var(--muted); }

        .hero-card-result { padding: 28px; }
        .hcr-chip {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--violet2);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.18);
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 14px;
        }
        .hcr-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .hcr-cat {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .hcr-price {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 16px;
        }
        .hcr-price-euro { font-size: 20px; color: var(--violet2); margin-left: 2px; }
        .hcr-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin-bottom: 16px; }
        .hcr-platforms {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .hcr-platform {
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 4px 10px;
          border-radius: 5px;
        }
        .hcr-btn {
          width: 100%;
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: default;
          box-shadow: 0 0 24px rgba(124,58,237,0.3);
        }

        /* ── STATS BAR ────────────────────────────────────── */
        .stats-bar {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: var(--bg2);
          padding: 0 48px;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          padding: 36px 40px;
          border-right: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-num .stat-accent {
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.4;
        }

        /* ── HOW IT WORKS ─────────────────────────────────── */
        .how-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 48px;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--violet2);
          margin-bottom: 16px;
          display: block;
        }

        .section-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 60px;
        }

        .steps-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-card {
          background: var(--bg);
          padding: 48px 36px;
          position: relative;
          transition: background 0.2s;
        }
        .step-card:hover { background: var(--bg2); }

        .step-number {
          font-size: 56px;
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1;
          margin-bottom: 20px;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.4;
        }

        .step-icon {
          font-size: 28px;
          margin-bottom: 16px;
          display: block;
        }

        .step-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .step-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── FEATURES ─────────────────────────────────────── */
        .features-section {
          background: var(--bg2);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 100px 48px;
        }

        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .features-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 64px;
        }

        .features-header-right {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.8;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .feature-card {
          background: var(--bg2);
          padding: 40px 32px;
          transition: background 0.2s;
        }
        .feature-card:hover { background: var(--bg3); }

        .feature-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 24px;
        }

        .feature-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
          letter-spacing: -0.025em;
        }

        .feature-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── PLATFORMS ────────────────────────────────────── */
        .platforms-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 48px;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 60px;
        }

        .platform-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 36px 28px;
          background: var(--bg2);
          transition: border-color 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .platform-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
        }
        .platform-card.vinted::before { background: linear-gradient(90deg, #09B1BA, #00BFA5); }
        .platform-card.leboncoin::before { background: linear-gradient(90deg, #F56600, #FF8C00); }
        .platform-card.ebay::before { background: linear-gradient(90deg, #86B817, #0064D2); }

        .platform-card:hover {
          border-color: rgba(124,58,237,0.25);
          transform: translateY(-3px);
        }

        .platform-name {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .platform-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .platform-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: var(--violet2);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* ── TESTIMONIALS ─────────────────────────────────── */
        .testimonials-section {
          background: var(--bg2);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 100px 48px;
        }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 60px;
        }

        .testimonial-card {
          background: var(--bg);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .testimonial-card:hover {
          border-color: rgba(124,58,237,0.2);
          transform: translateY(-2px);
        }

        .testimonial-stars {
          font-size: 14px;
          color: #A78BFA;
          letter-spacing: 2px;
          margin-bottom: 18px;
        }

        .testimonial-text {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.85;
          margin-bottom: 24px;
        }

        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: var(--gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
        }
        .testimonial-name { font-size: 13px; font-weight: 700; color: var(--text); }
        .testimonial-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* ── FINAL CTA ────────────────────────────────────── */
        .cta-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .cta-left h2 {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 20px;
        }

        .cta-left p {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.8;
        }

        .cta-right {}

        .waitlist-card {
          background: var(--bg2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }
        .waitlist-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--gradient);
          opacity: 0.8;
        }

        .waitlist-card-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet2);
          margin-bottom: 20px;
          display: block;
        }

        .waitlist-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .waitlist-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 16px;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .waitlist-input::placeholder { color: rgba(112,112,136,0.6); }
        .waitlist-input:focus {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .waitlist-btn {
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 0 32px rgba(124,58,237,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .waitlist-btn:hover { transform: translateY(-1px); box-shadow: 0 0 48px rgba(124,58,237,0.45); }
        .waitlist-btn:disabled { opacity: 0.5; cursor: default; transform: none; }

        .waitlist-note {
          font-size: 12px;
          color: rgba(112,112,136,0.6);
          text-align: center;
          margin-top: 4px;
        }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #C084FC;
          padding: 16px 20px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 10px;
        }
        .success-check {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 900px) {
          .hero-section { grid-template-columns: 1fr; gap: 48px; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-right: 1px solid rgba(255,255,255,0.06); }
          .steps-row { grid-template-columns: 1fr; }
          .features-header { grid-template-columns: 1fr; gap: 16px; }
          .features-grid { grid-template-columns: 1fr; }
          .platforms-grid { grid-template-columns: 1fr; max-width: 400px; }
          .testimonials-grid { grid-template-columns: 1fr; max-width: 420px; }
          .cta-section { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 640px) {
          .hero-section { padding: 120px 24px 60px; }
          .stats-bar { padding: 0 24px; }
          .stat-item { padding: 28px 20px; }
          .how-section { padding: 80px 24px; }
          .features-section { padding: 80px 24px; }
          .platforms-section { padding: 80px 24px; }
          .testimonials-section { padding: 80px 24px; }
          .cta-section { padding: 80px 24px; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="page">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero-section">
          <div className="hero-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Bêta ouverte · Gratuit
            </span>

            <h1>
              Vendez vos objets<br />
              en <span className="hero-accent">10 secondes.</span>
            </h1>

            <p className="hero-desc">
              Une photo. Une annonce parfaite générée par l&apos;IA.
              Publiée sur Vinted, LeBonCoin et eBay simultanément.
            </p>

            <div className="hero-actions">
              <Link href="/signup" className="btn-primary">
                Commencer gratuitement →
              </Link>
              <Link href="/generate" className="btn-ghost">
                Voir la démo
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hch-dot" style={{ background: "#ff5f57" }} />
              <div className="hch-dot" style={{ background: "#febc2e" }} />
              <div className="hch-dot" style={{ background: "#28c840" }} />
              <span className="hch-spacer" />
              <span className="hch-tag">Annonce générée ✓</span>
            </div>
            <div className="hero-card-upload">
              <div className="hcu-label">Photo uploadée</div>
              <div className="hcu-zone">
                <div className="hcu-icon">📸</div>
                <div className="hcu-text">nike_air_max.jpg · Analyse en cours…</div>
              </div>
            </div>
            <div className="hero-card-result">
              <span className="hcr-chip">IA · Résultat</span>
              <div className="hcr-title">Nike Air Max 90 — Taille 42</div>
              <div className="hcr-cat">Vêtements · Chaussures homme · Nike</div>
              <div className="hcr-price">45<span className="hcr-price-euro">€</span></div>
              <hr className="hcr-divider" />
              <div className="hcr-platforms">
                <span className="hcr-platform">Vinted</span>
                <span className="hcr-platform">LeBonCoin</span>
                <span className="hcr-platform">eBay</span>
              </div>
              <button className="hcr-btn">Publier sur 3 plateformes →</button>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ────────────────────────────────── */}
        <div className="stats-bar">
          <div className="stats-inner">
            {[
              { num: "10 000+", accent: true, label: "Annonces générées" },
              { num: "3", accent: false, label: "Plateformes connectées" },
              { num: "3 sec", accent: true, label: "Temps moyen par annonce" },
              { num: "340 €", accent: false, label: "Gain moyen par vendeur" },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">
                  {s.accent
                    ? <span className="stat-accent">{s.num}</span>
                    : s.num
                  }
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section className="how-section">
          <span className="section-eyebrow">Comment ça marche</span>
          <h2 className="section-title">3 étapes, c&apos;est tout.</h2>
          <div className="steps-row">
            {[
              { n: "01", icon: "📷", title: "Upload ta photo", desc: "Prends une photo de ton objet. N'importe quel angle, n'importe quelle qualité." },
              { n: "02", icon: "⚡", title: "L'IA génère ton annonce", desc: "Titre SEO, description complète, prix optimisé et mots-clés — en moins de 10 secondes." },
              { n: "03", icon: "🚀", title: "Publie partout en 1 clic", desc: "Vinted, LeBonCoin, eBay en simultané. L'IA répond aux acheteurs à ta place." },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <span className="step-icon">{s.icon}</span>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section className="features-section">
          <div className="features-inner">
            <div className="features-header">
              <div>
                <span className="section-eyebrow">Fonctionnalités</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Tout ce dont vous avez besoin pour vendre vite.
                </h2>
              </div>
              <p className="features-header-right">
                De la photo à la vente, OKKAZ automatise chaque étape.
                Zéro rédaction. Zéro négociation. Zéro galère.
              </p>
            </div>
            <div className="features-grid">
              {[
                { icon: "🤖", title: "IA multi-photos", desc: "Analyse jusqu'à 5 photos simultanément. Détecte marque, modèle, état et génère une description professionnelle." },
                { icon: "💰", title: "Prix intelligent", desc: "Compare les prix du marché en temps réel sur toutes les plateformes et suggère le prix optimal pour vendre vite." },
                { icon: "💬", title: "Agent négociateur", desc: "Répond automatiquement aux messages, filtre les offres trop basses et gère les questions 24h/24 à ta place." },
                { icon: "📊", title: "Dashboard vendeur", desc: "Toutes tes annonces, négociations et statistiques en un seul endroit. Suivi en temps réel de tes ventes." },
                { icon: "🌐", title: "Publication multi-plateforme", desc: "Contenu adapté automatiquement au style de chaque plateforme — emojis pour Vinted, pro pour eBay." },
                { icon: "🔔", title: "Relance automatique", desc: "Si un acheteur ne répond pas, l'IA envoie une relance personnalisée après 48h. Tu n'oublie rien." },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORMS ────────────────────────────────── */}
        <section className="platforms-section">
          <span className="section-eyebrow">Plateformes</span>
          <h2 className="section-title">Publié partout, en une fois.</h2>
          <div className="platforms-grid">
            <div className="platform-card vinted">
              <div className="platform-name">Vinted</div>
              <p className="platform-desc">
                Titre casual avec emojis, description courte et impactante.
                Format optimisé pour la communauté Vinted.
              </p>
              <span className="platform-tag">45M+ acheteurs</span>
            </div>
            <div className="platform-card leboncoin">
              <div className="platform-name">LeBonCoin</div>
              <p className="platform-desc">
                Annonce précise avec marque, modèle et état clairement indiqués.
                Format référence du marché français.
              </p>
              <span className="platform-tag">28M+ visiteurs/mois</span>
            </div>
            <div className="platform-card ebay">
              <div className="platform-name">eBay</div>
              <p className="platform-desc">
                Titre SEO orienté mots-clés, description structurée et professionnelle.
                Format optimisé pour les enchères et achats immédiats.
              </p>
              <span className="platform-tag">Audience internationale</span>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────── */}
        <section className="testimonials-section">
          <div className="testimonials-inner">
            <span className="section-eyebrow">Témoignages</span>
            <h2 className="section-title">Ils ont déjà vidé leurs placards.</h2>
            <div className="testimonials-grid">
              {[
                { text: "J'ai gagné 340€ en un seul weekend. Je n'aurais jamais imaginé que c'était aussi rapide. Les annonces se rédigent toutes seules !", name: "Sophie M.", meta: "34 ans · 12 articles vendus", init: "S" },
                { text: "10 minutes au lieu de 2 heures par annonce. Je posais 10 secondes pour la photo et tout le reste était fait. Incroyable.", name: "Marc D.", meta: "28 ans · 8 articles vendus", init: "M" },
                { text: "Vendu en 3 heures. Mon vélo traînait dans le garage depuis 2 ans. Une photo et c'était réglé avant même le déjeuner.", name: "Isabelle R.", meta: "41 ans · 5 articles vendus", init: "I" },
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
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section className="cta-section">
          <div className="cta-left">
            <span className="section-eyebrow">Rejoindre la bêta</span>
            <h2>Prêt à vider vos placards&nbsp;?</h2>
            <p>Gratuit, sans carte bancaire, sans engagement. 50 places restantes dans la bêta.</p>
          </div>
          <div className="cta-right">
            <div className="waitlist-card">
              <span className="waitlist-card-label">Accès bêta gratuit</span>
              {state.status === "success" ? (
                <div className="success-msg">
                  <span className="success-check">✓</span>
                  <span>{state.message}</span>
                </div>
              ) : (
                <form className="waitlist-form" action={formAction}>
                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    className="waitlist-input"
                    required
                  />
                  <button type="submit" className="waitlist-btn" disabled={pending}>
                    {pending ? "…" : "Rejoindre la bêta →"}
                  </button>
                  {(state.status === "duplicate" || state.status === "error") ? (
                    <p className="waitlist-note" style={{ color: "#f87171" }}>{state.message}</p>
                  ) : (
                    <p className="waitlist-note">Gratuit · Pas de carte · 50 places</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
