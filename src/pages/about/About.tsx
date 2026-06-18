import "../styles/global.css";
import "./About.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: "🤝",
    title: "Artisan First",
    desc: "We put our makers at the center of everything we do — fair pay, visibility, and respect.",
  },
  {
    icon: "🌍",
    title: "Authentically Egyptian",
    desc: "Every product carries a story rooted in centuries of craft tradition across Egypt's regions.",
  },
  {
    icon: "♻️",
    title: "Sustainable Craft",
    desc: "We champion natural materials, traditional methods, and minimal environmental footprint.",
  },
  {
    icon: "💬",
    title: "Community & Trust",
    desc: "Transparent reviews, verified artisans, and a support team you can always reach.",
  },
];

const TEAM = [
  { name: "Layla Hassan",  role: "Co-Founder & CEO",       initial: "L" },
  { name: "Omar Samir",    role: "Co-Founder & CTO",       initial: "O" },
  { name: "Nadia Fouad",   role: "Head of Artisan Success", initial: "N" },
  { name: "Karim Adel",    role: "Creative Director",      initial: "K" },
];

// ─── About Page ───────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main>
        {/* ── Page Hero ── */}
        <section className="about-hero">
          <div className="container about-hero-inner">
            <span className="section-label">Our Story</span>
            <h1 className="display-xl about-hero-title">
              Built on the shoulders<br />of Egypt's makers.
            </h1>
            <p className="lead about-hero-desc">
              Handmade Egypt was born from a simple belief: that the world deserves
              to know the artisans behind each object — not just the object itself.
            </p>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="section">
          <div className="container about-mission">
            <div className="about-mission-text">
              <span className="section-label">Our Mission</span>
              <h2 className="display-md" style={{ marginTop: 8, marginBottom: 16,color:'#3D2E1E' }}>
                Bridging ancient craft<br />with modern discovery.
              </h2>
              <p className="lead">
                We connect independent Egyptian artisans — potters, weavers, jewelers,
                leatherworkers — with customers around the world who value the human
                touch behind every piece.
              </p>
              <p style={{ color: "var(--color-text-muted)", marginTop: 16, lineHeight: 1.8 }}>
                Since 2024 we've worked directly in workshops from Alexandria to Aswan,
                building fair, transparent relationships with over 1,200 makers. No
                middlemen. No mass production. Just craft.
              </p>
              <a href="/marketplace" className="btn btn-primary" style={{ marginTop: 28 }}>
                Explore the Collection →
              </a>
            </div>
            <div className="about-mission-visual">
              <div className="about-mission-img-wrap">
                <div className="about-mission-img-placeholder">
                  <span className="about-mission-img-emoji">🏺</span>
                </div>
                <div className="about-mission-badge">
                  <span className="about-badge-number">1,200+</span>
                  <span className="about-badge-text">Artisans</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="section about-values-section">
          <div className="container">
            <div className="section-header centered">
              <span className="section-label">What guides us</span>
              <h2 className="display-md" style={{ marginTop: 8 }}>Our Values</h2>
            </div>
            <div className="about-values-grid">
              {VALUES.map((v) => (
                <div key={v.title} className="about-value-card card">
                  <span className="about-value-icon">{v.icon}</span>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        

        {/* ── Join CTA ── */}
        <section className="section about-join">
          <div className="container about-join-inner">
            <h2 className="display-md" style={{ color: "#fff" }}>
              Are you an artisan?
            </h2>
            <p style={{ color: "#C9B9A8", marginTop: 10, maxWidth: 480 }}>
              Apply to join our marketplace and reach a global audience that values
              authentic, handcrafted goods.
            </p>
            <div className="about-join-actions">
              <a href="/sell" className="btn btn-primary">Apply as an Artisan</a>
              <a href="/contact" className="btn about-join-outline-btn">Contact Us</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}