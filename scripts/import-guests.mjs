import { readFile } from "node:fs/promises";

const guestsPath = new URL("../_generated-guests.json", import.meta.url);
const guests = JSON.parse(await readFile(guestsPath, "utf8"));
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
}

const rows = guests.map((guest) => ({
  name: guest.name,
  slug: guest.slug,
  relation: guest.relation ?? "",
  category: guest.category ?? "guest",
  email: guest.email ?? "",
  phone: guest.phone ?? "",
  attendance: guest.attendance ?? null,
  notes: guest.notes ?? "",
  invitation_type: guest.invitationType ?? null,
}));

for (let offset = 0; offset < rows.length; offset += 100) {
  const batch = rows.slice(offset, offset + 100);
  const response = await fetch(
    `${supabaseUrl}/rest/v1/guests?on_conflict=slug`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(batch),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Import failed for rows ${offset + 1}-${offset + batch.length}: ${details}`);
  }

  console.log(`Imported ${Math.min(offset + batch.length, rows.length)} of ${rows.length} guests.`);
}
