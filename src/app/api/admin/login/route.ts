import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const ADMIN_SESSION_COOKIE = "ml_admin_session";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const inputEmail = email.toLowerCase().trim();

  let authedUser: { id: string; email: string; name: string; role: string; pages?: string[] } | null = null;

  // 1. Check env-variable primary admin first (works with no DB)
  const envEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const envPassword = process.env.ADMIN_PASSWORD || "";

  if (inputEmail === envEmail && password === envPassword) {
    authedUser = { id: "env-admin", email: inputEmail, name: "Admin", role: "admin" };
  }

  // 2. If not matched, check admin_users table in Supabase
  if (!authedUser) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(inputEmail)}&is_active=eq.true&select=id,email,name,role,password_hash,role_id&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const rows = await res.json();
          const user = rows[0];
          if (user && user.password_hash) {
            // Support both bcrypt hashed and legacy plain-text passwords
            const isMatch = user.password_hash.startsWith("$2")
              ? await bcrypt.compare(password, user.password_hash)
              : user.password_hash === password;
            if (isMatch) {
              authedUser = { id: user.id, email: user.email, name: user.name, role: user.role };

              // Fetch role pages if user has a role_id
              if (user.role_id) {
                try {
                  const roleRes = await fetch(
                    `${supabaseUrl}/rest/v1/admin_roles?id=eq.${user.role_id}&select=pages&limit=1`,
                    { headers: { apikey: supabaseKey!, Authorization: `Bearer ${supabaseKey}` } }
                  );
                  if (roleRes.ok) {
                    const roles = await roleRes.json();
                    if (roles[0]?.pages) authedUser.pages = roles[0].pages;
                  }
                } catch { /* role fetch failed, no page restrictions */ }
              }

              // Update last_login (fire and forget)
              fetch(`${supabaseUrl}/rest/v1/admin_users?id=eq.${user.id}`, {
                method: "PATCH",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                  Prefer: "return=minimal",
                },
                body: JSON.stringify({ last_login: new Date().toISOString() }),
              }).catch(() => {});
            }
          }
        }
      }
    } catch {
      // DB unavailable — only env admin works
    }
  }

  if (!authedUser) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const sessionData = JSON.stringify({
    id: authedUser.id,
    email: authedUser.email,
    name: authedUser.name,
    role: authedUser.role,
    pages: authedUser.pages || [],
    ts: Date.now(),
  });

  // Log successful login (fire and forget)
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (sbUrl && sbKey) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    fetch(`${sbUrl}/rest/v1/activity_logs`, {
      method: "POST",
      headers: {
        apikey: sbKey,
        Authorization: `Bearer ${sbKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: authedUser.id,
        user_name: authedUser.name,
        user_role: authedUser.role,
        action: "login",
        page: "login",
        details: `Logged in as ${authedUser.email}`,
        ip,
      }),
    }).catch(() => {});
  }

  const response = NextResponse.json({
    success: true,
    user: { name: authedUser.name, role: authedUser.role },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
