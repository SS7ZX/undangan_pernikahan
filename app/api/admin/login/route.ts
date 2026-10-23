import {
  createAdminSessionCookie,
  hasAdminAuthConfig,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasAdminAuthConfig()) {
    return Response.json(
      { error: "Atur password admin minimal 12 karakter dan session secret minimal 32 karakter" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? body.password
      : undefined;
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return Response.json({ error: "Password admin salah" }, { status: 401 });
  }

  return Response.json(
    { authenticated: true },
    { headers: { "Set-Cookie": createAdminSessionCookie() } }
  );
}
