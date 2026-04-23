"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

const plans = {
  monthly: [
    {
      id: "gratuit",
      name: "Gratuit",
      price: "0€",
      sub: "Pour débuter",
      features: [
        "3 annonces par mois",
        "Génération IA basique",
        "1 marketplace (LeBonCoin)",
        "Support communauté",
      ],
      cta: "Commencer",
      href: "/signup",
      featured: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "9,90€",
      sub: "/mois",
      features: [
        "Annonces illimitées",
        "Génération IA avancée",
        "Vinted, LeBonCoin, eBay",
        "Réponses automatiques 24h/24",
        "Dashboard analytics",
        "Support prioritaire",
      ],
      cta: "Commencer — 9,90€/mois",
      href: "/signup",
      featured: true,
    },
    {
      id: "business",
      name: "Business",
      price: "29€",
      sub: "/mois",
      features: [
        "Tout le plan Pro",
        "API white-label",
        "Intégration B2B",
        "Account manager dédié",
        "SLA 99,9%",
      ],
      cta: "Nous contacter",
      href: "#",
      featured: false,
    },
  ],
  annual: [
    {
      id: "gratuit",
      name: "Gratuit",
      price: "0€",
      sub: "Pour débuter",
      features: [
        "3 annonces par mois",
        "Génération IA basique",
        "1 marketplace (LeBonCoin)",
        "Support communauté",
      ],
      cta: "Commencer",
      href: "/signup",
      featured: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "7,90€",
      sub: "/mois · facturé annuellement",
      features: [
        "Annonces illimitées",
        "Génération IA avancée",
        "Vinted, LeBonCoin, eBay",
        "Réponses automatiques 24h/24",
        "Dashboard analytics",
        "Support prioritaire",
      ],
      cta: "Commencer — 94,80€/an",
      href: "/signup",
      featured: true,
    },
    {
      id: "business",
      name: "Business",
      price: "23€",
      sub: "/mois · facturé annuellement",
      features: [
        "Tout le plan Pro",
        "API white-label",
        "Intégration B2B",
        "Account manager dédié",
        "SLA 99,9%",
      ],
      cta: "Nous contacter",
      href: "#",
      featured: false,
    },
  ],
};

const compare = [
  { feature: "Annonces par mois", gratuit: "3", pro: "Illimitées", business: "Illimitées" },
  { feature: "Génération IA", gratuit: "Basique", pro: "Avancée", business: "Avancée" },
  { feature: "Marketplaces", gratuit: "1", pro: "3", business: "3+" },
  { feature: "Réponses automatiques", gratuit: "—", pro: "✓", business: "✓" },
  { feature: "Dashboard analytics", gratuit: "—", pro: "✓", business: "✓" },
  { feature: "API white-label", gratuit: "—", pro: "—", business: "✓" },
  { feature: "Support", gratuit: "Communauté", pro: "Prioritaire", business: "Dédié" },
  { feature: "SLA", gratuit: "—", pro: "—", business: "99,9%" },
];

const faqs = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, absolument. Montez ou descendez en plan depuis votre espace personnel. Le changement est immédiat, avec prorata calculé à la journée.",
  },
  {
    q: "OKKAZ prend-il une commission sur mes ventes ?",
    a: "Non. L'abonnement est fixe et mensuel. Tout ce que vous vendez est à 100% pour vous. Pas de frais cachés, pas de surprise en fin de mois.",
  },
  {
    q: "Quelles marketplaces sont incluses dans le plan Pro ?",
    a: "Vinted, LeBonCoin et eBay dans le plan Pro. Le plan Gratuit inclut uniquement LeBonCoin. Publication simultanée, retrait automatique dès la vente.",
  },
  {
    q: "Comment fonctionnent les réponses automatiques ?",
    a: "Les acheteurs qui vous contactent reçoivent une réponse intelligente 24h/24, selon votre prix minimum que vous définissez. Vous êtes notifié par email dès qu'un accord est conclu.",
  },
  {
    q: "Y a-t-il un engagement minimum ?",
    a: "Non. L'abonnement mensuel se renouvelle mois par mois. Résiliez quand vous voulez depuis votre profil, sans frais. L'offre annuelle offre une remise de 20%.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const current = plans[billing];

  return (
    <>
      <style>{`
        .pricing-page { min-height: 100vh; }

        .pricing-hero {
          text-align: center;
          padding: 140px 32px 80px;
          max-width: 640px;
          margin: 0 auto;
          position: relative;
        }

        .pricing-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 400px;
          background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.2), transparent);
          pointer-events: none;
          z-index: 0;
        }

        .pricing-hero > * { position: relative; z-index: 1; }

        .pricing-eyebrow {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: #C084FC;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.3);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }

        .pricing-hero h1 {
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 16px;
        }

        .pricing-hero p {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 40px;
        }

        /* TOGGLE */
        .billing-toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 4px;
        }

        .toggle-btn {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          background: none;
          border: none;
          padding: 8px 18px;
          border-radius: 7px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-btn.active {
          background: rgba(255,255,255,0.07);
          color: var(--text);
        }

        .toggle-save {
          font-size: 11px;
          font-weight: 600;
          color: #6EE7B7;
          background: rgba(110,231,183,0.1);
          border: 1px solid rgba(110,231,183,0.2);
          padding: 2px 7px;
          border-radius: 20px;
        }

        /* PLANS */
        .plans-wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 48px 96px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          align-items: start;
        }

        .plan-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          backdrop-filter: blur(20px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .plan-card:hover { box-shadow: 0 0 40px rgba(124,58,237,0.06); }
        .plan-card.featured {
          border-color: rgba(124,58,237,0.4);
          box-shadow: 0 0 60px rgba(124,58,237,0.1);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #fff;
          background: var(--gradient);
          padding: 4px 16px;
          border-radius: 20px;
          white-space: nowrap;
          box-shadow: 0 0 20px rgba(124,58,237,0.3);
        }

        .plan-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }

        .plan-price {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text);
          line-height: 1;
          margin-bottom: 4px;
        }

        .plan-price-sub {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 24px;
        }

        .plan-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 20px;
        }

        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
          flex: 1;
        }

        .plan-features li {
          font-size: 13px;
          color: var(--muted);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
        }

        .plan-features li::before {
          content: '✓';
          color: var(--violet);
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .plan-cta {
          display: block;
          width: 100%;
          text-align: center;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s, opacity 0.15s, border-color 0.15s;
        }

        .plan-cta-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--text);
        }
        .plan-cta-outline:hover { border-color: rgba(124,58,237,0.4); }

        .plan-cta-filled {
          background: var(--gradient);
          border: none;
          color: #fff;
          box-shadow: 0 0 30px rgba(124,58,237,0.2);
        }
        .plan-cta-filled:hover { transform: scale(1.02); opacity: 0.9; }

        /* COMPARE TABLE */
        .compare-wrap {
          max-width: 1000px;
          margin: 0 auto 96px;
          padding: 0 48px;
        }

        .compare-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .compare-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .compare-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .compare-table thead th {
          text-align: left;
          padding: 12px 16px;
          font-weight: 600;
          color: var(--text);
          font-size: 13px;
          border-bottom: 1px solid var(--border);
        }

        .compare-table thead th:not(:first-child) { text-align: center; }

        .compare-table tbody td {
          padding: 12px 16px;
          color: var(--muted);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .compare-table tbody td:not(:first-child) {
          text-align: center;
          color: var(--text);
        }

        .compare-table tbody tr:hover td { background: rgba(255,255,255,0.02); }

        .compare-check { color: var(--violet); font-weight: 600; }
        .compare-dash { color: var(--muted); opacity: 0.3; }

        /* FAQ */
        .faq-wrap {
          max-width: 720px;
          margin: 0 auto 96px;
          padding: 0 48px;
        }

        .faq-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
          text-align: center;
        }

        .faq-list { display: flex; flex-direction: column; gap: 6px; }

        .faq-item {
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          transition: border-color 0.2s;
        }
        .faq-item.open { border-color: rgba(124,58,237,0.3); }

        .faq-question {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
        }

        .faq-chevron {
          color: var(--violet);
          font-size: 20px;
          transition: transform 0.25s;
          flex-shrink: 0;
          font-weight: 400;
          line-height: 1;
        }
        .faq-item.open .faq-chevron { transform: rotate(45deg); }

        .faq-answer {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.75;
          padding: 0 24px 20px;
          display: none;
        }
        .faq-item.open .faq-answer { display: block; }

        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
          .compare-wrap { overflow-x: auto; }
        }
        @media (max-width: 640px) {
          .pricing-hero { padding: 110px 20px 60px; }
          .plans-wrap, .compare-wrap, .faq-wrap { padding: 0 20px; }
          .plans-wrap { padding-bottom: 64px; }
          .compare-wrap { margin-bottom: 64px; }
          .faq-wrap { margin-bottom: 64px; }
        }
      `}</style>

      <div className="pricing-page">
        <Navbar />

        <div className="pricing-hero">
          <div className="pricing-eyebrow">Tarifs · Simple et transparent</div>
          <h1>Un prix fixe.<br />Zéro commission.</h1>
          <p>
            Changez de plan quand vous voulez. Vos ventes restent 100% à vous.
            Aucun frais caché, jamais.
          </p>
          <div className="billing-toggle">
            <button
              className={`toggle-btn${billing === "monthly" ? " active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Mensuel
            </button>
            <button
              className={`toggle-btn${billing === "annual" ? " active" : ""}`}
              onClick={() => setBilling("annual")}
            >
              Annuel
              <span className="toggle-save">−20%</span>
            </button>
          </div>
        </div>

        <div className="plans-wrap">
          <div className="plans-grid">
            {current.map((plan) => (
              <div key={plan.id} className={`plan-card${plan.featured ? " featured" : ""}`}>
                {plan.featured && <span className="popular-badge">Recommandé</span>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-price-sub">{plan.sub}</div>
                <div className="plan-divider" />
                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`plan-cta ${plan.featured ? "plan-cta-filled" : "plan-cta-outline"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARE TABLE */}
        <div className="compare-wrap">
          <div className="compare-label">Comparaison des plans</div>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>Gratuit</th>
                <th style={{ color: "var(--violet)" }}>Pro</th>
                <th>Business</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.feature}>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{row.feature}</td>
                  <td className={row.gratuit === "—" ? "compare-dash" : ""}>{row.gratuit}</td>
                  <td className={row.pro === "✓" ? "compare-check" : row.pro === "—" ? "compare-dash" : ""}>{row.pro}</td>
                  <td className={row.business === "✓" ? "compare-check" : row.business === "—" ? "compare-dash" : ""}>{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="faq-wrap" id="faq">
          <div className="faq-label">Questions fréquentes</div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className="faq-chevron">+</span>
                </button>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
