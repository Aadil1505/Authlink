// types.ts

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  major: string;
  email: string;
  maker_id: string;
  h700: string;
  created_at: string;
  updated_at: string;
  profile_picture: string;
}

export interface UserTimeStats {
  total_visits: string;
  total_time: string; // Format: "HH:MM:SS"
  current_session: string | null; // Format: "HH:MM:SS" or null if not checked in
}

export interface products {
  id: number;
  product_id: string; // UUID
  name: string;
  description?: string;
  manufacturer_id: number;
  created_at: string; // TIMESTAMP (ISO 8601 format string)
}

export type UserRole = "manufacturer" | "product_owner";

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  profile_picture: string;
  manufacturer_code: string | null;
}
