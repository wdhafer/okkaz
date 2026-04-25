"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";

const plans = {
  monthly: [
    ["Gratuit", "0€", "3 annonces par mois", "Pour tester OKKAZ sans engagement."],
    ["Pro", "9,90€", "Annonces illimitées", "Pour vendre régulièrement sur plusieurs plateformes."],
    ["Business", "29€", "API et accompagnement", "Pour équipes, revendeurs et intégrations B2B."],
  ],
  annual: [
    ["Gratuit", "0€", "3 annonces par mois", "Pour tester OKKAZ sans engagement."],
    ["Pro", "7,90€", "Facturé annuellement", "Le meilleur prix pour une utilisation continue."],
    ["Business", "23€", "Facturé annuellement", "Pour équipes, revendeurs et intégrations B2B."],
  ],
};

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container tool-shell">
        <div className="page-kicker eyebrow">Tarifs</div>
        <h1 className="page-title">Choisissez votre <span>rythme</span>.</h1>
        <p className="lead">Des plans simples pour passer de quelques ventes ponctuelles à un vrai outil de revente.</p>

        <div className="tabs" style={{ marginTop: 28 }}>
          <button className={`tab ${billing === "monthly" ? "active" : ""}`} onClick={() => setBilling("monthly")}>Mensuel</button>
          <button className={`tab ${billing === "annual" ? "active" : ""}`} onClick={() => setBilling("annual")}>Annuel</button>
        </div>

        <div className="grid-3">
          {plans[billing].map(([name, price, sub, desc]) => (
            <div key={name} className="card" style={name === "Pro" ? { borderColor: "var(--green)", boxShadow: "var(--shadow)" } : undefined}>
              <div className="badge-row">
                <span className={`badge ${name === "Pro" ? "badge-green" : ""}`}>{name}</span>
              </div>
              <div style={{ margin: "22px 0" }}>
                <div className="price">{price}</div>
                <p className="muted">{sub}</p>
              </div>
              <p>{desc}</p>
              <div className="result-grid" style={{ margin: "20px 0" }}>
                <span className="field-value">Génération IA</span>
                <span className="field-value">Dashboard annonces</span>
                <span className="field-value">Contenus marketplace</span>
                {name !== "Gratuit" ? <span className="field-value">Négociation assistée</span> : null}
              </div>
              <Link href={name === "Business" ? "#" : "/signup"} className={`btn ${name === "Pro" ? "btn-green" : "btn-outline"}`} style={{ width: "100%" }}>
                {name === "Business" ? "Nous contacter" : "Commencer"}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
