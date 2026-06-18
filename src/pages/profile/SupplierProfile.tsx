// src/pages/profile/SupplierProfile.tsx
import { useState } from "react";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { FormField } from "../../components/profile/FormFields";
import { StatCard } from "../../components/profile/StatCard";
import { SaveButton } from "../../components/profile/SaveButton";
import { Toast } from "../../components/profile/Toast";
import type { SupplierUser } from "../../types/profile";

const SUPPLIER_TABS = [
  { key: "profile", label: "Supplier Profile" },
  { key: "materials", label: "My Materials" },
  { key: "orders", label: "B2B Orders" },
    { key: "earnings", label: "Earnings" },
    { key: "dashboard", label: "Dashboard" },
    { key: "settings", label: "Settings" },
  
];

const MATERIAL_CATEGORIES = [
  "Textiles & Fabrics",
  "Natural Dyes",
  "Threads & Yarn",
  "Ceramics Supplies",
  "Woodwork Supplies",
  "Metal & Wire",
  "Leather & Hides",
  "Beads & Stones",
];

const GOVERNORATES = [
  "Cairo",
  "Luxor",
  "Aswan",
  "Fayoum",
  "Alexandria",
  "Giza",
  "Minya",
  "Sohag",
  "Qena",
  "Beni Suef",
];

interface Props {
  user: SupplierUser;
  onUpdate: (payload: Record<string, unknown>) => Promise<SupplierUser>;
  onUpload: (file: File) => Promise<string>;
  onLogout: () => void;
}

export function SupplierProfile({ user, onUpdate, onUpload, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    shopName: user.shopName || "",
    bio: user.bio || "",
    craftCategory: user.craftCategory || "",
    city: user.city || "",
    phone: user.phone || "",
    instagramHandle: user.instagramHandle || "",
    taxRegNo: "",
    minOrderValue: "",
  });
  const [payout, setPayout] = useState({
    bankAccount: "01xxxxxxxx",
    schedule: "weekly",
  });
  const [saving, setSaving] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
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
      await onUpdate({
        phone: form.phone,
        shopName: form.shopName,
        bio: form.bio,
        craftCategory: form.craftCategory,
        city: form.city,
        instagramHandle: form.instagramHandle,
      });
      setToast({ msg: "Profile saved successfully", type: "success" });
    } catch (err: unknown) {
      setToast({
        msg: err instanceof Error ? err.message : "Update failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePayoutSave = async () => {
    setSavingPayout(true);
    setTimeout(() => {
      setSavingPayout(false);
      setToast({ msg: "Payout settings updated", type: "success" });
    }, 800);
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
        tabs={SUPPLIER_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={
          <>
            <span className="profile-badge">
              {user.craftCategory || "Textiles & Fabrics"}
            </span>
            <span className="profile-badge">B2B Wholesale</span>
            <span className="profile-badge">12 Materials Listed</span>
            <span className="profile-badge">4.8 ★ Rating</span>
          </>
        }
        actions={
          <>
            <button className="btn-hero">Edit Profile</button>
            <button className="btn-hero-outline">Add New Material</button>
            <button className="btn-hero-outline">View Storefront</button>
          </>
        }
      />

      {activeTab === "profile" && (
        <>
          <div className="stats-row">
            <StatCard
              label="Total B2B Revenue"
              value="18,400 EGP"
              sub="↑ 22% this quarter"
            />
            <StatCard label="Materials Listed" value="12" sub="3 low stock" />
            <StatCard label="Active Artists" value="34" sub="Repeat buyers" />
            <StatCard label="Avg. Rating" value="4.8 ★" sub="18 reviews" />
          </div>

          <div className="profile-content-grid">
            {/* Business info */}
            <div className="profile-card">
              <h3 className="card-title">Business Information</h3>
              <FormField
                label="Company Name"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="Your company name"
              />
              <div className="form-row">
                <FormField
                  label="Tax Registration No."
                  name="taxRegNo"
                  value={form.taxRegNo}
                  onChange={handleChange}
                  placeholder="EG-2024134"
                  half
                />
                <FormField
                  label="Governorate"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  select
                  options={GOVERNORATES.map((g) => ({ value: g, label: g }))}
                  half
                />
              </div>
              <FormField
                label="Primary Material Category"
                name="craftCategory"
                value={form.craftCategory}
                onChange={handleChange}
                select
                options={MATERIAL_CATEGORIES.map((c) => ({
                  value: c,
                  label: c,
                }))}
              />
              <FormField
                label="Minimum Order Value (EGP)"
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={handleChange}
                type="number"
                placeholder="500"
              />
              <FormField
                label="Company Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                textarea
                placeholder="Describe your business and materials..."
              />
              <SaveButton
                loading={saving}
                label="Save Changes"
                onClick={handleSave}
              />
            </div>

            {/* Right panel */}
            <div>
              {/* Material categories */}
              <div className="profile-card">
                <h3 className="card-title">Material Categories</h3>
                <div className="material-cats-grid">
                  {[
                    { icon: "🧵", name: "Linen & Cotton", count: 5 },
                    { icon: "🎨", name: "Natural Dyes", count: 3 },
                    { icon: "🪢", name: "Threads & Yarn", count: 4 },
                  ].map((cat) => (
                    <div key={cat.name} className="material-cat-card">
                      <span className="mat-icon">{cat.icon}</span>
                      <p className="mat-name">{cat.name}</p>
                      <p className="mat-count">{cat.count} items</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent B2B Orders */}
              <div className="profile-card mt-4">
                <div className="card-header-row">
                  <h3 className="card-title">Recent B2B Orders</h3>
                  <a href="#" className="card-link">
                    View All →
                  </a>
                </div>
                <table className="profile-table">
                  <thead>
                    <tr>
                      <th>Artist</th>
                      <th>Material</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nile Ceramics</td>
                      <td>Pure Linen 5m</td>
                      <td>650 EGP</td>
                      <td>
                        <span className="status-badge shipped">Shipped</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Cairo Threads</td>
                      <td>Indigo Dye 1kg</td>
                      <td>320 EGP</td>
                      <td>
                        <span className="status-badge processing">
                          Processing
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Sinai Weavers</td>
                      <td>Cotton Bulk 10m</td>
                      <td>980 EGP</td>
                      <td>
                        <span className="status-badge delivered">
                          Delivered
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Asmian Studio</td>
                      <td>Wool Yarn 3kg</td>
                      <td>490 EGP</td>
                      <td>
                        <span className="status-badge pending">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payout */}
              <div className="profile-card mt-4">
                <h3 className="card-title">Payout Information</h3>
                <FormField
                  label="Bank Account (Instapay)"
                  name="bankAccount"
                  value={payout.bankAccount}
                  onChange={(e) =>
                    setPayout((p) => ({ ...p, bankAccount: e.target.value }))
                  }
                />
                <FormField
                  label="Preferred Payout Schedule"
                  name="schedule"
                  value={payout.schedule}
                  onChange={(e) =>
                    setPayout((p) => ({ ...p, schedule: e.target.value }))
                  }
                  select
                  options={[
                    { value: "weekly", label: "Weekly (Every Monday)" },
                    { value: "biweekly", label: "Bi-weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                />
                <SaveButton
                  loading={savingPayout}
                  label="Update Payout"
                  onClick={handlePayoutSave}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
