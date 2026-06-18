import { useState } from "react";
import "../../style/AuthPages.css";
import { ForgotPassword } from "./ForgotPassword";
import { loginApi } from "../../api/auth.api";

export function Login({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show forgot password flow inline
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(identifier, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "customer") window.location.href = "/";
      // navigate حسب الـ role
      // navigate(`/dashboard/${data.user.role}`)
      else {
        window.location.href = `/dashboard/${data.user.role}`;
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // redirect مباشرة للـ backend
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    // TODO (Backend): window.location.href = "/api/auth/facebook";
    alert("Facebook OAuth - connect to backend");
  };

  // ── Show Forgot Password screen instead of login form ──
  if (showForgotPassword) {
    return (
      <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="auth-form-container">
      <div className="auth-tabs">
        <button className="auth-tab active">
          <span className="tab-icon">🔑</span> Log In
        </button>
        <button className="auth-tab" onClick={onSwitchToRegister}>
          <span className="tab-icon">✦</span> Sign Up
        </button>
      </div>

      <div className="auth-form-content">
        <h2 className="auth-title">Welcome back!</h2>
        <p className="auth-subtitle">Sign in to discover handmade treasures</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="input-group">
          <span className="input-icon">✉</span>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="auth-input"
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
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <div className="auth-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="remember-checkbox"
            />
            <span>Remember me</span>
          </label>
          {/* ── Triggers Forgot Password flow ── */}
          <button
            className="forgot-link"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot password?
          </button>
        </div>

        <button
          className={`auth-btn-primary ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading || !identifier || !password}
        >
          {loading ? <span className="spinner" /> : "Log In "}
        </button>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="social-btn" onClick={handleFacebookLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="auth-switch">
          New to Handmade?{" "}
          <button className="link-btn" onClick={onSwitchToRegister}>
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
