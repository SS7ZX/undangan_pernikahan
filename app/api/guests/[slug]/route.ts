/**
 * API Route: Get single guest by slug
 * GET /api/guests/[slug]
 */

import { fetchGuestBySlug } from "@/lib/guests";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return Response.json(
        { success: false, error: "Invalid slug" },
        { status: 400 }
      );
    }

    const guest = await fetchGuestBySlug(slug);

    if (!guest) {
      return Response.json(
        { success: false, error: "Guest not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: guest,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch guest" },
      { status: 500 }
    );
  }
}
