// src/types/profile.types.ts

export type UserRole = "customer" | "artist" | "supplier" | "admin";

export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUser extends BaseUser {
  role: "customer";
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

export interface ArtistUser extends BaseUser {
  role: "artist";
  shopName: string;
  bio?: string;
  craftCategory?: string;
  city?: string;
  instagramHandle?: string;
}

export interface SupplierUser extends BaseUser {
  role: "supplier";
  shopName: string;
  bio?: string;
  craftCategory?: string;
  city?: string;
  instagramHandle?: string;
}

export interface AdminUser extends BaseUser {
  role: "admin";
  firstName: string;
  lastName: string;
  department?: string;
  adminRoleLevel: "Super Admin" | "Moderator" | "Support";
}

export type AnyUser = CustomerUser | ArtistUser | SupplierUser | AdminUser;
