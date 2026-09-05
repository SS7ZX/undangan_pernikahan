/**
 * API Route: Get single guest by slug
 * GET /api/guests/[slug]
 */

import { promises as fs } from "fs";
import path from "path";
import type { AttendanceStatus, Guest } from "@/lib/types";

const guestsFilePath = path.join(process.cwd(), "_generated-guests.json");

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

    const guests = JSON.parse(await fs.readFile(guestsFilePath, "utf8")) as Guest[];
    const guest = guests.find((item) => item.slug === slug);

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const attendance = body.attendance as AttendanceStatus;

    if (!slug || !["yes", "no", "maybe", null].includes(attendance)) {
      return Response.json(
        { success: false, error: "Status RSVP tidak valid" },
        { status: 400 }
      );
    }

    const guests = JSON.parse(await fs.readFile(guestsFilePath, "utf8")) as Guest[];
    const guestIndex = guests.findIndex((guest) => guest.slug === slug);

    if (guestIndex === -1) {
      return Response.json(
        { success: false, error: "Guest not found" },
        { status: 404 }
      );
    }

    const updatedGuest = { ...guests[guestIndex], attendance };
    guests[guestIndex] = updatedGuest;
    await fs.writeFile(guestsFilePath, JSON.stringify(guests, null, 2) + "\n", "utf8");

    return Response.json({ success: true, data: updatedGuest });
  } catch (error) {
    console.error("Failed to update guest RSVP:", error);
    return Response.json(
      { success: false, error: "RSVP gagal disimpan" },
      { status: 500 }
    );
  }
}
