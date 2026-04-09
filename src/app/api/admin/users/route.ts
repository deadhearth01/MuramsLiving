import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const headers = {
  apikey: supabaseKey!,
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, role_id } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const res = await fetch(`${supabaseUrl}/rest/v1/admin_users`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({
        name,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: role || "staff",
        role_id: role_id || null,
        is_active: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, user: data[0] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, password, role, role_id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email.toLowerCase().trim();
    if (role !== undefined) updates.role = role;
    if (role_id !== undefined) updates.role_id = role_id;
    if (is_active !== undefined) updates.is_active = is_active;

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 12);
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/admin_users?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, user: data[0] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
