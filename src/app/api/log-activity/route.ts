import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { action, page, details } = await request.json();

    // Read session from cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("ml_admin_session")?.value;

    if (!session) {
      return NextResponse.json({ skipped: true });
    }

    let userId: string;
    let userName: string;
    let userRole: string;

    try {
      const data = JSON.parse(Buffer.from(session, "base64").toString());
      userId = data.id;
      userName = data.name;
      userRole = data.role;
    } catch {
      return NextResponse.json({ skipped: true });
    }

    // Only skip if truly no identity at all
    if (!userId || userId === "unknown") {
      return NextResponse.json({ skipped: true });
    }
    // Fallback name/role if missing in session
    if (!userName) userName = userId;
    if (!userRole) userRole = "unknown";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ skipped: true });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

    await fetch(`${supabaseUrl}/rest/v1/activity_logs`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        action: action || "",
        page: page || "",
        details: details || "",
        ip,
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
