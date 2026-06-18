const BASE = import.meta.env.VITE_API_URL;

// ── Safe JSON parser — يحمي من empty response ──
async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) throw new Error("Server returned empty response");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server error: ${text.slice(0, 100)}`);
  }
}

// ── Login ──
export async function loginApi(identifier: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: identifier, password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data; // { token, user }
}

// ── Register ──
export async function registerApi(payload: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  shopName?: string;
  bio?: string;
}) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

// ── Verify OTP ──
export async function verifyOtpApi(
  email: string,
  otp: string,
  //mode: "signup" | "reset"
) {
  const res = await fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Invalid OTP");
  return data;
}

// ── Forgot Password ──
export async function forgotPasswordApi(email: string) {
  const res = await fetch(`${BASE}/auth/forget-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

// ── Reset Password ──
export async function resetPasswordApi(
  email: string,
  otp: string,
  newPassword: string,
) {
  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Reset failed");
  return data;
}

// ── Resend OTP ──
export async function resendOtpApi(email: string, purpose: "signup" | "reset") {
  const res = await fetch(`${BASE}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
  return data;
}
