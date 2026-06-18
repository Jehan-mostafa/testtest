import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import "../../style/AuthPages.css";
import { verifyOtpApi, resendOtpApi } from "../../api/auth.api";

interface OtpVerificationProps {
  email: string;
  mode: "signup" | "reset";
  onSuccess: (otp: string) => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function OtpVerification({
  email,
  mode,
  onSuccess,
  onBack,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS); // بيبدأ بـ 60 أصلاً
  const [resendSuccess, setResendSuccess] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startResendTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startResendTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── OTP input handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      otpRefs.current[index + 1]?.focus();
    if (e.key === "Enter" && otp.join("").length === OTP_LENGTH) handleVerify();
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Verify ──
  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        // signup → POST /api/auth/verify-otp بيتحقق من tempUsers وبيعمل create
        const data = await verifyOtpApi(email, otpValue);
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }
      // reset → مش بنعمل API call هنا
      // الـ OTP بيتبعت لـ ForgotPassword وبيتتحقق منه في reset-password
      onSuccess(otpValue);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid or expired code.");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ──
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setResendSuccess(false);
    setLoading(true);
    try {
      // signup → resend من tempUsers | reset → resend من DB
      await resendOtpApi(email, mode === "signup" ? "signup" : "reset");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
      setResendSuccess(true);
      setResendTimer(RESEND_SECONDS);
      startResendTimer();
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otp.join("").length === OTP_LENGTH;

  const config = {
    signup: {
      icon: "✉️",
      title: "Verify your email",
      subtitle: "We sent a 6-digit code to confirm your account.",
    },
    reset: {
      icon: "📧",
      title: "Check your email",
      subtitle: "We sent a 6-digit code to reset your password.",
    },
  }[mode];

  return (
    <div className="auth-form-container">
      <button className="fp-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="auth-form-content">
        <div className="fp-icon-wrap">
          <span className="fp-icon">{config.icon}</span>
        </div>

        <h2 className="auth-title">{config.title}</h2>
        <p className="auth-subtitle">
          {config.subtitle}
          <br />
          <strong style={{ color: "var(--brand-text)" }}>{email}</strong>
        </p>

        {resendSuccess && (
          <div className="auth-success-msg">✓ A new code has been sent!</div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <div className="otp-grid">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                otpRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              onPaste={handleOtpPaste}
              className={`otp-box ${digit ? "filled" : ""}`}
              autoFocus={i === 0}
              disabled={loading}
            />
          ))}
        </div>

        <button
          className={`auth-btn-primary ${loading ? "loading" : ""}`}
          onClick={handleVerify}
          disabled={loading || !otpFilled}
        >
          {loading ? <span className="spinner" /> : "Verify →"}
        </button>

        <p className="fp-resend">
          Didn't receive the code?{" "}
          <button
            className={`link-btn ${resendTimer > 0 ? "disabled" : ""}`}
            onClick={handleResend}
            disabled={resendTimer > 0 || loading}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </p>

        <button className="fp-change-email" onClick={onBack}>
          ← Use a different email
        </button>
      </div>
    </div>
  );
}
