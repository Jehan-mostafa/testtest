import { useState } from "react";
import "../../style/AuthPages.css";
import { registerApi } from "../../api/auth.api";
import { OtpVerification } from "./OtpVerifications";

type Role = "customer" | "artist" | "supplier";
type Step = 1 | 2 | 3 | "otp";

const ROLES: { id: Role; label: string; desc: string; icon: string }[] = [
  {
    id: "customer",
    label: "Customer",
    desc: "Shop handmade products",
    icon: "🛍",
  },
  {
    id: "artist",
    label: "Artist",
    desc: "Sell your handmade creations",
    icon: "🎨",
  },
  {
    id: "supplier",
    label: "Supplier",
    desc: "Supply raw materials",
    icon: "📦",
  },
];

export function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 fields
  const [role, setRole] = useState<Role>("customer");

  // Step 3 - artist/supplier extra fields
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");

  // ----------------------------------------------------------------
  // Step 1 Validation
  // ----------------------------------------------------------------
  const validateStep1 = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.includes("@")) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleStep1Continue = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
  };

  // ----------------------------------------------------------------
  // Step 2: Role selection
  // ----------------------------------------------------------------
  const handleStep2Continue = () => {
    setError("");
    if (role === "customer") {
      handleFinalSubmit();
    } else {
      setStep(3);
    }
  };

  // ----------------------------------------------------------------
  // Final Submit → calls registerApi → shows OTP screen
  // ----------------------------------------------------------------
  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await registerApi({
        fullName,
        email,
        password,
        role,
        phone: phone || undefined,
        shopName: shopName || undefined,
        bio: bio || undefined,
      });
      // الباك بعت OTP على الإيميل → روح لشاشة OTP
      setStep("otp");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // OTP Success → اليوزر اتعمل وجاب token
  // ----------------------------------------------------------------
  const handleOtpSuccess = () => {
    // token اتحفظ جوا OtpVerification
    // هنا تعملي redirect للداشبورد حسب الـ role
    if (role === "customer") window.location.href = "/";
    else {
      window.location.href = `/dashboard/${role}`;
    }
  };

  // ----------------------------------------------------------------
  // عرض OTP Screen
  // ----------------------------------------------------------------
  if (step === "otp") {
    return (
      <OtpVerification
        email={email}
        mode="signup"
        onSuccess={handleOtpSuccess}
        onBack={() => setStep(role === "customer" ? 2 : 3)}
      />
    );
  }

  return (
    <div className="auth-form-container">
      <div className="auth-tabs">
        <button className="auth-tab" onClick={onSwitchToLogin}>
          <span className="tab-icon">🔑</span> Log In
        </button>
        <button className="auth-tab active">
          <span className="tab-icon">✦</span> Sign Up
        </button>
      </div>

      <div className="auth-form-content">
        <h2 className="auth-title">Join the community</h2>
        <p className="auth-subtitle">Create your account in just a few steps</p>

        {/* Step indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map((s) => (
            <div key={s} className="step-wrapper">
              <div
                className={`step-dot ${(step as number) >= s ? "active" : ""} ${step === s ? "current" : ""}`}
              >
                {(step as number) > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`step-line ${(step as number) > s ? "active" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="step-label">
          {step === 1
            ? "Step 1: Account"
            : step === 2
              ? "Step 2: Your Role"
              : "Step 3: Profile"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {/* ==================== STEP 1: Account Info ==================== */}
        {step === 1 && (
          <>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <span className="input-icon">✉</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <span className="input-icon phone-prefix">🇪🇬 +20</span>
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="auth-input phone-input"
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <button
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
            </div>

            <button
              className={`auth-btn-primary ${loading ? "loading" : ""}`}
              onClick={handleStep1Continue}
              disabled={!fullName || !email || !password || !confirmPassword}
            >
              Continue
            </button>
          </>
        )}

        {/* ==================== STEP 2: Role Selection ==================== */}
        {step === 2 && (
          <>
            <p className="role-label">I am a...</p>
            <div className="role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  className={`role-card ${role === r.id ? "selected" : ""}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-name">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>

            <div className="step-buttons">
              <button className="auth-btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className={`auth-btn-primary flex-1 ${loading ? "loading" : ""}`}
                onClick={handleStep2Continue}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : role === "customer" ? (
                  "Create account "
                ) : (
                  "Continue "
                )}
              </button>
            </div>
          </>
        )}

        {/* ==================== STEP 3: Artist/Supplier Profile ==================== */}
        {step === 3 && (
          <>
            <p className="role-label">
              {role === "artist"
                ? "🎨 Tell us about your craft"
                : "📦 Tell us about your business"}
            </p>

            <div className="input-group">
              <span className="input-icon">🏪</span>
              <input
                type="text"
                placeholder={
                  role === "artist" ? "Shop / Studio Name" : "Business Name"
                }
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="auth-input"
              />
            </div>

            <div className="input-group textarea-group">
              <textarea
                placeholder={
                  role === "artist"
                    ? "Tell customers about your craft and style..."
                    : "Describe the materials you supply..."
                }
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="auth-textarea"
                rows={3}
              />
            </div>

            <div className="step-buttons">
              <button className="auth-btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className={`auth-btn-primary flex-1 ${loading ? "loading" : ""}`}
                onClick={handleFinalSubmit}
                disabled={loading || !shopName.trim()}
              >
                {loading ? <span className="spinner" /> : "Create account "}
              </button>
            </div>
          </>
        )}

        <p className="auth-switch">
          Already have an account?{" "}
          <button className="link-btn" onClick={onSwitchToLogin}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
