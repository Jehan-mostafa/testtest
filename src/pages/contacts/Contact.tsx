import { useState } from "react";
import "../styles/global.css";
import "./Contact.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  { icon: "📧", label: "Email",    value: "hello@handmadeegypt.com", href: "mailto:hello@handmadeegypt.com" },
  { icon: "📞", label: "Phone",    value: "+20 100 123 4567",        href: "tel:+201001234567" },
  { icon: "📍", label: "Location", value: "Cairo, Egypt",            href: "#" },
  { icon: "⏰", label: "Hours",    value: "Sun–Thu, 9am – 6pm",      href: "#" },
];

const TOPICS = [
  "General Inquiry",
  "Artisan Onboarding",
  "Order Support",
  "Partnership",
  "Press / Media",
  "Other",
];

// ─── Contact Page ─────────────────────────────────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", email: "", topic: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="contact-hero">
          <div className="container">
            <span className="section-label">We'd love to hear from you</span>
            <h1 className="display-xl contact-hero-title">Get in Touch</h1>
            <p className="lead contact-hero-desc">
              Have a question, a partnership idea, or just want to say hello?
              Our team usually responds within one business day.
            </p>
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="section">
          <div className="container contact-grid">

            {/* Left — Contact Info */}
            <aside className="contact-info-col">
              <h2 className="contact-info-heading">Contact Info</h2>
              <div className="contact-info-list">
                {CONTACT_INFO.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="contact-info-item"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    <span className="contact-info-icon">{item.icon}</span>
                    <div>
                      <p className="contact-info-label">{item.label}</p>
                      <p className="contact-info-value">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="contact-map-placeholder">
                <span style={{ fontSize: 32 }}>🗺️</span>
                <p>Cairo, Egypt</p>
              </div>
            </aside>

            {/* Right — Form */}
            <div className="contact-form-col">
              {submitted ? (
                <div className="contact-success card">
                  <span className="contact-success-icon">✅</span>
                  <h3 className="contact-success-title">Message Sent!</h3>
                  <p className="contact-success-desc">
                    Thanks for reaching out. We'll get back to you within one business day.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setSubmitted(false); setFormData({ name:"", email:"", topic:"", message:"" }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="contact-form-wrap card">
                  <h2 className="contact-form-heading">Send a Message</h2>

                  <form className="contact-form" onSubmit={handleSubmit} noValidate>
                    <div className="contact-form-row">
                      <div className="contact-field">
                        <label className="contact-label" htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="contact-input"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="contact-field">
                        <label className="contact-label" htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="contact-input"
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="contact-field">
                      <label className="contact-label" htmlFor="topic">Topic</label>
                      <select
                        id="topic"
                        name="topic"
                        className="contact-select"
                        value={formData.topic}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic…</option>
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="contact-field">
                      <label className="contact-label" htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        className="contact-textarea"
                        placeholder="Tell us how we can help…"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary contact-submit-btn">
                      Send Message →
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
