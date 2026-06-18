// src/pages/profile/ArtistProfile.tsx
import { useState } from "react";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { FormField } from "../../components/profile/FormFields";
import { StatCard } from "../../components/profile/StatCard";
import { SaveButton } from "../../components/profile/SaveButton";
import { Toast } from "../../components/profile/Toast";
import type { ArtistUser } from "../../types/profile";

const ARTIST_TABS = [
  { key: "profile", label: "Shop Profile" },
  { key: "products", label: "My Products" },
  { key: "earnings", label: "Earnings" },
    { key: "reviews", label: "Reviews" },
    { key: "dashboard", label: "Dashboard" },
  { key: "settings", label: "Settings" },
];

const CRAFT_CATEGORIES = [
  "Ceramics & Pottery",
  "Textiles & Fabrics",
  "Jewelry & Accessories",
  "Woodwork",
  "Leatherwork",
  "Glass Art",
  "Natural Dyes",
  "Basket Weaving",
];

interface Props {
  user: ArtistUser;
  onUpdate: (payload: Record<string, unknown>) => Promise<ArtistUser>;
  onUpload: (file: File) => Promise<string>;
  onLogout: () => void;
}

export function ArtistProfile({ user, onUpdate, onUpload, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    shopName: user.shopName || "",
    bio: user.bio || "",
    craftCategory: user.craftCategory || "",
    city: user.city || "",
    phone: user.phone || "",
    instagramHandle: user.instagramHandle || "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(form);
      setToast({ msg: "Shop updated successfully", type: "success" });
    } catch (err: unknown) {
      setToast({
        msg: err instanceof Error ? err.message : "Update failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ProfileHeader
        user={user}
        onUpload={onUpload}
        onLogout={onLogout}
        tabs={ARTIST_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={
          <>
            <span className="profile-badge">
              {user.craftCategory || "Handcraft"}
            </span>
            <span className="profile-badge">0 Products Listed</span>
            <span className="profile-badge">4.7 ★ Rating</span>
            <span className="profile-badge badge-highlight">500+ Sales</span>
          </>
        }
        actions={
          <>
            <button className="btn-hero">Edit Shop</button>
            <button className="btn-hero-outline">Preview Public Shop</button>
            <button className="btn-hero-outline">Share Profile</button>
          </>
        }
        stats={
          <div className="hero-earnings-card">
            <p className="hero-earnings-label">This Month</p>
            <p className="hero-earnings-val">3,270 EGP</p>
            <p className="hero-earnings-sub">↑ 13% vs last month</p>
          </div>
        }
      />

      {activeTab === "profile" && (
        <>
          <div className="stats-row">
            <StatCard
              label="Total Sales"
              value="3,270 EGP"
              sub="↑ 13% this month"
            />
            <StatCard label="Total Orders" value="5" sub="3 pending" />
            <StatCard label="Avg. Rating" value="4.7 ★" sub="3 reviews" />
            <StatCard label="Products" value="6" sub="3 low stock" />
          </div>

          <div className="profile-content-grid">
            {/* Shop info form */}
            <div className="profile-card">
              <h3 className="card-title">Shop Information</h3>
              <FormField
                label="Shop / Studio Name"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="Your studio name"
              />
              <FormField
                label="Craft Category"
                name="craftCategory"
                value={form.craftCategory}
                onChange={handleChange}
                select
                options={CRAFT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
              <FormField
                label="Shop Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                textarea
                placeholder="Tell the story of your craft..."
              />
              <div className="form-row">
                <FormField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Fayoum"
                  half
                />
                <FormField
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+20 10 345 6789"
                  half
                />
              </div>
              <FormField
                label="Instagram Handle"
                name="instagramHandle"
                value={form.instagramHandle}
                onChange={handleChange}
                placeholder="@yourshop"
              />
              <SaveButton
                loading={saving}
                label="Update Shop"
                onClick={handleSave}
              />
            </div>

            {/* Recent products */}
            <div>
              <div className="profile-card">
                <div className="card-header-row">
                  <h3 className="card-title">Recent Products</h3>
                  <a href="#" className="card-link">
                    Manage All →
                  </a>
                </div>
                {[
                  {
                    name: "Fayoum Ceramic Plate",
                    status: "In Stock 12",
                    price: "280 EGP",
                    tag: "in-stock",
                  },
                  {
                    name: "Traditional Clay Jug",
                    status: "Last 3 left",
                    price: "190 EGP",
                    tag: "low",
                  },
                  {
                    name: "Ceramic Dipping Bowl Set",
                    status: "In Stock 20",
                    price: "85 EGP",
                    tag: "in-stock",
                  },
                ].map((p, i) => (
                  <div key={i} className="product-row">
                    <div className="product-thumb" />
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-cat">Ceramics</p>
                    </div>
                    <span
                      className={`status-badge ${p.tag === "low" ? "low-stock" : "in-stock-badge"}`}
                    >
                      {p.status}
                    </span>
                    <span className="product-price">{p.price}</span>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div className="profile-card mt-4">
                <div className="card-header-row">
                  <h3 className="card-title">Latest Reviews</h3>
                  <span className="rating-summary">
                    4.7 ★ <span className="muted">3 reviews</span>
                  </span>
                </div>
                {[
                  {
                    product: "Fayoum Ceramic Plate",
                    reviewer: "Mona Ahmed",
                    date: "Apr 9, 2026",
                    stars: 5,
                    text: "Absolutely beautiful craftsmanship! The ring is stunning.",
                    reply:
                      "Thank you so much Mona! It was a pleasure crafting this for you 🙏",
                  },
                  {
                    product: "Ceramic Vase",
                    reviewer: "Sara khalil",
                    date: "Apr 9, 2026",
                    stars: 4,
                    text: "Great quality leather, arrived well-packaged.",
                  },
                ].map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div>
                        <p className="review-product">{r.product}</p>
                        <p className="review-meta">
                          {r.reviewer} · {r.date}
                        </p>
                      </div>
                      <div className="review-stars">
                        {"★".repeat(r.stars)}
                        {"☆".repeat(5 - r.stars)}
                      </div>
                    </div>
                    <p className="review-text">{r.text}</p>
                    {r.reply && (
                      <div className="review-reply">
                        <strong>Your reply:</strong> {r.reply}
                      </div>
                    )}
                    {!r.reply && <button className="btn-reply">Reply</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="profile-card mt-4">
            <div className="card-header-row">
              <h3 className="card-title">Earnings Overview</h3>
              <select className="period-select">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="stats-row no-margin">
              <StatCard
                label="Gross Sales"
                value="3,870 EGP"
                sub="Before platform fee"
              />
              <StatCard
                label="Platform Fee (5%)"
                value="194 EGP"
                sub="Deducted automatically"
              />
              <StatCard
                label="Net Earnings"
                value="3,676 EGP"
                sub="Pending payout: Apr 15"
              />
            </div>
            <h4 className="section-subtitle">Recent Transactions</h4>
            {[
              {
                name: "Silver Ring — Mona Ahmed",
                date: "Apr 9, 2026",
                amount: "+500 EGP",
              },
              {
                name: "Ceramic Vase — Nourhan Ali",
                date: "Apr 8, 2026",
                amount: "+320 EGP",
              },
              {
                name: "Leather Bag — Karim Hassan",
                date: "Apr 7, 2026",
                amount: "+1,250 EGP",
              },
              {
                name: "Cotton Fabric — Youssef Mahmoud",
                date: "Apr 5, 2026",
                amount: "Platform Fee: -60 EGP",
                fee: true,
              },
            ].map((t, i) => (
              <div key={i} className="transaction-row">
                <div>
                  <p className="tx-name">{t.name}</p>
                  <p className="tx-date">{t.date}</p>
                </div>
                <span className={`tx-amount ${t.fee ? "tx-fee" : ""}`}>
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
