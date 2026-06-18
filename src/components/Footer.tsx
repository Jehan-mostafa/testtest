// ─── Types ────────────────────────────────────────────────────────────────────
interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Faq", href: "/faq" },
      { label: "Contacts", href: "/contacts" },
    ],
  },
  {
    heading: "For Artisans",
    links: [
      { label: "Sell on Marketplace", href: "/sell" },
      { label: "Source Materials", href: "/source-materials" },
      { label: "Vendor Handbook", href: "/vendor-handbook" },
      { label: "Artisan Community", href: "/community" },
    ],
  },
];

// ─── Social Icons ──────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const FlameIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C12 2 7 7.5 7 13a5 5 0 0010 0c0-3-2-5.5-2-5.5s-.5 2-2 3c0 0 1-4-1-8.5z"
      fill="#C4622D"
    />
    <path d="M12 14a2 2 0 100 4 2 2 0 000-4z" fill="#E8A87C" opacity="0.8" />
  </svg>
);

// ─── Footer Component ──────────────────────────────────────────────────────────
export default function Footer() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle newsletter subscription
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=DM+Sans:wght@300;400;500&display=swap');

        .hme-footer {
          background: #2A1F14;
          color: #C9B9A8;
          font-family: 'DM Sans', sans-serif;
          padding: 56px 24px 28px;
        }

        .hme-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Top grid */
        .hme-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
          gap: 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        /* Brand column */
        .hme-footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          text-decoration: none;
        }
        .hme-footer-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: #F5EFE6;
          letter-spacing: 0.01em;
        }
        .hme-footer-tagline {
          font-size: 13px;
          line-height: 1.7;
          color: #8C7D6E;
          max-width: 220px;
          margin-bottom: 20px;
        }
        .hme-footer-socials {
          display: flex;
          gap: 10px;
        }
        .hme-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #C9B9A8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .hme-social-btn:hover {
          background: rgba(196,98,45,0.18);
          color: #E8A87C;
          border-color: rgba(196,98,45,0.4);
        }

        /* Link columns */
        .hme-footer-col-heading {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #F5EFE6;
          margin-bottom: 16px;
        }
        .hme-footer-col-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hme-footer-col-links a {
          font-size: 13.5px;
          color: #8C7D6E;
          text-decoration: none;
          transition: color 0.15s;
        }
        .hme-footer-col-links a:hover {
          color: #E8A87C;
        }

        /* Newsletter */
        .hme-newsletter-text {
          font-size: 13px;
          color: #8C7D6E;
          margin-bottom: 14px;
          line-height: 1.6;
        }
        .hme-newsletter-form {
          display: flex;
          gap: 8px;
        }
        .hme-newsletter-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #F5EFE6;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hme-newsletter-input::placeholder {
          color: #5A4E42;
          font-style: italic;
        }
        .hme-newsletter-input:focus {
          border-color: rgba(196,98,45,0.5);
          box-shadow: 0 0 0 3px rgba(196,98,45,0.1);
        }
        .hme-newsletter-btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: #C4622D;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, transform 0.1s;
        }
        .hme-newsletter-btn:hover {
          background: #B0561F;
        }
        .hme-newsletter-btn:active {
          transform: scale(0.97);
        }

        /* Bottom bar */
        .hme-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hme-footer-copy {
          font-size: 12.5px;
          color: #5A4E42;
        }
        .hme-footer-legal {
          display: flex;
          gap: 20px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .hme-footer-legal a {
          font-size: 12.5px;
          color: #5A4E42;
          text-decoration: none;
          transition: color 0.15s;
        }
        .hme-footer-legal a:hover {
          color: #C9B9A8;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hme-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 540px) {
          .hme-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .hme-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
          .hme-newsletter-form {
            flex-direction: column;
          }
          .hme-newsletter-btn {
            width: 100%;
          }
        }
      `}</style>

      <footer className="hme-footer">
        <div className="hme-footer-inner">
          <div className="hme-footer-grid">
            {/* Brand */}
            <div>
              <a href="/" className="hme-footer-brand-logo">
                <FlameIcon />
                <span className="hme-footer-brand-name">Handmade Egypt</span>
              </a>
              <p className="hme-footer-tagline">
                Connecting Egypt's finest artisans with a global audience.
                Empowering local craftsmanship since 2024.
              </p>
              <div className="hme-footer-socials">
                <a
                  href="https://instagram.com"
                  className="hme-social-btn"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://facebook.com"
                  className="hme-social-btn"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="hme-footer-col-heading">{col.heading}</h4>
                <ul className="hme-footer-col-links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <h4 className="hme-footer-col-heading">Newsletter</h4>
              <p className="hme-newsletter-text">
                Get early access to new collections.
              </p>
              <form className="hme-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="hme-newsletter-input"
                  placeholder="Email address"
                  required
                />
                <button type="submit" className="hme-newsletter-btn">
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="hme-footer-bottom">
            <p className="hme-footer-copy">
              © {new Date().getFullYear()} Handmade Egypt. All rights reserved.
            </p>
            <ul className="hme-footer-legal">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}