import { hasAdminAuthConfig, isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!hasAdminAuthConfig()) {
    return Response.json(
      { error: "Atur password admin minimal 12 karakter dan session secret minimal 32 karakter" },
      { status: 503 }
    );
  }

  return Response.json({ authenticated: isAdminAuthenticated(request) });
}
