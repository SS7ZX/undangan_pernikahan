import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function POST() {
  return Response.json(
    { success: true },
    { headers: { "Set-Cookie": clearAdminSessionCookie() } }
  );
}
