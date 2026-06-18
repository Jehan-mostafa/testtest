// src/pages/profile/AdminProfile.tsx
import { useState } from "react";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { FormField } from "../../components/profile/FormFields";
import { StatCard } from "../../components/profile/StatCard";
import { SaveButton } from "../../components/profile/SaveButton";
import { Toast } from "../../components/profile/Toast";
import { changePasswordApi } from "../../api/profile.api";
import type { AdminUser } from "../../types/profile";

const ADMIN_TABS = [
  { key: "profile", label: "Admin Profile" },
  { key: "security", label: "Security" },
  { key: "activity", label: "Activity Log" },
  { key: "notifications", label: "Notifications" },
  { key: "dashboard", label: "Dashboard" },
  { key: "platform", label: "Platform Settings" },
];

interface Props {
  user: AdminUser;
  onUpdate: (payload: Record<string, unknown>) => Promise<AdminUser>;
  onUpload: (file: File) => Promise<string>;
  onLogout: () => void;
}

export function AdminProfile({ user, onUpdate, onUpload, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    department: user.department || "",
    adminRoleLevel: user.adminRoleLevel || "Support",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [notifications, setNotifications] = useState({
    newUsers: true,
    artistApproval: true,
    contentReports: true,
    weeklyDigest: false,
  });

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

  const handlePasswordSave = async () => {
    setSavingPw(true);
    try {
      await changePasswordApi(
        pwForm.currentPassword,
        pwForm.newPassword,
        pwForm.confirmPassword,
      );
      setToast({ msg: "Password changed successfully", type: "success" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setToast({
        msg: err instanceof Error ? err.message : "Password change failed",
        type: "error",
      });
    } finally {
      setSavingPw(false);
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
        tabs={ADMIN_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={
          <>
            <span className="profile-badge badge-admin">Full Access</span>
            <span className="profile-badge">Can Manage All Roles</span>
            <span className="profile-badge">Last login: Today 09:14</span>
          </>
        }
        actions={
          <>
            <button className="btn-hero">Edit Admin Profile</button>
            <button className="btn-hero-outline">Go to Dashboard</button>
          </>
        }
      />

      {activeTab === "profile" && (
        <>
          <div className="stats-row">
            <StatCard label="Total Users" value="1,240" sub="+34 this week" />
            <StatCard
              label="Active Artists"
              value="502"
              sub="18 pending approval"
            />
            <StatCard
              label="Platform Revenue"
              value="12,300 EGP"
              sub="April 2026"
            />
            <StatCard label="Pending Reports" value="7" sub="Need review" />
          </div>

          <div className="profile-content-grid">
            {/* Admin details form */}
            <div className="profile-card">
              <h3 className="card-title">Administrator Details</h3>
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
                label="Admin Email"
                name="email"
                value={user.email}
                onChange={() => {}}
                readOnly
              />
              <FormField
                label="Admin Role Level"
                name="adminRoleLevel"
                value={form.adminRoleLevel}
                onChange={handleChange}
                select
                options={[
                  { value: "Super Admin", label: "Super Admin" },
                  { value: "Moderator", label: "Moderator" },
                  { value: "Support", label: "Support" },
                ]}
              />
              <FormField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Platform Operations"
              />

              {/* Security section inline */}
              <div className="security-section">
                <h4 className="security-title">Security</h4>
                <FormField
                  label="Current Password"
                  name="currentPassword"
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({
                      ...p,
                      currentPassword: (
                        e as React.ChangeEvent<HTMLInputElement>
                      ).target.value,
                    }))
                  }
                  type="password"
                  placeholder="Enter current password"
                />
                <div className="form-row">
                  <FormField
                    label="New Password"
                    name="newPassword"
                    value={pwForm.newPassword}
                    onChange={(e) =>
                      setPwForm((p) => ({
                        ...p,
                        newPassword: (e as React.ChangeEvent<HTMLInputElement>)
                          .target.value,
                      }))
                    }
                    type="password"
                    placeholder="Min 8 characters"
                    half
                  />
                  <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={pwForm.confirmPassword}
                    onChange={(e) =>
                      setPwForm((p) => ({
                        ...p,
                        confirmPassword: (
                          e as React.ChangeEvent<HTMLInputElement>
                        ).target.value,
                      }))
                    }
                    type="password"
                    placeholder="Repeat password"
                    half
                  />
                </div>
              </div>

              <SaveButton
                loading={saving || savingPw}
                label="Update Profile & Password"
                onClick={async () => {
                  await handleSave();
                  if (pwForm.currentPassword) await handlePasswordSave();
                }}
              />
            </div>

            {/* Right panel */}
            <div>
              {/* Activity log */}
              <div className="profile-card">
                <div className="card-header-row">
                  <h3 className="card-title">Recent Activity Log</h3>
                  <a href="#" className="card-link">
                    Full Log →
                  </a>
                </div>
                {[
                  {
                    text: "Approved artist registration: Cairo Glass Studio",
                    time: "Today, 09:55 AM",
                    active: true,
                  },
                  {
                    text: "Resolved report #R-0412: Product listing violation",
                    time: "Today, 09:17 AM",
                    active: true,
                  },
                  {
                    text: "Updated platform fee from 4% to 5% for new artists",
                    time: "Yesterday, 03:22 PM",
                    active: false,
                  },
                  {
                    text: "Suspended account: user_4821 – policy violation",
                    time: "Yesterday, 01:10 PM",
                    active: false,
                  },
                  {
                    text: "Responded to support ticket #T-1094 from Mona Ahmed",
                    time: "Jun 3, 2026",
                    active: false,
                  },
                ].map((log, i) => (
                  <div key={i} className="activity-row">
                    <div
                      className={`activity-dot ${log.active ? "dot-active" : ""}`}
                    />
                    <div>
                      <p className="activity-text">{log.text}</p>
                      <p className="activity-time">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              <div className="profile-card mt-4">
                <h3 className="card-title">
                  Platform Notification Preferences
                </h3>
                {[
                  {
                    key: "newUsers",
                    label: "New user registrations",
                    sub: "Get notified at new sign-ups",
                  },
                  {
                    key: "artistApproval",
                    label: "Artist approval requests",
                    sub: "Pending profile verifications",
                  },
                  {
                    key: "contentReports",
                    label: "Content reports",
                    sub: "User-reported listings",
                  },
                  {
                    key: "weeklyDigest",
                    label: "Weekly revenue digest",
                    sub: "Platform earnings summary",
                  },
                ].map((notif) => (
                  <div key={notif.key} className="notif-row">
                    <div>
                      <p className="notif-label">{notif.label}</p>
                      <p className="notif-sub">{notif.sub}</p>
                    </div>
                    <button
                      className={`toggle-btn ${notifications[notif.key as keyof typeof notifications] ? "on" : ""}`}
                      onClick={() =>
                        setNotifications((n) => ({
                          ...n,
                          [notif.key]:
                            !n[notif.key as keyof typeof notifications],
                        }))
                      }
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 2FA */}
              <div className="profile-card mt-4">
                <h3 className="card-title">Two-Factor Authentication</h3>
                <div className="tfa-row">
                  <div className="tfa-icon tfa-on">🔐</div>
                  <div>
                    <p className="tfa-label">2FA is Enabled</p>
                    <p className="tfa-sub">Via SMS to +20 100 *** 4567</p>
                  </div>
                  <button className="btn-tfa">Manage</button>
                </div>
                <div className="tfa-row">
                  <div className="tfa-icon">🖥️</div>
                  <div>
                    <p className="tfa-label">IP Whitelisting</p>
                    <p className="tfa-sub">3 trusted IPs configured</p>
                  </div>
                  <button className="btn-tfa">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
