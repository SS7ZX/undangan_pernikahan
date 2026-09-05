// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type GuestCategory = 
  | "groom" 
  | "bride" 
  | "family" 
  | "friend" 
  | "colleague" 
  | "neighbor"
  | "guest";

export type InvitationType = "physical" | "digital";

export type AttendanceStatus = "yes" | "no" | "maybe" | null;

export interface Guest {
  id: number;
  name: string;
  slug: string;
  relation: string;
  category: GuestCategory;
  email: string;
  phone: string;
  attendance: AttendanceStatus;
  notes: string;
  invitationType?: InvitationType;
}

export interface GuestWithLink extends Guest {
  link: string;
  qrCode?: string;
}

export interface GuestStats {
  total: number;
  attended: number;
  declined: number;
  pending: number;
  byCategory: Record<GuestCategory, number>;
}
