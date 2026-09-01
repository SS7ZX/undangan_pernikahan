/**
 * API Route: Get all guests
 * GET /api/guests
 */

import { fetchAllGuests, calculateGuestStats } from "@/lib/guests";

export async function GET() {
  try {
    const guests = await fetchAllGuests();
    const stats = calculateGuestStats(guests);

    return Response.json({
      success: true,
      data: guests,
      stats,
      count: guests.length,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch guests",
      },
      { status: 500 }
    );
  }
}
