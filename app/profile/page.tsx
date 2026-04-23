import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const joinedAt = new Date(user.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

        .page {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
        }

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
          text-decoration: none;
        }
        .logo span { color: var(--lilas); }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--lilas-light);
          text-decoration: none;
          border: 1px solid var(--border);
          padding: 6px 16px;
          border-radius: 20px;
          background: var(--lilas-dim);
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.75; }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 60px;
          position: relative;
          z-index: 1;
        }

        .card {
          width: 100%;
          max-width: 480px;
          background: rgba(155,89,182,0.04);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px 36px;
        }

        .card-tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--lilas);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-tag::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: var(--lilas);
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 32px;
          letter-spacing: -1.5px;
          color: var(--text);
          margin-bottom: 32px;
          line-height: 1.1;
        }
        h1 em { font-style: normal; color: var(--lilas); }

        .info-rows {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .info-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }

        .info-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--lilas);
        }

        .info-value {
          font-size: 15px;
          color: var(--text);
        }

        .info-muted {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }

        .btn-logout {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(240,80,80,0.25);
          color: rgba(240,140,140,0.8);
          border-radius: 8px;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .btn-logout:hover {
          border-color: rgba(240,80,80,0.5);
          background: rgba(240,80,80,0.06);
          color: rgba(255,130,130,1);
        }

        @media (max-width: 640px) {
          nav { padding: 18px 24px; }
          .card { padding: 32px 24px; }
        }
      `}</style>

      <div className="page">
        <div className="glow" />
        <div className="glow-2" />

        <nav>
          <Link href="/" className="logo">OKKAZ<span>.io</span></Link>
          <Link href="/dashboard" className="nav-link">← Dashboard</Link>
        </nav>

        <div className="main">
          <div className="card">
            <div className="card-tag">Profil</div>
            <h1>Mon <em>compte</em></h1>

            <div className="info-rows">
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
                <span className="info-muted">Non modifiable</span>
              </div>
              <div className="info-row">
                <span className="info-label">Membre depuis</span>
                <span className="info-value">{joinedAt}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Identifiant</span>
                <span className="info-value" style={{ fontSize: "13px", opacity: 0.6, fontFamily: "monospace" }}>
                  {user.id}
                </span>
              </div>
            </div>

            <form action={logout}>
              <button type="submit" className="btn-logout">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
