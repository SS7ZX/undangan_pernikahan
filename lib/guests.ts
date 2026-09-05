// ═══════════════════════════════════════════════════════════════════════════
// GUEST DATA UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

import type { Guest, GuestStats } from "./types";

/**
 * Fetch all guests from JSON file
 */
export async function fetchAllGuests(): Promise<Guest[]> {
  try {
    const response = await fetch("/api/guests", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch guests");
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
}

/**
 * Fetch single guest by slug
 */
export async function fetchGuestBySlug(slug: string): Promise<Guest | null> {
  const guests = await fetchAllGuests();
  return guests.find((g) => g.slug === slug) || null;
}

/**
 * Generate unique invitation link
 */
export function generateGuestLink(
  slug: string,
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : ""
): string {
  return `${baseUrl}/guest/${slug}`;
}

/**
 * Calculate guest statistics
 */
export function calculateGuestStats(guests: Guest[]): GuestStats {
  const stats: GuestStats = {
    total: guests.length,
    attended: 0,
    declined: 0,
    pending: 0,
    byCategory: {
      groom: 0,
      bride: 0,
      family: 0,
      friend: 0,
      colleague: 0,
      neighbor: 0,
      guest: 0,
    },
  };

  guests.forEach((guest) => {
    if (guest.attendance === "yes") stats.attended++;
    if (guest.attendance === "no") stats.declined++;
    if (guest.attendance === null || guest.attendance === "maybe")
      stats.pending++;

    stats.byCategory[guest.category]++;
  });

  return stats;
}

/**
 * Format guest name for display
 */
export function formatGuestName(name: string): string {
  return name.trim();
}

/**
 * Get category label in Indonesian
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    groom: "Pengantin Pria",
    bride: "Pengantin Wanita",
    family: "Keluarga Besar",
    friend: "Sahabat",
    colleague: "Teman Kerja",
    neighbor: "Tetangga",
    guest: "Tamu Undangan",
  };
  return labels[category] || category;
}

/**
 * Get category color for UI
 */
export function getCategoryColor(
  category: string
): "emerald" | "rose" | "blue" | "amber" | "purple" | "slate" {
  const colors: Record<string, "emerald" | "rose" | "blue" | "amber" | "purple" | "slate"> = {
    groom: "blue",
    bride: "rose",
    family: "emerald",
    friend: "amber",
    colleague: "purple",
    neighbor: "slate",
    guest: "slate",
  };
  return colors[category] || "slate";
}

/**
 * Filter guests by category
 */
export function filterGuestsByCategory(
  guests: Guest[],
  category: string
): Guest[] {
  if (category === "all") return guests;
  return guests.filter((g) => g.category === category);
}

/**
 * Sort guests by name
 */
export function sortGuestsByName(guests: Guest[]): Guest[] {
  return [...guests].sort((a, b) => a.name.localeCompare(b.name, "id-ID"));
}
