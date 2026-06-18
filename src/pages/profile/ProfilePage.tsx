// src/pages/profile/ProfilePage.tsx
import { useProfile } from "../../hooks/useProfile";
import { CustomerProfile } from "./CustomerProfile";
import { ArtistProfile } from "./ArtistProfile";
import { SupplierProfile } from "./SupplierProfile";
import { AdminProfile } from "./AdminProfile";
import "./Profile.css";

export function ProfilePage() {
  const { user, loading, error, updateProfile, uploadAvatar, logout } =
    useProfile();

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <p>Loading your profile…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-error">
        <p>⚠️ {error || "Could not load profile"}</p>
        <a href="/login">Return to login</a>
      </div>
    );
  }

  const commonProps = {
    onUpload: uploadAvatar,
    onLogout: logout,
  };

  switch (user.role) {
    case "customer":
      return (
        <CustomerProfile
          user={user as never}
          onUpdate={updateProfile as never}
          {...commonProps}
        />
      );
    case "artist":
      return (
        <ArtistProfile
          user={user as never}
          onUpdate={updateProfile as never}
          {...commonProps}
        />
      );
    case "supplier":
      return (
        <SupplierProfile
          user={user as never}
          onUpdate={updateProfile as never}
          {...commonProps}
        />
      );
    case "admin":
      return (
        <AdminProfile
          user={user as never}
          onUpdate={updateProfile as never}
          {...commonProps}
        />
      );
    default:
      return (
        <div className="profile-error">
          <p>Unknown role</p>
        </div>
      );
  }
}
