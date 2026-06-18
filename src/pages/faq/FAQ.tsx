import { useState } from "react";
import "../styles/global.css";
import "./FAQ.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  icon: string;
  items: FAQItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQ_DATA: FAQCategory[] = [
  {
    category: "Shopping & Orders",
    icon: "🛒",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our marketplace, add items to your cart, and proceed to checkout. We accept credit cards, debit cards, and Fawry payments. You'll receive a confirmation email once your order is placed.",
      },
      {
        q: "Can I customize a product?",
        a: "Many of our artisans accept custom orders — look for the 'Custom Orders' tag on product pages, or use our Gift Quiz to get personalized recommendations. You can also contact sellers directly through the product page.",
      },
      {
        q: "What currencies do you accept?",
        a: "All prices are listed in Egyptian Pounds (EGP). We also accept international cards; your bank will convert to your local currency at the current exchange rate.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We use 256-bit SSL encryption and never store your card details. All payments are processed through certified, PCI-compliant payment gateways.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: "📦",
    items: [
      {
        q: "How long does delivery take?",
        a: "Delivery within Egypt typically takes 2–5 business days. International shipping takes 7–14 business days depending on your country. Handcrafted items may take longer if they require final touches.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to over 40 countries. Shipping costs and delivery times vary by destination and will be shown at checkout before you confirm your order.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can use it on our website or the carrier's website to follow your package in real time.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "↩️",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery for items that arrive damaged or significantly different from their description. Custom-made items are non-refundable unless faulty.",
      },
      {
        q: "How do I start a return?",
        a: "Contact our support team at hello@handmadeegypt.com with your order number and photos of the issue. We'll arrange a return or replacement within 48 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Approved refunds are processed within 3–5 business days to your original payment method. Bank transfer refunds may take an additional 2–3 days.",
      },
    ],
  },
  {
    category: "For Artisans",
    icon: "🧑‍🎨",
    items: [
      {
        q: "How do I sell on Handmade Egypt?",
        a: "Apply through our 'Sell on Marketplace' page. We review every application to ensure quality and authenticity. Once approved, you can list your products within 24 hours.",
      },
      {
        q: "What commission does Handmade Egypt take?",
        a: "We charge a 12% commission on each sale — one of the lowest in the market. There are no listing fees or monthly charges. You only pay when you sell.",
      },
      {
        q: "How and when do I get paid?",
        a: "Earnings are transferred to your registered bank account every 15 days. You can track all payouts and upcoming transfers in your Artisan Dashboard.",
      },
    ],
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="faq-chevron">{isOpen ? "−" : "+"}</span>
      </button>
      <div className="faq-answer-wrap" style={{ maxHeight: isOpen ? "400px" : "0" }}>
        <p className="faq-answer">{item.a}</p>
      </div>
    </div>
  );
}

// ─── FAQ Page ──────────────────────────────────────────────────────────────────
export default function FAQ() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const filtered =
    activeCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((c) => c.category === activeCategory);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="faq-hero">
          <div className="container">
            <span className="section-label">Help Center</span>
            <h1 className="display-xl faq-hero-title">Frequently Asked Questions</h1>
            <p className="lead faq-hero-desc">
              Can't find what you're looking for? Reach out to our team at{" "}
              <a href="mailto:hello@handmadeegypt.com" className="faq-hero-link">
                hello@handmadeegypt.com
              </a>
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="section">
          <div className="container faq-layout">

            {/* Sidebar */}
            <aside className="faq-sidebar">
              <p className="faq-sidebar-label">Categories</p>
              <button
                className={`faq-cat-btn ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                🔍 All Questions
              </button>
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.category}
                  className={`faq-cat-btn ${activeCategory === cat.category ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.category)}
                >
                  {cat.icon} {cat.category}
                </button>
              ))}
            </aside>

            {/* Accordion */}
            <div className="faq-content">
              {filtered.map((cat) => (
                <div key={cat.category} className="faq-group">
                  <div className="faq-group-heading">
                    <span className="faq-group-icon">{cat.icon}</span>
                    <h2 className="faq-group-title">{cat.category}</h2>
                  </div>
                  <div className="faq-group-items">
                    {cat.items.map((item, i) => {
                      const key = `${cat.category}-${i}`;
                      return (
                        <AccordionItem
                          key={key}
                          item={item}
                          isOpen={!!openMap[key]}
                          onToggle={() => toggle(key)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Still need help */}
              <div className="faq-still-help card">
                <div>
                  <h3 className="faq-still-title">Still need help?</h3>
                  <p className="faq-still-desc">Our support team is always happy to help.</p>
                </div>
                <a href="/contact" className="btn btn-primary">Contact Us →</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
