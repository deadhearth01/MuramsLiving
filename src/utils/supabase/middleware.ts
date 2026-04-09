import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("ml_admin_session")?.value;

  let isAuthed = false;
  if (session) {
    try {
      const data = JSON.parse(Buffer.from(session, "base64").toString());
      // Valid if has id and not expired (7 days)
      isAuthed = !!data.id && Date.now() - (data.ts || 0) < 7 * 24 * 60 * 60 * 1000;
    } catch { /* invalid cookie */ }
  }

  // Redirect unauthenticated users away from /admin
  if (request.nextUrl.pathname.startsWith("/admin") && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from /login
  if (request.nextUrl.pathname === "/login" && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({ request });
}
