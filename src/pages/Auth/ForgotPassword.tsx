import { useState } from "react";
import "../../style/AuthPages.css";
// import "../../ForgotPassword.css";
import { OtpVerification } from "./OtpVerifications";
import { forgotPasswordApi, resetPasswordApi } from "../../api/auth.api";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Send OTP → POST /api/auth/forget-password ──
  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      // الباك بيبعت OTP على الإيميل ويرجع { message: "OTP sent to email" }
      setStep(2);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send code. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP verified → جاب الـ OTP من OtpVerification ──
  // ملاحظة: في mode="reset" الـ OtpVerification بيعمل verify-otp
  // ولما ينجح بيبعت الـ OTP للـ parent عشان نستخدمه في reset-password
  const handleOtpSuccess = (otp: string) => {
    setVerifiedOtp(otp);
    setStep(3);
  };

  // ── Step 3: Reset Password → POST /api/auth/reset-password ──
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // الباك بيستقبل { email, otp, newPassword }
      await resetPasswordApi(email, verifiedOtp, newPassword);
      setStep(4);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OtpVerification component ──
  if (step === 2) {
    return (
      <OtpVerification
        email={email}
        mode="reset"
        onSuccess={handleOtpSuccess}
        onBack={() => {
          setError("");
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="auth-form-container">
      <button className="fp-back-btn" onClick={onBackToLogin}>
        ← Back to Login
      </button>

      <div className="auth-form-content">
        {/* ── Step 1: Enter Email ── */}
        {step === 1 && (
          <>
            <div className="fp-icon-wrap">
              <span className="fp-icon">🔐</span>
            </div>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">
              Enter your email and we'll send you a verification code.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <span className="input-icon">✉</span>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="auth-input"
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                autoFocus
              />
            </div>

            <button
              className={`auth-btn-primary ${loading ? "loading" : ""}`}
              onClick={handleSendOtp}
              disabled={loading || !email.trim()}
            >
              {loading ? <span className="spinner" /> : "Send Code "}
            </button>
          </>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 3 && (
          <>
            <div className="fp-icon-wrap">
              <span className="fp-icon">🔒</span>
            </div>
            <h2 className="auth-title">Set new password</h2>
            <p className="auth-subtitle">
              Your identity is verified. Choose a strong password.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="auth-input"
                autoFocus
              />
              <button
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Password strength */}
            {newPassword && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`strength-bar ${
                        getStrength(newPassword) >= level
                          ? `level-${getStrength(newPassword)}`
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="strength-label">
                  {getStrengthLabel(newPassword)}
                </span>
              </div>
            )}

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="auth-input"
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
            </div>

            {/* Match indicator */}
            {confirmPassword && (
              <p
                className={`fp-match ${newPassword === confirmPassword ? "match" : "no-match"}`}
              >
                {newPassword === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords don't match"}
              </p>
            )}

            <button
              className={`auth-btn-primary ${loading ? "loading" : ""}`}
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? <span className="spinner" /> : "Reset Password →"}
            </button>
          </>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div className="fp-success">
            <div className="fp-success-icon">✓</div>
            <h2 className="auth-title">Password Reset!</h2>
            <p className="auth-subtitle">
              Your password has been updated successfully.
              <br />
              You can now log in with your new password.
            </p>
            <button className="auth-btn-primary" onClick={onBackToLogin}>
              Go to Login →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Password strength helpers ──
function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(1, score);
}

function getStrengthLabel(password: string): string {
  return ["", "Weak", "Fair", "Good", "Strong"][getStrength(password)];
}
