// src/components/profile/ProfileAvatar.tsx
import { useRef, useState } from "react";
import type { AnyUser } from "../../types/profile";

interface Props {
  user: AnyUser;
  onUpload: (file: File) => Promise<string>;
}

// Resolve avatar URL:
// Backend stores "/uploads/avatars/filename.jpg" (relative to API server).
// Frontend runs on a different origin (Vite dev server), so we prepend
// the API base URL — otherwise <img src> fetches from the wrong origin.
// If already absolute (http/https) we leave it untouched.

const API_ORIGIN = ((import.meta.env.VITE_API_URL as string) ?? "").replace(
  /\/api\/?$/,
  "",
); // "http://localhost:3000/api" → "http://localhost:3000"

function resolveAvatarUrl(avatar: string | null): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${API_ORIGIN}${avatar}`;
}

export function ProfileAvatar({ user, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarUrl = resolveAvatarUrl(user.avatar);

  const initials = (() => {
    if ("firstName" in user && user.firstName) {
      return `${user.firstName[0]}${"lastName" in user && user.lastName ? user.lastName[0] : ""}`.toUpperCase();
    }
    if ("shopName" in user && user.shopName)
      return user.shopName.slice(0, 2).toUpperCase();
    return user.name?.slice(0, 2).toUpperCase() || "?";
  })();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await onUpload(file);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-wrapper">
      <div className="avatar-circle" onClick={() => inputRef.current?.click()}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={user.name} className="avatar-img" />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}
        <div className="avatar-overlay">
          {uploading ? (
            <span className="avatar-spinner" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </div>
      </div>
      {error && <p className="avatar-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
