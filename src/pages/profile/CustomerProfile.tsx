// src/pages/profile/CustomerProfile.tsx
import { useState } from "react";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { FormField } from "../../components/profile/FormFields";
import { StatCard } from "../../components/profile/StatCard";
import { SaveButton } from "../../components/profile/SaveButton";
import { Toast } from "../../components/profile/Toast";
import type { CustomerUser } from "../../types/profile";
import "./Profile.css";

const CUSTOMER_TABS = [
  { key: "profile", label: "My Profile" },
  { key: "orders", label: "My Orders" },
  { key: "wishlist", label: "Wishlist" },
  { key: "addresses", label: "Addresses" },
  { key: "notifications", label: "Notifications" },
  { key: "settings", label: "Settings" },
];

interface Props {
  user: CustomerUser;
  onUpdate: (payload: Record<string, unknown>) => Promise<CustomerUser>;
  onUpload: (file: File) => Promise<string>;
  onLogout: () => void;
}

export function CustomerProfile({ user, onUpdate, onUpload, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth?.slice(0, 10) || "",
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
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(form);
      setToast({ msg: "Profile updated successfully", type: "success" });
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

      {/* Progress banner */}
      <div className="profile-progress-banner">
        <div className="progress-text">
          <span>Complete your profile to get personalised recommendations</span>
          <strong> — 75% done</strong>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: "75%" }} />
        </div>
        <button className="btn-complete-now">Complete Now</button>
      </div>

      <ProfileHeader
        user={user}
        onUpload={onUpload}
        onLogout={onLogout}
        tabs={CUSTOMER_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={
          <>
            <span className="profile-badge">10,000+ Customer</span>
            <span className="profile-badge">5 Orders</span>
            <span className="profile-badge badge-loyalty">Loyalty: Silver</span>
          </>
        }
        actions={
          <>
            <button className="btn-hero">Edit Profile</button>
            <button className="btn-hero-outline">View Public Page</button>
          </>
        }
        // stats={
        //   <div className="hero-stats-mini">
        //     <div>
        //       <span className="hero-stat-val">This Month</span>
        //     </div>
        //   </div>
        // }
      />

      {activeTab === "profile" && (
        <>
          {/* Stat row */}
          <div className="stats-row">
            <StatCard label="Total Orders" value="12" sub="3 in last 30 days" />
            <StatCard
              label="Total Spent"
              value="4,850 EGP"
              sub="↑ 12% this month"
            />
            <StatCard label="Wishlist Items" value="7" sub="2 back in stock" />
            <StatCard label="Loyalty Points" value="485" sub="Silver tier" />
          </div>

          <div className="profile-content-grid">
            {/* Left: personal info form */}
            <div className="profile-card">
              <h3 className="card-title">Personal Information</h3>
              <div className="form-row">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  half
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  half
                />
              </div>
              <FormField
                label="Email Address"
                name="email"
                value={user.email}
                onChange={() => {}}
                readOnly
              />
              <FormField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="+20 100 123 4567"
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                type="date"
              />
              <SaveButton loading={saving} onClick={handleSave} />
            </div>

            {/* Right: recent orders */}
            <div className="profile-card">
              <div className="card-header-row">
                <h3 className="card-title">Recent Orders</h3>
                <a href="#" className="card-link">
                  View All →
                </a>
              </div>
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ORD-82410</td>
                    <td>Fayoum Ceramic Plate</td>
                    <td>1,105 EGP</td>
                    <td>
                      <span className="status-badge shipped">Shipped</span>
                    </td>
                  </tr>
                  <tr>
                    <td>ORD-71902</td>
                    <td>Ceramic Vase</td>
                    <td>320 EGP</td>
                    <td>
                      <span className="status-badge delivered">Delivered</span>
                    </td>
                  </tr>
                  <tr>
                    <td>ORD-68540</td>
                    <td>Silver Ring</td>
                    <td>500 EGP</td>
                    <td>
                      <span className="status-badge delivered">Delivered</span>
                    </td>
                  </tr>
                  <tr>
                    <td>ORD-55301</td>
                    <td>Leather Bag</td>
                    <td>1,250 EGP</td>
                    <td>
                      <span className="status-badge cancelled">Cancelled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Wishlist */}
          <div className="profile-card mt-4">
            <div className="card-header-row">
              <h3 className="card-title">Wishlist</h3>
              <a href="#" className="card-link">
                View All 7 →
              </a>
            </div>
            <div className="wishlist-grid">
              {[
                "Nubian Handwoven Rug",
                "Olive Wood Bowl Set",
                "Traditional Clay Jug",
                "Silver Filigree Earrings",
              ].map((name, i) => (
                <div key={i} className="wishlist-item">
                  <div className="wishlist-img-placeholder">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      opacity="0.3"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <p className="wishlist-name">{name}</p>
                  <p className="wishlist-price">
                    {["850 EGP", "420 EGP", "190 EGP", "650 EGP"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
