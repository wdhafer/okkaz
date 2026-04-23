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

        /* ── HERO ──────────────────────────────────────────── */
        .hero-wrap {
          position: relative;
          overflow: hidden;
        }

        /* Dot-grid background */
        .hero-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%);
        }

        /* Primary violet orb */
        .hero-orb-1 {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 700px;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.28) 0%, rgba(192,38,211,0.08) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Secondary ambient orb */
        .hero-orb-2 {
          position: absolute;
          top: 30%;
          left: 20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(192,38,211,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: pulse-glow 6s ease-in-out infinite;
        }
        .hero-orb-3 {
          position: absolute;
          top: 20%;
          right: 15%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: pulse-glow 8s ease-in-out infinite 2s;
        }

        .hero {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 160px 32px 100px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          color: #C084FC;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.25);
          padding: 5px 14px 5px 10px;
          border-radius: 20px;
          margin-bottom: 36px;
          letter-spacing: 0.01em;
          animation: fadeUp 0.6s ease both;
        }

        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--violet2);
          box-shadow: 0 0 6px rgba(124,58,237,0.8);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .hero h1 {
          font-size: clamp(52px, 8vw, 88px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.045em;
          color: #FFFFFF;
          max-width: 780px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .hero h1 .gradient-word {
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }

        .hero-sub {
          font-size: 19px;
          color: var(--muted);
          max-width: 500px;
          line-height: 1.75;
          margin-bottom: 48px;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .hero-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 16px;
          animation: fadeUp 0.6s ease 0.3s both;
        }

        .btn-hero-primary {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: var(--gradient);
          border: none;
          padding: 13px 28px;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 40px rgba(124,58,237,0.35), 0 4px 20px rgba(0,0,0,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: -0.01em;
        }
        .btn-hero-primary:hover {
          transform: scale(1.02) translateY(-1px);
          box-shadow: 0 0 60px rgba(124,58,237,0.5), 0 8px 32px rgba(0,0,0,0.4);
        }

        .btn-hero-outline {
          font-size: 15px;
          font-weight: 500;
          color: var(--text2);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 13px 28px;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          letter-spacing: -0.01em;
        }
        .btn-hero-outline:hover {
          border-color: rgba(124,58,237,0.45);
          background: rgba(124,58,237,0.06);
          transform: translateY(-1px);
        }

        .hero-note {
          font-size: 12px;
          color: rgba(112,112,136,0.7);
          letter-spacing: 0.03em;
          animation: fadeUp 0.6s ease 0.4s both;
        }

        /* ── MOCKUP ────────────────────────────────────────── */
        .mockup-wrap {
          width: 100%;
          max-width: 780px;
          margin: 72px auto 0;
          background: var(--bg2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          box-shadow: 0 0 100px rgba(124,58,237,0.15), 0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: fadeUp 0.6s ease 0.5s both;
          position: relative;
        }

        .mockup-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.5) 30%, rgba(192,38,211,0.5) 70%, transparent 95%);
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
        .mockup-bar-right {
          margin-left: auto;
          display: flex;
          gap: 6px;
        }
        .mockup-tab {
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
          padding: 3px 10px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .mockup-tab.active {
          color: var(--text);
          background: rgba(124,58,237,0.12);
          border-color: rgba(124,58,237,0.25);
        }

        .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }

        .mockup-body { display: grid; grid-template-columns: 1fr 1fr; }

        .mockup-left {
          padding: 28px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .mockup-right { padding: 28px; }

        .mockup-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(112,112,136,0.6);
          margin-bottom: 12px;
        }

        .mockup-upload {
          border: 2px dashed rgba(124,58,237,0.35);
          border-radius: 12px;
          padding: 40px 16px;
          text-align: center;
          background: rgba(124,58,237,0.03);
          position: relative;
          overflow: hidden;
        }
        .mockup-upload::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,58,237,0.08), transparent);
        }
        .mockup-upload-icon { font-size: 28px; margin-bottom: 10px; position: relative; }
        .mockup-upload-text { font-size: 12px; color: var(--muted); position: relative; }
        .mockup-upload-sub { font-size: 11px; color: rgba(112,112,136,0.5); margin-top: 4px; position: relative; }

        .mockup-result-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet2);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .mockup-result-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .mockup-result-cat {
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .mockup-result-price {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          margin-bottom: 10px;
          line-height: 1;
        }
        .mockup-result-price span { font-size: 18px; color: var(--violet2); margin-left: 1px; }

        .mockup-result-desc {
          font-size: 11px;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border);
        }

        .mockup-platforms {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
        }
        .mockup-platform-pill {
          font-size: 10px;
          font-weight: 500;
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 8px;
          border-radius: 4px;
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
          box-shadow: 0 0 24px rgba(124,58,237,0.3);
          letter-spacing: -0.01em;
        }

        /* ── LOGOS ─────────────────────────────────────────── */
        .logos-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 26px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          background: rgba(14,14,22,0.6);
        }

        .logos-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(112,112,136,0.45);
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .logos-platform {
          font-size: 13px;
          font-weight: 600;
          color: rgba(240,240,245,0.28);
          padding: 5px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 7px;
          transition: color 0.2s, border-color 0.2s;
          cursor: default;
        }
        .logos-platform:hover { color: rgba(240,240,245,0.75); border-color: rgba(255,255,255,0.12); }

        /* ── FEATURES ──────────────────────────────────────── */
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--violet2);
          margin-bottom: 20px;
        }
        .section-eyebrow::before, .section-eyebrow::after {
          content: '';
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--violet));
        }
        .section-eyebrow::after {
          background: linear-gradient(90deg, var(--violet), transparent);
        }

        .section-title {
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 16px;
          color: var(--muted);
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.75;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 32px 28px;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(124,58,237,0.25);
          box-shadow: 0 0 48px rgba(124,58,237,0.07), 0 20px 40px rgba(0,0,0,0.3);
          transform: translateY(-3px);
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(192,38,211,0.08));
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(124,58,237,0.1);
        }

        .feature-card h3 {
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 10px;
          letter-spacing: -0.025em;
        }

        .feature-card p {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── HOW IT WORKS ──────────────────────────────────── */
        .how-section {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 48px 120px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          position: relative;
        }

        .steps-connector {
          position: absolute;
          top: 28px;
          left: calc(16.66% + 20px);
          right: calc(16.66% + 20px);
          height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.5), rgba(192,38,211,0.5));
        }

        .step-item { text-align: center; padding: 0 12px; }

        .step-num-wrap {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 16px;
          font-weight: 800;
          color: var(--violet2);
          position: relative;
          z-index: 1;
          letter-spacing: -0.03em;
          box-shadow: 0 0 20px rgba(124,58,237,0.1);
        }

        .step-item h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .step-item p { font-size: 13px; color: var(--muted); line-height: 1.65; }

        /* ── TESTIMONIALS ──────────────────────────────────── */
        .testimonials-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px 120px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::after {
          content: '"';
          position: absolute;
          top: 12px; right: 20px;
          font-size: 72px;
          font-weight: 900;
          color: rgba(124,58,237,0.08);
          font-family: Georgia, serif;
          line-height: 1;
        }
        .testimonial-card:hover {
          border-color: rgba(124,58,237,0.2);
          box-shadow: 0 0 40px rgba(124,58,237,0.05), 0 16px 32px rgba(0,0,0,0.2);
          transform: translateY(-2px);
        }

        .testimonial-stars {
          font-size: 13px;
          color: #A78BFA;
          margin-bottom: 16px;
          letter-spacing: 3px;
        }

        .testimonial-text {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.8;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .testimonial-author { display: flex; align-items: center; gap: 12px; }

        .testimonial-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          background: var(--gradient);
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(124,58,237,0.25);
          letter-spacing: -0.02em;
        }

        .testimonial-name { font-size: 13px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; }
        .testimonial-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* ── FINAL CTA ─────────────────────────────────────── */
        .cta-section {
          padding: 80px 48px 120px;
          display: flex;
          justify-content: center;
        }

        .cta-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 72px 80px;
          text-align: center;
          max-width: 640px;
          width: 100%;
          box-shadow: 0 0 100px rgba(124,58,237,0.12), 0 40px 80px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.6) 30%, rgba(192,38,211,0.6) 70%, transparent 95%);
        }

        .cta-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%);
          pointer-events: none;
        }

        .cta-card h2 {
          font-size: clamp(30px, 3.5vw, 46px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .cta-card p {
          font-size: 16px;
          color: var(--muted);
          max-width: 360px;
          margin: 0 auto 44px;
          line-height: 1.75;
          position: relative;
          z-index: 1;
        }

        .waitlist-form {
          display: flex;
          gap: 8px;
          justify-content: center;
          max-width: 420px;
          margin: 0 auto 12px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .waitlist-input {
          flex: 1;
          min-width: 200px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .waitlist-input::placeholder { color: rgba(112,112,136,0.6); }
        .waitlist-input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .waitlist-btn {
          background: var(--gradient);
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 12px 22px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 0 32px rgba(124,58,237,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          letter-spacing: -0.01em;
        }
        .waitlist-btn:hover { transform: scale(1.02); box-shadow: 0 0 48px rgba(124,58,237,0.45); }
        .waitlist-btn:disabled { opacity: 0.5; cursor: default; transform: none; }

        .waitlist-note {
          font-size: 12px;
          color: rgba(112,112,136,0.6);
          position: relative;
          z-index: 1;
        }

        .success-msg {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #C084FC;
          padding: 14px 22px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 10px;
          position: relative;
          z-index: 1;
        }

        .success-check {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }

        /* ── RESPONSIVE ────────────────────────────────────── */
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .steps-grid { grid-template-columns: 1fr; }
          .steps-connector { display: none; }
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
        <div className="hero-wrap">
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />
          <div className="hero-orb-3" />

          <section className="hero">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Propulsé par l&apos;IA · Bêta ouverte
            </div>

            <h1>
              Vendez vos objets<br />
              en <span className="gradient-word">10 secondes.</span>
            </h1>

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
                <div className="mockup-bar-right">
                  <span className="mockup-tab active">Générer</span>
                  <span className="mockup-tab">Dashboard</span>
                </div>
              </div>
              <div className="mockup-body">
                <div className="mockup-left">
                  <div className="mockup-section-label">Votre photo</div>
                  <div className="mockup-upload">
                    <div className="mockup-upload-icon">📷</div>
                    <div className="mockup-upload-text">Glissez votre photo ici</div>
                    <div className="mockup-upload-sub">JPG, PNG, WEBP · max 20 Mo</div>
                  </div>
                </div>
                <div className="mockup-right">
                  <div className="mockup-result-label">Annonce générée</div>
                  <div className="mockup-result-title">Nike Air Max 90 — Taille 42</div>
                  <div className="mockup-result-cat">Vêtements · Chaussures homme</div>
                  <div className="mockup-result-price">45<span>€</span></div>
                  <div className="mockup-result-desc">
                    Très bon état, portées 3 fois. Coloris blanc/gris.
                    Semelle propre, lacets d&apos;origine inclus.
                  </div>
                  <div className="mockup-platforms">
                    <span className="mockup-platform-pill">Vinted</span>
                    <span className="mockup-platform-pill">LeBonCoin</span>
                    <span className="mockup-platform-pill">eBay</span>
                  </div>
                  <button className="mockup-btn">Publier sur 3 plateformes →</button>
                </div>
              </div>
            </div>
          </section>
        </div>

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
            <div className="steps-connector" />
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
                <span className="success-check">✓</span>
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
                  <p className="waitlist-note">Gratuit · Pas de carte · 50 places restantes</p>
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
