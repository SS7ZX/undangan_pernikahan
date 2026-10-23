import { createUnassignedWish } from "@/lib/supabase-server";

export async function POST(request: Request) {
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
    const wish = await createUnassignedWish(senderName, message);
    return Response.json({ success: true, data: wish }, { status: 201 });
  } catch (error) {
    console.error("Failed to save general wish:", error);
    return Response.json(
      { success: false, error: "Ucapan gagal disimpan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
