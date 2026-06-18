import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import "../../style/AuthPages.css";

interface AuthPageProps {
  defaultTab?: "login" | "register";
}
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=80";

export function AuthPage({ defaultTab = "login" }: AuthPageProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  return (
    <div className="auth-page">
      {/* ======================== LEFT: HERO PANEL ======================== */}
      <div className="auth-hero">
        <img
          src={HERO_IMAGE}
          alt="Egyptian artisan crafting pottery"
          className="auth-hero-img"
        />
        <div className="auth-hero-overlay">
          {/* Brand logo in top-left */}
          <div className="auth-hero-logo">
            <span className="auth-hero-logo-icon">🏺</span>
            Handmade
          </div>

          {/* Hero headline */}
          <div>
            <h1 className="auth-hero-title">
              Turn Your Passion
              <br />
              into a Business
            </h1>
            <p className="auth-hero-sub">
              Join Egypt's largest handmade marketplace and
              <br />
              share your craft with the world.
            </p>

            {/* Stats badges */}
            <div className="auth-hero-stats">
              <div className="auth-hero-stat">
                <strong>500+</strong>
                <span>Artists</span>
              </div>
              <div className="auth-hero-stat">
                <strong>10,000+</strong>
                <span>Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================== RIGHT: FORM PANEL ======================== */}
      <div className="auth-panel">
        {tab === "login" ? (
          <Login onSwitchToRegister={() => setTab("register")} />
        ) : (
          <Register onSwitchToLogin={() => setTab("login")} />
        )}
      </div>
    </div>
  );
}
