import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/send-email";

export async function POST(req: NextRequest) {
  // Simple guard — only callable from admin session or with secret
  const secret = process.env.TEST_EMAIL_SECRET;
  if (secret) {
    const authHeader = req.headers.get("x-test-secret");
    if (authHeader !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let to: string;
  try {
    const body = await req.json();
    to = (body.to as string)?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Provide a valid `to` email address" }, { status: 400 });
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:32px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <div style="background:#1a2e5a;padding:28px 36px;text-align:center;">
      <div style="color:#e8601c;font-size:32px;margin-bottom:6px;">✉️</div>
      <div style="color:#fff;font-size:20px;font-weight:700;">Test Email</div>
      <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:4px;">Murams Living</div>
    </div>
    <div style="padding:32px 36px;">
      <p style="margin:0 0 12px;font-size:15px;color:#1e293b;font-weight:600;">Email delivery is working! ✅</p>
      <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.6;">
        This is a test email sent from the Murams Living booking system to verify that
        email delivery is configured correctly.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
        <tr>
          <td style="padding:10px 14px;background:#f8fafc;font-size:12px;color:#94a3b8;font-weight:600;width:40%;">Sent to</td>
          <td style="padding:10px 14px;font-size:13px;color:#1e293b;font-weight:500;">${to}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;background:#f8fafc;font-size:12px;color:#94a3b8;font-weight:600;border-top:1px solid #f1f5f9;">Time</td>
          <td style="padding:10px 14px;font-size:13px;color:#1e293b;border-top:1px solid #f1f5f9;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
        </tr>
      </table>
    </div>
    <div style="padding:16px 36px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Murams Living · Rushikonda, Visakhapatnam</p>
    </div>
  </div>
</body>
</html>`;

  const result = await sendEmail({
    to,
    subject: "✉️ Test Email — Murams Living",
    html,
  });

  if (result.success) {
    return NextResponse.json({
      success: true,
      to,
      provider: result.provider,
      from: result.from,
    });
  }

  return NextResponse.json(
    { success: false, to, error: result.error },
    { status: 502 },
  );
}
