import "../styles/global.css";
import "./Home.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
    { name: "Pottery & Ceramics", emoji: "🏺", count: "240+ items", bg: "#EDE3D5" },
    { name: "Woven Textiles", emoji: "🧵", count: "180+ items", bg: "#E8D9C8" },
    { name: "Handmade Jewelry", emoji: "💎", count: "320+ items", bg: "#DFD0BB" },
    { name: "Leather Goods", emoji: "👜", count: "95+ items", bg: "#EAE0D0" },
];

const FEATURED = [
    { name: "Terracotta Vase Set", seller: "Hassan Ceramics", price: "450 EGP", rating: 4.9, reviews: 124 },
    { name: "Hand-woven Kilim", seller: "Nour Textiles", price: "890 EGP", rating: 4.8, reviews: 88 },
    { name: "Silver Khamsa", seller: "Cairo Crafts", price: "280 EGP", rating: 5.0, reviews: 61 },
];

const STATS = [
    { value: "1,200+", label: "Artisans" },
    { value: "8,500+", label: "Products" },
    { value: "42", label: "Governorates" },
    { value: "4.9★", label: "Avg. Rating" },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
    return (
        <div className="page-wrapper">
            <Navbar />

            <main>
                {/* ── Hero ── */}
                <section className="home-hero">
                    <div className="home-hero-overlay" />
                    <div className="container home-hero-content">
                        <span className="section-label home-hero-label">Authentically Egyptian</span>
                        <h1 className="display-xl home-hero-title">
                            Crafted with Soul,<br />Made for You.
                        </h1>
                        <p className="lead home-hero-desc">
                            Discover unique handmade treasures from Egypt's finest artisans.
                            From ancient pottery techniques to modern textile designs.
                        </p>
                        <div className="home-hero-actions">
                            <Link to="/marketplace" className="btn btn-primary">
                                Shop the Collection →
                            </Link>
                            <Link to="/gift-quiz" className="btn btn-outline home-hero-quiz-btn">
                                Take the Gift Quiz ✨
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="home-stats-bar">
                    <div className="container home-stats-inner">
                        {STATS.map((s) => (
                            <div key={s.label} className="home-stat">
                                <span className="home-stat-value">{s.value}</span>
                                <span className="home-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Categories ── */}
                <section className="section">
                    <div className="container">
                        <div className="home-section-header">
                            <div>
                                <p className="section-label">Curated collections from local artisans</p>
                                <h2 className="display-md" style={{ marginTop: 6 ,color:'#3D2E1E'}}>Explore Categories</h2>
                            </div>
                            <Link to="/marketplace" className="btn btn-ghost">View All →</Link>
                        </div>

                        <div className="home-categories-grid">
                            {CATEGORIES.map((cat) => (
                                <Link to="/marketplace" key={cat.name} className="home-category-card card">
                                    <div className="home-category-thumb" style={{ background: cat.bg }}>
                                        <span className="home-category-emoji">{cat.emoji}</span>
                                    </div>
                                    <div className="home-category-info">
                                        <p className="home-category-name">{cat.name}</p>
                                        <p className="home-category-count">{cat.count}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Featured ── */}
                <section className="section home-featured-section">
                    <div className="container">
                        <div className="section-header">
                            <p className="section-label">Handpicked for you</p>
                            <h2 className="display-md" style={{ marginTop: 6 }}>Featured Treasures</h2>
                        </div>

                        <div className="home-products-grid">
                            {FEATURED.map((p) => (
                                <div key={p.name} className="home-product-card card">
                                    <div className="home-product-thumb">
                                        <button className="#3D2E1E" aria-label="Wishlist">♡</button>
                                    </div>
                                    <div className="home-product-info">
                                        <div className="home-product-top">
                                            <p className="home-product-name">{p.name}</p>
                                            <p className="home-product-price">{p.price}</p>
                                        </div>
                                        <p className="home-product-seller">By {p.seller}</p>
                                        <p className="home-product-rating">
                                            ⭐ {p.rating}{" "}
                                            <span className="home-product-reviews">({p.reviews} reviews)</span>
                                        </p>
                                        <button className="btn btn-primary home-product-btn">🛒 Add to Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section className="home-cta">
                    <div className="container home-cta-inner">
                        <div>
                            <p className="section-label" style={{ color: "var(--color-primary-light)" }}>Are you an artisan?</p>
                            <h2 className="display-md" style={{ color: "#fff", marginTop: 6 }}>
                                Share your craft with the world
                            </h2>
                            <p style={{ color: "#C9B9A8", marginTop: 10, maxWidth: 420 }}>
                                Join hundreds of Egyptian artisans already selling on our platform.
                            </p>
                        </div>
                        <Link to="/sell" className="btn btn-primary home-cta-btn">Start Selling →</Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}