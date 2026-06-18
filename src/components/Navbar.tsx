import { useState, useEffect, useRef } from "react";
import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";
import { useFavourites } from "../Context/FavouritesContext";
import { useCart } from "../Context/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Materials", href: "/materials" },
  { label: "About", href: "/about" },
  { label: "Gift Quiz", href: "/gift-quiz" },
  { label: "Faq", href: "/faq" },
  { label: "Suppliers", href: "/suppliers" }, // ─── ADDED from v2
];

// ─── Logo Icon ─────────────────────────────────────────────────────────────────
const FlameIcon = () => (
  <svg
    width="20"
    height="20"
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

// ─── Favourites Icon ──────────────────────────────────────────────────────────
const FavouritesIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3D2E1E"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Cart Icon ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3D2E1E"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

// ─── User Icon ─────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3D2E1E"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── ADDED: Logout Icon (commented-out, kept from v2) ─────────────────────────
// const LogoutIcon = () => (
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#C4622D"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
//     <polyline points="16 17 21 12 16 7" />
//     <line x1="21" y1="12" x2="9" y2="12" />
//   </svg>
// );

// ─── Hamburger Icon ────────────────────────────────────────────────────────────
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3D2E1E"
    strokeWidth="2"
    strokeLinecap="round"
  >
    {open ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    )}
  </svg>
);

// ─── Navbar Component ──────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  // ─── ADDED: User Dropdown Menu State ──────────────────────────────────────
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ─── ADDED: Dropdown Ref For Outside Click ─────────────────────────────────
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ─── ADDED: Authentication Logic ──────────────────────────────────────────
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  // ─── Favourites Count From Context ────────────────────────────────────────
  const { favouritesCount } = useFavourites();

  // ─── ADDED: Logout Function ────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ─── ADDED: Close Dropdown On Outside Click ────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=DM+Sans:wght@300;400;500&display=swap');

        .hme-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FDFAF5;
          border-bottom: 1px solid #E8DFD0;
          font-family: 'DM Sans', sans-serif;
        }

        .hme-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* Logo */
        .hme-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .hme-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 500;
          color: #C4622D;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        /* Nav links */
        .hme-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
          list-style: none;
          padding: 0;
          margin-top: 0;
          margin-bottom: 0;
        }

        .hme-nav-links a {
          display: block;
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 400;
          color: #5A4535;
          text-decoration: none;
          border-radius: 6px;
          letter-spacing: 0.02em;
          transition: background 0.15s, color 0.15s;
        }

        .hme-nav-links a:hover {
          background: #F0E6D8;
          color: #C4622D;
        }

        /* Icons */
        .hme-nav-icons {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .hme-icon-btn {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          color: inherit;
        }

        .hme-icon-btn:hover {
          background: #F0E6D8;
        }

        .hme-cart-badge,
        .hme-fav-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #C4622D;
          color: white;
          font-size: 10px;
          font-weight: 600;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─── Favourites badge distinct color ────────────────────────────── */
        .hme-fav-badge {
          background: #dc3545;
        }

        .hme-desktop-search {
          flex: 1;
        }

        /* ─── ADDED: Username Style ───────────────────────────────────────── */
        .hme-user-name {
          font-size: 13px;
          color: #5A4535;
          font-family: 'DM Sans', sans-serif;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Hamburger */
        .hme-hamburger {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          margin-left: auto;
          border-radius: 6px;
          transition: background 0.15s;
        }

        .hme-hamburger:hover {
          background: #F0E6D8;
        }

        /* Mobile menu */
        .hme-mobile-menu {
          display: none;
          flex-direction: column;
          background: #FDFAF5;
          border-top: 1px solid #E8DFD0;
          padding: 12px 24px 20px;
        }

        .hme-mobile-menu.open {
          display: flex;
        }

        .hme-mobile-menu a {
          padding: 12px 0;
          font-size: 15px;
          color: #5A4535;
          text-decoration: none;
          border-bottom: 1px solid #F0E6D8;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }

        .hme-mobile-menu a:last-of-type {
          border-bottom: none;
        }

        .hme-mobile-menu a:hover {
          color: #C4622D;
        }

        .hme-mobile-search {
          margin-bottom: 8px;
        }

        /* ─── Favourites link in mobile menu ─────────────────────────────── */
        .hme-mobile-fav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-fav-badge {
          background: #dc3545;
          color: white;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 20px;
        }

        /* ─── ADDED: Mobile Logout Button Style ───────────────────────────── */
        .hme-mobile-logout {
          padding: 12px 0;
          font-size: 15px;
          color: #C4622D;
          background: transparent;
          border: none;
          border-top: 1px solid #F0E6D8;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-align: left;
        }

        /* ─── ADDED: User Dropdown Menu ───────────────────────────────────── */
        .hme-user-menu {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hme-avatar-btn {
          width: 38px;
          height: 38px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .hme-avatar-btn:hover {
          background: #F0E6D8;
        }

        .hme-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #E8DFD0;
        }

        .hme-dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          min-width: 190px;
          background: white;
          border: 1px solid #E8DFD0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,.08);
          z-index: 9999;
        }

        .hme-dropdown-item {
          display: block;
          width: 100%;
          padding: 12px 16px;
          text-decoration: none;
          background: white;
          border: none;
          color: #5A4535;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          transition: background 0.15s, color 0.15s;
        }

        .hme-dropdown-item:hover {
          background: #F5EFE6;
          color: #C4622D;
        }

        /* ─── Responsive ──────────────────────────────────────────────────── */
        @media (max-width: 768px) {

          .hme-nav-inner {
            height: 60px;
            padding: 0 14px;
            gap: 10px;
          }

          .hme-nav-links      { display: none; }
          .hme-desktop-search { display: none; }

          .hme-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .hme-logo {
            margin-right: auto;
            min-width: 0;
          }

          .hme-logo-text {
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .hme-nav-icons { gap: 2px; }

          .hme-icon-btn {
            width: 34px;
            height: 34px;
          }

          /* ─── ADDED: Hide Username On Mobile ──────────────────────────── */
          .hme-user-name { display: none; }

          .hme-mobile-menu {
            display: flex;
            flex-direction: column;
            gap: 2px;
            max-height: 0;
            overflow: hidden;
            padding: 0 18px;
            transition: max-height 0.3s ease, padding 0.3s ease;
            border-top: none;
          }

          .hme-mobile-menu.open {
            max-height: 500px;
            padding: 14px 18px 20px;
            border-top: 1px solid #E8DFD0;
          }

          .hme-mobile-menu a {
            padding: 12px 4px;
            border-radius: 8px;
            border-bottom: none;
          }

          .hme-mobile-menu a:hover {
            background: #F5EFE6;
          }

          .hme-mobile-search { margin-bottom: 10px; }
        }

        /* Extra small phones */
        @media (max-width: 480px) {

          .hme-nav-inner { padding: 0 10px; }

          .hme-logo-text { font-size: 14px; }

          .hme-icon-btn {
            width: 32px;
            height: 32px;
          }

          .hme-cart-badge,
          .hme-fav-badge {
            width: 14px;
            height: 14px;
            font-size: 9px;
          }
        }
      `}</style>

      <nav className="hme-nav">
        <div className="hme-nav-inner">

          {/* Logo */}
          <Link to="/" className="hme-logo">
            <FlameIcon />
            <span className="hme-logo-text">Handmade Egypt</span>
          </Link>

          {/* Search — hidden on mobile */}
          <div className="hme-desktop-search">
            <SearchBar isMenuOpen={menuOpen} />
          </div>

          {/* Nav links — hidden on mobile */}
          <ul className="hme-nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="hme-nav-icons">

            {/* Favourites */}
            <Link to="/favourites" className="hme-icon-btn" aria-label="Favourites">
              <FavouritesIcon />
              {favouritesCount > 0 && (
                <span className="hme-fav-badge">{favouritesCount}</span>
              )}
            </Link>

            <Link to="/cart" className="hme-icon-btn" aria-label="Shopping Cart" title="Shopping Cart">
              <CartIcon />
              {cartCount > 0 && (
                <span className="hme-cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* ─── ADDED: Conditional Auth Rendering ───────────────────────── */}
            {isLoggedIn ? (
              <div className="hme-user-menu" ref={userMenuRef}>
                {/* Username (hidden on mobile) */}
                <span className="hme-user-name">
                  {user?.name?.split(" ")[0]}
                </span>

                {/* Avatar / User Icon Button */}
                <button
                  className="hme-avatar-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User Menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="hme-avatar"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="hme-dropdown">
                    <Link
                      to="/profile"
                      className="hme-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button className="hme-dropdown-item" onClick={logout}>
                      Logout
                    </button>
                    
                  </div>
                )}
              </div>
            ) : (
              /* Login Link */
              <Link to="/login" className="hme-icon-btn" aria-label="Account">
                <UserIcon />
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="hme-hamburger"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`hme-mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="hme-mobile-search">
            <SearchBar isMenuOpen={menuOpen} />
          </div>

          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.href}>
              {item.label}
            </Link>
          ))}

          <Link to="/cart" className="hme-mobile-fav-link">
            <span>🛒 Shopping Cart</span>
            {cartCount > 0 && (
              <span className="mobile-fav-badge">{cartCount}</span>
            )}
          </Link>

          {/* Favourites link with badge */}
          <Link to="/favourites" className="hme-mobile-fav-link">
            <span>❤️ Favourites</span>
            {favouritesCount > 0 && (
              <span className="mobile-fav-badge">{favouritesCount}</span>
            )}
          </Link>

          {/* ─── ADDED: Mobile Auth Section ───────────────────────────────── */}
          {isLoggedIn ? (
            <>
              {/* Profile Link */}
              <Link to="/profile">My Profile</Link>

              {/* Logout Button */}
              <button className="hme-mobile-logout" onClick={logout}>
                Logout ({user?.name?.split(" ")[0]})
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
    </>
  );
}
