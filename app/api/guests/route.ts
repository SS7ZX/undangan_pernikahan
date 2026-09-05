/**
 * API Route: Get and add guests
 * GET /api/guests
 * POST /api/guests
 */

import { promises as fs } from "fs";
import path from "path";
import { calculateGuestStats } from "@/lib/guests";
import type { Guest } from "@/lib/types";

// The imported workbook data is kept outside public so guest data is only
// exposed through the API and not as a directly browsable JSON asset.
const guestsFilePath = path.join(process.cwd(), "_generated-guests.json");

async function readGuestsFromFile(): Promise<Guest[]> {
  const file = await fs.readFile(guestsFilePath, "utf8");
  return JSON.parse(file) as Guest[];
}

export async function GET() {
  try {
    const guests = await readGuestsFromFile();
    const stats = calculateGuestStats(guests);

    return Response.json({
      success: true,
      data: guests,
      stats,
      count: guests.length,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch guests",
      },
      { status: 500 }
    );
  }
}

function createSlug(name: string, existingSlugs: Set<string>): string {
  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "tamu-undangan";

  let slug = baseSlug;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }
  return slug;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return Response.json(
        { success: false, error: "Nama tamu wajib diisi" },
        { status: 400 }
      );
    }

    const guests = await readGuestsFromFile();
    const newGuest: Guest = {
      id: guests.length ? Math.max(...guests.map((guest) => guest.id)) + 1 : 1,
      name,
      slug: createSlug(name, new Set(guests.map((guest) => guest.slug))),
      relation: "Tamu Undangan",
      category: "friend",
      email: "",
      phone: "",
      attendance: null,
      notes: "",
    };

    await fs.writeFile(
      guestsFilePath,
      JSON.stringify([...guests, newGuest], null, 2) + "\n",
      "utf8"
    );

    return Response.json({ success: true, data: newGuest }, { status: 201 });
  } catch (error) {
    console.error("Failed to add guest:", error);
    return Response.json(
      { success: false, error: "Tamu gagal ditambahkan" },
      { status: 500 }
    );
  }
}
