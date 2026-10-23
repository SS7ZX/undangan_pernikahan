import type { AttendanceStatus, Guest, GuestWish } from "@/lib/types";

type SupabaseGuest = Omit<Guest, "invitationType" | "wishes"> & {
  invitation_type: Guest["invitationType"];
};

type SupabaseWish = {
  id: number;
  guest_id: number | null;
  sender_name: string;
  message: string;
  created_at: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured");
  }

  return { url, key };
}

async function supabaseRequest<T>(
  resource: string,
  init: RequestInit = {}
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${resource}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Supabase request failed (${response.status}): ${details}`);
    throw new Error("Supabase request failed");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function toGuest(row: SupabaseGuest): Guest {
  const { invitation_type, ...guest } = row;
  return { ...guest, invitationType: invitation_type };
}

export async function listGuestsWithWishes(): Promise<{
  guests: Guest[];
  unassignedWishes: GuestWish[];
}> {
  const [guestRows, wishRows] = await Promise.all([
    supabaseRequest<SupabaseGuest[]>("guests?select=*&order=name.asc"),
    supabaseRequest<SupabaseWish[]>("guest_wishes?select=*&order=created_at.desc"),
  ]);
  const wishesByGuest = new Map<number, GuestWish[]>();
  const unassignedWishes: GuestWish[] = [];

  for (const wish of wishRows) {
    const formattedWish = {
      id: wish.id,
      senderName: wish.sender_name,
      message: wish.message,
      createdAt: wish.created_at,
    };
    if (wish.guest_id === null) {
      unassignedWishes.push(formattedWish);
      continue;
    }
    const wishes = wishesByGuest.get(wish.guest_id) ?? [];
    wishes.push(formattedWish);
    wishesByGuest.set(wish.guest_id, wishes);
  }

  return {
    guests: guestRows.map((row) => ({
      ...toGuest(row),
      wishes: wishesByGuest.get(row.id) ?? [],
    })),
    unassignedWishes,
  };
}

export async function findGuestBySlug(
  slug: string
): Promise<Pick<Guest, "id" | "name" | "slug" | "attendance"> | null> {
  const rows = await supabaseRequest<
    Array<Pick<SupabaseGuest, "id" | "name" | "slug" | "attendance">>
  >(
    `guests?select=id,name,slug,attendance&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  return rows[0] ?? null;
}

export async function updateGuestAttendance(
  slug: string,
  attendance: AttendanceStatus
): Promise<Guest | null> {
  const rows = await supabaseRequest<SupabaseGuest[]>(
    `guests?select=id,name,slug,attendance&slug=eq.${encodeURIComponent(slug)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ attendance }),
    }
  );
  return rows[0] ? toGuest(rows[0]) : null;
}

export async function createGuestWish(
  slug: string,
  senderName: string,
  message: string
): Promise<GuestWish | null> {
  const guest = await findGuestBySlug(slug);
  if (!guest) return null;

  const rows = await supabaseRequest<SupabaseWish[]>("guest_wishes?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      guest_id: guest.id,
      sender_name: senderName,
      message,
    }),
  });
  const wish = rows[0];

  return {
    id: wish.id,
    senderName: wish.sender_name,
    message: wish.message,
    createdAt: wish.created_at,
  };
}

export async function createUnassignedWish(
  senderName: string,
  message: string
): Promise<GuestWish> {
  const rows = await supabaseRequest<SupabaseWish[]>("guest_wishes?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ guest_id: null, sender_name: senderName, message }),
  });
  const wish = rows[0];

  return {
    id: wish.id,
    senderName: wish.sender_name,
    message: wish.message,
    createdAt: wish.created_at,
  };
}

export async function createGuestWithUniqueSlug(name: string): Promise<Guest> {
  const baseSlug =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "tamu-undangan";

  for (let suffix = 1; ; suffix++) {
    const slug = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    const existing = await supabaseRequest<SupabaseGuest[]>(
      `guests?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`
    );
    if (existing.length) continue;

    try {
      const rows = await supabaseRequest<SupabaseGuest[]>("guests?select=*", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          name,
          slug,
          relation: "Tamu Undangan",
          category: "friend",
          email: "",
          phone: "",
          attendance: null,
          notes: "",
          invitation_type: null,
        }),
      });
      return toGuest(rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message === "Supabase request failed") {
        const check = await supabaseRequest<SupabaseGuest[]>(
          `guests?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`
        );
        if (check.length) continue;
      }
      throw error;
    }
  }
}
