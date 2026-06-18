// src/components/profile/ProfileHeader.tsx
import { ProfileAvatar } from "./ProfileAvatar";
import type { AnyUser } from "../../types/profile";

interface Props {
  user: AnyUser;
  onUpload: (file: File) => Promise<string>;
  onLogout: () => void;
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  badges?: React.ReactNode;
  stats?: React.ReactNode;
  actions?: React.ReactNode;
}

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  artist: "Artist",
  supplier: "Supplier",
  admin: "ADMIN",
};

export function ProfileHeader({
  user,
  onUpload,
  onLogout,
  tabs,
  activeTab,
  onTabChange,
  badges,
  stats,
  actions,
}: Props) {
  const displayName =
    "shopName" in user && user.shopName
      ? user.shopName
      : "firstName" in user && user.firstName
        ? `${user.firstName} ${"lastName" in user ? user.lastName : ""}`.trim()
        : user.name;

  const subtitle = [
    user.email,
    "city" in user && user.city ? user.city : null,
    user.role === "customer"
      ? "Member since " +
        new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : null,
    user.role === "artist"
      ? "Joined " +
        new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : null,
    user.role === "supplier"
      ? "Supplier since " +
        new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="profile-header-section">
      {/* Tabs */}
      <div className="profile-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`profile-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <div className="profile-hero-card">
        {/* Decorative blob — behind everything */}
        <div className="profile-hero-blob" />

        {/* Logout — absolute top-right, card has no overflow:hidden so it's always visible */}
        <button
          className="profile-logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>

        {/* Main content row */}
        <div className="profile-hero-top-row">
          <div className="profile-hero-left">
            <ProfileAvatar user={user} onUpload={onUpload} />
            <div className="profile-hero-info">
              <div className="profile-hero-name-row">
                <h2 className="profile-hero-name">{displayName}</h2>
                {user.isVerified && (
                  <span className="verified-badge">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {user.role === "admin"
                      ? "ADMIN"
                      : user.role === "supplier"
                        ? "Verified Supplier"
                        : "Verified " + ROLE_LABELS[user.role]}
                  </span>
                )}
              </div>
              <p className="profile-hero-subtitle">{subtitle}</p>
              {badges && <div className="profile-hero-badges">{badges}</div>}
              {actions && <div className="profile-hero-actions">{actions}</div>}
            </div>
          </div>
          {/* Right card (earnings etc) — only rendered when passed */}
          {stats && <div className="profile-hero-right">{stats}</div>}
          
        </div>
      </div>
    </div>
  );
}
