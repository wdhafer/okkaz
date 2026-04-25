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
        /* ── RESET PAGE ───────────────────────────────────────── */
        .lp {
          background: #fff;
          color: #111;
          min-height: 100vh;
        }

        /* ── NAV override (light) ─────────────────────────────── */
        .lp .okkaz-nav {
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid #eee;
          backdrop-filter: blur(20px);
        }
        .lp .okkaz-logo { color: #111; }
        .lp .okkaz-logo span { color: #7C3AED; }
        .lp .okkaz-nav-link { color: #666; }
        .lp .okkaz-nav-link:hover { color: #111; background: #f5f5f5; }
        .lp .okkaz-btn-ghost { color: #555; }
        .lp .okkaz-btn-ghost:hover { color: #111; background: #f5f5f5; }

        /* ── FOOTER override (light) ──────────────────────────── */
        .lp .okkaz-footer {
          background: #f9f9f9;
          border-top: 1px solid #eee;
        }
        .lp .okkaz-logo-footer { color: #111; }
        .lp .okkaz-logo-footer span { color: #7C3AED; }
        .lp .okkaz-footer-desc { color: #888; }
        .lp .okkaz-footer-col h4 { color: #aaa; }
        .lp .okkaz-footer-col a { color: #666; }
        .lp .okkaz-footer-col a:hover { color: #111; }
        .lp .okkaz-footer-bottom { color: #aaa; border-top-color: #eee; }

        /* ── HERO ─────────────────────────────────────────────── */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 48px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F3F0FF;
          color: #7C3AED;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
          border: 1px solid #E0D7FF;
        }
        .hero-tag-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7C3AED;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero h1 {
          font-size: clamp(40px, 5vw, 62px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #0F0F0F;
          margin-bottom: 20px;
        }
        .hero h1 em {
          font-style: normal;
          color: #7C3AED;
        }

        .hero-desc {
          font-size: 18px;
          color: #555;
          line-height: 1.75;
          margin-bottom: 36px;
          max-width: 440px;
        }

        .hero-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 32px;
        }

        .btn-violet {
          background: #7C3AED;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          padding: 15px 30px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
        }
        .btn-violet:hover { background: #6D28D9; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.35); }

        .btn-outline {
          background: #fff;
          color: #333;
          font-size: 15px;
          font-weight: 600;
          padding: 14px 26px;
          border-radius: 12px;
          border: 2px solid #E5E5E5;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.2s, transform 0.15s;
        }
        .btn-outline:hover { border-color: #7C3AED; color: #7C3AED; transform: translateY(-1px); }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }
        .hero-trust-icon { font-size: 15px; }

        /* Hero right card */
        .hero-card {
          background: #fff;
          border: 2px solid #F0F0F0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
          position: relative;
        }

        .hc-top-bar {
          background: #F8F8F8;
          border-bottom: 1px solid #F0F0F0;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .hc-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hc-url {
          flex: 1;
          background: #fff;
          border: 1px solid #E5E5E5;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 11px;
          color: #999;
          text-align: center;
          margin: 0 8px;
        }
        .hc-badge {
          font-size: 11px;
          font-weight: 700;
          color: #7C3AED;
          background: #F3F0FF;
          border: 1px solid #E0D7FF;
          padding: 3px 9px;
          border-radius: 5px;
        }

        .hc-body { padding: 28px; }

        .hc-photo-zone {
          border: 2px dashed #E0D7FF;
          border-radius: 14px;
          padding: 24px;
          text-align: center;
          background: #FAFAFE;
          margin-bottom: 24px;
        }
        .hc-photo-emoji { font-size: 36px; margin-bottom: 8px; }
        .hc-photo-text { font-size: 13px; color: #999; }
        .hc-photo-file {
          font-size: 12px;
          color: #7C3AED;
          font-weight: 600;
          margin-top: 4px;
        }

        .hc-result-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #16A34A;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .hc-item-name {
          font-size: 17px;
          font-weight: 800;
          color: #0F0F0F;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .hc-item-cat {
          font-size: 12px;
          color: #888;
          margin-bottom: 16px;
        }

        .hc-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 16px;
        }
        .hc-price {
          font-size: 40px;
          font-weight: 900;
          color: #0F0F0F;
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .hc-price-old {
          font-size: 16px;
          color: #bbb;
          text-decoration: line-through;
        }
        .hc-price-tip {
          font-size: 11px;
          font-weight: 600;
          color: #7C3AED;
          background: #F3F0FF;
          padding: 3px 8px;
          border-radius: 5px;
        }

        .hc-platforms {
          display: flex;
          gap: 8px;
          margin-bottom: 18px;
        }
        .hc-platform {
          font-size: 12px;
          font-weight: 600;
          color: #555;
          background: #F5F5F5;
          border: 1px solid #E8E8E8;
          padding: 5px 12px;
          border-radius: 8px;
        }

        .hc-publish-btn {
          width: 100%;
          background: #7C3AED;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-family: inherit;
          cursor: default;
          box-shadow: 0 4px 16px rgba(124,58,237,0.25);
        }

        /* ── LOGOS / SOCIAL PROOF BAR ─────────────────────────── */
        .trust-bar {
          background: #FAFAFA;
          border-top: 1px solid #F0F0F0;
          border-bottom: 1px solid #F0F0F0;
          padding: 20px 48px;
        }
        .trust-bar-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .trust-bar-text { font-size: 13px; color: #999; font-weight: 500; }
        .trust-bar-platform {
          font-size: 14px;
          font-weight: 700;
          color: #444;
          background: #fff;
          border: 1px solid #E5E5E5;
          padding: 6px 16px;
          border-radius: 8px;
        }
        .trust-sep { color: #DDD; font-size: 16px; }

        /* ── STATS ────────────────────────────────────────────── */
        .stats-section {
          background: #7C3AED;
          padding: 56px 48px;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .stat-item {
          text-align: center;
          padding: 0 32px;
          border-right: 1px solid rgba(255,255,255,0.15);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          font-weight: 500;
        }

        /* ── HOW IT WORKS ─────────────────────────────────────── */
        .how-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 48px;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #7C3AED;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(30px, 3.5vw, 46px);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0F0F0F;
          margin-bottom: 60px;
          line-height: 1.1;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .step-card {
          background: #FAFAFA;
          border: 1.5px solid #F0F0F0;
          border-radius: 20px;
          padding: 40px 32px;
          position: relative;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .step-card:hover {
          border-color: #E0D7FF;
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(124,58,237,0.08);
        }

        .step-num {
          font-size: 13px;
          font-weight: 800;
          color: #7C3AED;
          background: #F3F0FF;
          border: 1.5px solid #E0D7FF;
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .step-emoji { font-size: 32px; margin-bottom: 14px; }
        .step-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F0F0F;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .step-desc { font-size: 14px; color: #666; line-height: 1.75; }

        /* ── FEATURES ─────────────────────────────────────────── */
        .features-section {
          background: #F8F7FF;
          border-top: 1px solid #EDE9FF;
          border-bottom: 1px solid #EDE9FF;
          padding: 100px 48px;
        }
        .features-inner { max-width: 1100px; margin: 0 auto; }

        .features-header {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: end;
          margin-bottom: 56px;
        }
        .features-header-sub {
          font-size: 16px;
          color: #666;
          line-height: 1.8;
        }
        .features-header-sub strong { color: #0F0F0F; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .feature-card {
          background: #fff;
          border: 1.5px solid #EDE9FF;
          border-radius: 20px;
          padding: 36px 28px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover {
          border-color: #C4B5FD;
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.08);
        }

        .feature-icon {
          font-size: 34px;
          margin-bottom: 18px;
          display: block;
        }
        .feature-title {
          font-size: 17px;
          font-weight: 800;
          color: #0F0F0F;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .feature-desc { font-size: 14px; color: #666; line-height: 1.75; }

        /* ── PLATFORMS ────────────────────────────────────────── */
        .platforms-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 48px;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 56px;
        }

        .platform-card {
          border-radius: 20px;
          padding: 36px 28px;
          border: 1.5px solid #F0F0F0;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .platform-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.06);
        }

        .platform-stripe {
          height: 4px;
          border-radius: 4px;
          width: 40px;
          margin-bottom: 24px;
        }
        .vinted-stripe { background: #09B1BA; }
        .lbc-stripe { background: #F56600; }
        .ebay-stripe { background: linear-gradient(90deg, #E53238, #0064D2, #F5AF02, #86B817); }

        .platform-name {
          font-size: 22px;
          font-weight: 900;
          color: #0F0F0F;
          margin-bottom: 10px;
          letter-spacing: -0.03em;
        }
        .platform-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.75;
          margin-bottom: 20px;
        }
        .platform-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: #7C3AED;
          background: #F3F0FF;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid #E0D7FF;
        }

        /* ── TESTIMONIALS ─────────────────────────────────────── */
        .testimonials-section {
          background: #FAFAFA;
          border-top: 1px solid #F0F0F0;
          border-bottom: 1px solid #F0F0F0;
          padding: 100px 48px;
        }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 56px;
        }

        .testimonial-card {
          background: #fff;
          border: 1.5px solid #F0F0F0;
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .testimonial-card:hover {
          border-color: #E0D7FF;
          transform: translateY(-2px);
        }

        .testimonial-stars { font-size: 18px; margin-bottom: 14px; color: #F59E0B; }
        .testimonial-text {
          font-size: 15px;
          color: #333;
          line-height: 1.8;
          margin-bottom: 22px;
          font-style: italic;
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
        }
        .testimonial-name { font-size: 14px; font-weight: 700; color: #0F0F0F; }
        .testimonial-meta { font-size: 12px; color: #999; margin-top: 2px; }

        /* ── CTA FINAL ────────────────────────────────────────── */
        .cta-section {
          background: #0F0F0F;
          padding: 100px 48px;
        }
        .cta-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .cta-left .cta-eyebrow {
          font-size: 13px;
          font-weight: 700;
          color: #A78BFA;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }
        .cta-left h2 {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 20px;
        }
        .cta-left h2 em { font-style: normal; color: #A78BFA; }
        .cta-left p { font-size: 16px; color: #888; line-height: 1.8; }

        .waitlist-card {
          background: #1A1A2E;
          border: 1.5px solid rgba(124,58,237,0.2);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 0 60px rgba(124,58,237,0.1);
        }
        .waitlist-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.03em;
        }
        .waitlist-card-sub {
          font-size: 13px;
          color: #888;
          margin-bottom: 24px;
        }

        .waitlist-form { display: flex; flex-direction: column; gap: 10px; }

        .waitlist-input {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          font-family: inherit;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .waitlist-input::placeholder { color: rgba(255,255,255,0.3); }
        .waitlist-input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .waitlist-submit {
          background: #7C3AED;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          padding: 15px;
          border-radius: 12px;
          border: none;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.4);
        }
        .waitlist-submit:hover { background: #6D28D9; transform: translateY(-1px); }
        .waitlist-submit:disabled { opacity: 0.5; cursor: default; transform: none; }

        .waitlist-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #666;
          margin-top: 4px;
          justify-content: center;
        }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          background: rgba(124,58,237,0.1);
          border: 1.5px solid rgba(124,58,237,0.25);
          border-radius: 12px;
          font-size: 15px;
          color: #C084FC;
        }
        .success-check {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 13px;
        }

        /* ── RESPONSIVE ───────────────────────────────────────── */
        @media (max-width: 960px) {
          .hero { grid-template-columns: 1fr; gap: 48px; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 28px 0; }
          .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; }
          .steps-grid { grid-template-columns: 1fr; max-width: 480px; }
          .features-header { grid-template-columns: 1fr; gap: 16px; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .platforms-grid { grid-template-columns: 1fr; max-width: 420px; }
          .testimonials-grid { grid-template-columns: 1fr; max-width: 440px; }
          .cta-inner { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .hero { padding: 110px 24px 60px; }
          .trust-bar { padding: 20px 24px; }
          .stats-section { padding: 40px 24px; }
          .how-section, .platforms-section { padding: 80px 24px; }
          .features-section { padding: 80px 24px; }
          .testimonials-section { padding: 80px 24px; }
          .cta-section { padding: 80px 24px; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lp">
        <Navbar />

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="hero">
          <div>
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Bêta gratuite — 50 places
            </div>

            <h1>
              Vendez n&apos;importe quoi<br />
              en <em>10 secondes.</em>
            </h1>

            <p className="hero-desc">
              Tu prends une photo. L&apos;IA crée l&apos;annonce parfaite
              et la publie sur Vinted, LeBonCoin et eBay. Tu encaisses.
            </p>

            <div className="hero-btns">
              <Link href="/signup" className="btn-violet">
                Commencer gratuitement →
              </Link>
              <Link href="/generate" className="btn-outline">
                Essayer la démo
              </Link>
            </div>

            <div className="hero-trust">
              <div className="hero-trust-item">
                <span className="hero-trust-icon">✅</span>
                Gratuit, sans carte
              </div>
              <div className="hero-trust-item">
                <span className="hero-trust-icon">⚡</span>
                Résultat en 3 secondes
              </div>
              <div className="hero-trust-item">
                <span className="hero-trust-icon">🔒</span>
                Aucun compte requis pour la démo
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hc-top-bar">
              <div className="hc-dot" style={{ background: "#FF5F57" }} />
              <div className="hc-dot" style={{ background: "#FEBC2E" }} />
              <div className="hc-dot" style={{ background: "#28C840" }} />
              <div className="hc-url">okkaz.io/generate</div>
              <div className="hc-badge">IA Gemini ✓</div>
            </div>
            <div className="hc-body">
              <div className="hc-photo-zone">
                <div className="hc-photo-emoji">📸</div>
                <div className="hc-photo-text">Photo uploadée</div>
                <div className="hc-photo-file">nike_air_max_90.jpg · Analysé en 2.1s</div>
              </div>
              <div className="hc-result-label">
                ✓ Annonce générée par l&apos;IA
              </div>
              <div className="hc-item-name">Nike Air Max 90 — Taille 42</div>
              <div className="hc-item-cat">👟 Vêtements &gt; Chaussures homme · Nike</div>
              <div className="hc-price-row">
                <span className="hc-price">45€</span>
                <span className="hc-price-old">80€</span>
                <span className="hc-price-tip">Prix optimal ✓</span>
              </div>
              <div className="hc-platforms">
                <span className="hc-platform">Vinted</span>
                <span className="hc-platform">LeBonCoin</span>
                <span className="hc-platform">eBay</span>
              </div>
              <button className="hc-publish-btn">🚀 Publier sur 3 plateformes</button>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ──────────────────────────────────────── */}
        <div className="trust-bar">
          <div className="trust-bar-inner">
            <span className="trust-bar-text">Annonces publiées sur</span>
            <span className="trust-bar-platform">Vinted</span>
            <span className="trust-sep">·</span>
            <span className="trust-bar-platform">LeBonCoin</span>
            <span className="trust-sep">·</span>
            <span className="trust-bar-platform">eBay</span>
            <span className="trust-sep">·</span>
            <span className="trust-bar-text">Propulsé par Gemini AI</span>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────────────── */}
        <div className="stats-section">
          <div className="stats-inner">
            {[
              { num: "10 000+", label: "Annonces générées" },
              { num: "3 sec", label: "Temps moyen par annonce" },
              { num: "340 €", label: "Gain moyen par vendeur" },
              { num: "3", label: "Plateformes en 1 clic" },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ───────────────────────────────────── */}
        <section className="how-section">
          <span className="section-eyebrow">Comment ça marche</span>
          <h2 className="section-title">Simple comme bonjour.</h2>
          <div className="steps-grid">
            {[
              { n: "1", emoji: "📷", title: "Tu prends une photo", desc: "N'importe quel angle, n'importe quelle qualité. L'IA sait reconnaître l'objet." },
              { n: "2", emoji: "🤖", title: "L'IA rédige tout", desc: "Titre accrocheur, description complète, prix suggéré selon le marché. En 3 secondes." },
              { n: "3", emoji: "🎉", title: "Tu publies, tu vends", desc: "3 plateformes en 1 clic. L'IA répond aux messages à ta place. Tu juste encaisses." },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-emoji">{s.emoji}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────── */}
        <section className="features-section">
          <div className="features-inner">
            <div className="features-header">
              <div>
                <span className="section-eyebrow">Ce qu&apos;on fait pour toi</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Tout est automatique.<br />Vraiment tout.
                </h2>
              </div>
              <p className="features-header-sub">
                Tu n&apos;as plus à rédiger, chercher le bon prix,
                répondre aux messages ou publier sur chaque plateforme.
                <strong> OKKAZ le fait à ta place.</strong>
              </p>
            </div>
            <div className="features-grid">
              {[
                { icon: "🤖", title: "IA multi-photos", desc: "Jusqu'à 5 photos en même temps. Détection automatique de la marque, du modèle, de l'état et de la couleur." },
                { icon: "💰", title: "Prix du marché en temps réel", desc: "L'IA scrute Vinted, LeBonCoin et eBay pour te suggérer le meilleur prix et vendre vite." },
                { icon: "💬", title: "Agent négociateur IA", desc: "Répond aux messages, refuse les offres trop basses, gère les questions. 24h/24, 7j/7." },
                { icon: "🚀", title: "Publication simultanée", desc: "Chaque plateforme a son style. L'IA adapte le contenu — emojis sur Vinted, pro sur eBay." },
                { icon: "📊", title: "Tableau de bord vendeur", desc: "Toutes tes annonces, tes conversations et tes stats au même endroit. Simple et clair." },
                { icon: "🔔", title: "Relance automatique", desc: "Un acheteur ne répond plus ? L'IA le relance 48h après. Tu ne perds aucune vente." },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORMS ──────────────────────────────────────── */}
        <section className="platforms-section">
          <span className="section-eyebrow">Plateformes</span>
          <h2 className="section-title">Une annonce. Partout.</h2>
          <div className="platforms-grid">
            <div className="platform-card">
              <div className="platform-stripe vinted-stripe" />
              <div className="platform-name">Vinted 🟢</div>
              <p className="platform-desc">
                Titre avec emojis, description courte et vendeuse.
                Parfait pour la communauté mode et lifestyle de Vinted.
              </p>
              <span className="platform-badge">45M+ acheteurs actifs</span>
            </div>
            <div className="platform-card">
              <div className="platform-stripe lbc-stripe" />
              <div className="platform-name">LeBonCoin 🟠</div>
              <p className="platform-desc">
                Annonce précise avec marque, modèle, état et dimensions.
                La référence des petites annonces en France.
              </p>
              <span className="platform-badge">28M+ visiteurs / mois</span>
            </div>
            <div className="platform-card">
              <div className="platform-stripe ebay-stripe" />
              <div className="platform-name">eBay 🌍</div>
              <p className="platform-desc">
                Titre SEO, description structurée et professionnelle.
                Touche une audience internationale dès le premier jour.
              </p>
              <span className="platform-badge">Audience mondiale</span>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────── */}
        <section className="testimonials-section">
          <div className="testimonials-inner">
            <span className="section-eyebrow">Témoignages</span>
            <h2 className="section-title">Ils ont vidé leurs placards. 🎉</h2>
            <div className="testimonials-grid">
              {[
                { stars: "⭐⭐⭐⭐⭐", text: "J'ai gagné 340€ en un weekend. Les annonces se rédigent toutes seules, c'est dingue. J'aurais jamais cru que c'était aussi simple.", name: "Sophie M.", meta: "34 ans · 12 articles vendus", init: "S" },
                { stars: "⭐⭐⭐⭐⭐", text: "Avant je mettais 2h par annonce. Maintenant c'est 10 minutes pour 5 articles. La photo, tu cliques, c'est fait. Vraiment impressionnant.", name: "Marc D.", meta: "28 ans · 8 articles vendus", init: "M" },
                { stars: "⭐⭐⭐⭐⭐", text: "Mon vélo traînait dans le garage depuis 2 ans. J'ai pris une photo le matin, vendu avant le déjeuner. C'est magique.", name: "Isabelle R.", meta: "41 ans · 5 articles vendus", init: "I" },
              ].map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div className="testimonial-stars">{t.stars}</div>
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

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-left">
              <span className="cta-eyebrow">C&apos;est le moment</span>
              <h2>
                T&apos;as des objets<br />
                qui <em>dorment</em> chez toi&nbsp;?
              </h2>
              <p>
                Rejoins la bêta gratuite. En 10 secondes, ta première annonce
                est en ligne. Sans effort, sans rédaction, sans prise de tête.
              </p>
            </div>
            <div className="waitlist-card">
              <div className="waitlist-card-title">Rejoindre la bêta 🎉</div>
              <div className="waitlist-card-sub">Gratuit · Pas de carte bancaire · 50 places restantes</div>
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
                    placeholder="ton@email.com"
                    className="waitlist-input"
                    required
                  />
                  <button type="submit" className="waitlist-submit" disabled={pending}>
                    {pending ? "…" : "Accès gratuit →"}
                  </button>
                  {(state.status === "duplicate" || state.status === "error") ? (
                    <p style={{ fontSize: 13, color: "#f87171", textAlign: "center" }}>{state.message}</p>
                  ) : (
                    <div className="waitlist-guarantee">
                      🔒 Tes données restent privées, promis.
                    </div>
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
