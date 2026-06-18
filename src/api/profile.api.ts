// src/api/profile.api.ts

const BASE = import.meta.env.VITE_API_URL;

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) throw new Error("Server returned empty response");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server error: ${text.slice(0, 100)}`);
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function authHeadersFormData(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfileApi() {
  const res = await fetch(`${BASE}/profile/me`, { headers: authHeaders() });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to load profile");
  return data.user;
}

export async function updateProfileApi(payload: Record<string, unknown>) {
  const res = await fetch(`${BASE}/profile/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Update failed");
  return data.user;
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const res = await fetch(`${BASE}/profile/change-password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Password change failed");
  return data;
}

export async function uploadAvatarApi(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch(`${BASE}/profile/avatar`, {
    method: "POST",
    headers: authHeadersFormData(),
    body: formData,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || "Avatar upload failed");
  return data.avatar as string;
}
