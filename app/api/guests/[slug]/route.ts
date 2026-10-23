import {
  createGuestWish,
  findGuestBySlug,
  updateGuestAttendance,
} from "@/lib/supabase-server";
type RouteContext = { params: Promise<{ slug: string }> };

async function getSlug(context: RouteContext): Promise<string> {
  const { slug } = await context.params;
  return slug.trim();
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const guest = await findGuestBySlug(await getSlug(context));
    if (!guest) {
      return Response.json(
        { success: false, error: "Guest not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: {
        id: guest.id,
        name: guest.name,
        slug: guest.slug,
        attendance: guest.attendance,
      },
    });
  } catch (error) {
    console.error("Failed to fetch guest from Supabase:", error);
    return Response.json(
      { success: false, error: "Gagal memuat data undangan" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Permintaan tidak valid" },
      { status: 400 }
    );
  }

  const attendance =
    body && typeof body === "object" && "attendance" in body
      ? body.attendance
      : undefined;
  if (
    attendance !== "yes" &&
    attendance !== "no" &&
    attendance !== "maybe" &&
    attendance !== null
  ) {
    return Response.json(
      { success: false, error: "Status RSVP tidak valid" },
      { status: 400 }
    );
  }

  try {
    const guest = await updateGuestAttendance(
      await getSlug(context),
      attendance
    );
    if (!guest) {
      return Response.json(
        { success: false, error: "Guest not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: guest });
  } catch (error) {
    console.error("Failed to update guest RSVP:", error);
    return Response.json(
      { success: false, error: "RSVP gagal disimpan" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Permintaan tidak valid" },
      { status: 400 }
    );
  }

  const senderName =
    body && typeof body === "object" && "senderName" in body && typeof body.senderName === "string"
      ? body.senderName.trim()
      : "";
  const message =
    body && typeof body === "object" && "message" in body && typeof body.message === "string"
      ? body.message.trim()
      : "";

  if (!senderName || senderName.length > 120 || !message || message.length > 2000) {
    return Response.json(
      { success: false, error: "Nama (maksimal 120 karakter) dan ucapan (maksimal 2.000 karakter) wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const wish = await createGuestWish(await getSlug(context), senderName, message);
    if (!wish) {
      return Response.json(
        { success: false, error: "Guest not found" },
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: wish }, { status: 201 });
  } catch (error) {
    console.error("Failed to save guest wish:", error);
    return Response.json(
      { success: false, error: "Ucapan gagal disimpan" },
      { status: 500 }
    );
  }
}
