import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createGuestWithUniqueSlug, listGuestsWithWishes } from "@/lib/supabase-server";
import { calculateGuestStats } from "@/lib/guests";

function unauthorized() {
  return Response.json({ error: "Silakan login sebagai admin" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated(request)) return unauthorized();

  try {
    const guests = await listGuestsWithWishes();
    return Response.json({
      success: true,
      data: guests,
      stats: calculateGuestStats(guests),
      count: guests.length,
    });
  } catch (error) {
    console.error("Failed to fetch guests from Supabase:", error);
    return Response.json(
      { success: false, error: "Gagal memuat data tamu dari database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Permintaan tidak valid" }, { status: 400 });
  }

  const name =
    body && typeof body === "object" && "name" in body && typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name || name.length > 120) {
    return Response.json(
      { success: false, error: "Nama tamu wajib diisi (maksimal 120 karakter)" },
      { status: 400 }
    );
  }

  try {
    const guest = await createGuestWithUniqueSlug(name);
    return Response.json({ success: true, data: guest }, { status: 201 });
  } catch (error) {
    console.error("Failed to add guest:", error);
    return Response.json(
      { success: false, error: "Tamu gagal ditambahkan ke database" },
      { status: 500 }
    );
  }
}
