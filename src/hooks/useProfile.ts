// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  uploadAvatarApi,
} from "../api/profile.api";
import type { AnyUser } from "../types/profile";

export function useProfile() {
  const [user, setUser] = useState<AnyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfileApi()
      .then(setUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (payload: Record<string, unknown>) => {
    const updated = await updateProfileApi(payload);
    setUser(updated);
    return updated;
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => changePasswordApi(currentPassword, newPassword, confirmPassword);

  const uploadAvatar = async (file: File) => {
    const avatarUrl = await uploadAvatarApi(file);
    setUser((prev) => (prev ? { ...prev, avatar: avatarUrl } : prev));
    return avatarUrl;
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    changePassword,
    uploadAvatar,
    logout,
  };
}
