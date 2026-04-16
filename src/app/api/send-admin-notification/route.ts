import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface BookingPayload {
  name: string;
  phone: string;
  email?: string;
  building: string;
  roomGroup?: string;
  bookingType: string;
  bookingId?: string;
  adults?: number;
  children?: number;
  checkInDate?: string;
  checkInTime?: string;
  sharing?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!host || !user || !pass || !adminEmail) {
      console.error(
        "SMTP not configured — missing SMTP_HOST, SMTP_USER, SMTP_PASS, or ADMIN_NOTIFICATION_EMAIL",
      );
      return NextResponse.json(
        { skipped: true, reason: "SMTP not configured" },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("SMTP connection/auth verification failed:", verifyErr);
      return NextResponse.json(
        { error: "SMTP connection/auth failed" },
        { status: 502 },
      );
    }

    const isPublic = body.bookingType === "public";
    const buildingLabel = body.building === "gold" ? "Gold" : body.building === "silver" ? "Silver" : body.building;
    const guestInfo = isPublic
      ? `${body.adults || 1} Adult${(body.adults || 1) !== 1 ? "s" : ""}${(body.children || 0) > 0 ? `, ${body.children} Child${(body.children || 0) !== 1 ? "ren" : ""}` : ""}`
      : body.sharing ? `${body.sharing}-Sharing` : "Not specified";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://muramsliving.com";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:#1A2E5A;padding:24px 32px;">
            <table width="100%"><tr>
              <td><img src="https://lh3.google.com/u/0/d/1l41-k1jw-fAQ-yU0R5WuppT0awayFQq9=w400-h200-iv1" width="120" alt="Murams Living" style="display:block;" /></td>
              <td align="right"><span style="background:#E8601C;color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;">New Booking</span></td>
            </tr></table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body.bookingId ? `<p style="margin:0 0 12px;background:#FFF0E8;color:#E8601C;padding:8px 16px;border-radius:8px;font-family:monospace;font-size:16px;font-weight:700;display:inline-block;">${body.bookingId}</p>` : ""}
            <h2 style="margin:0 0 8px;color:#1A2E5A;font-size:22px;">New Booking Request</h2>
            <p style="margin:0 0 24px;color:#666;font-size:14px;">
              A ${isPublic ? "guest" : "student"} has submitted a booking request. Here are the details:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8eb;border-radius:8px;overflow:hidden;">
              <tr style="background:#f8f9fc;">
                <td style="padding:12px 16px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Detail</td>
                <td style="padding:12px 16px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Value</td>
              </tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Name</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;font-weight:600;">${body.name}</td></tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Phone</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;font-weight:600;">${body.phone}</td></tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Email</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;">${body.email || "Not provided"}</td></tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Type</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;font-weight:600;text-transform:capitalize;">${body.bookingType}</td></tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Building</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;font-weight:600;">${buildingLabel}</td></tr>
              ${body.roomGroup ? `<tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Room</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#E8601C;font-weight:700;">${body.roomGroup}</td></tr>` : ""}
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">${isPublic ? "Guests" : "Room Type"}</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;">${guestInfo}</td></tr>
              <tr><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">Check-in</td><td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:#1A2E5A;">${body.checkInDate || "Flexible"}${body.checkInTime ? ` at ${body.checkInTime}` : ""}</td></tr>
            </table>
            <div style="margin-top:28px;text-align:center;">
              <a href="${siteUrl}/admin/bookings" style="display:inline-block;background:#E8601C;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
                Check from Dashboard
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f8f9fc;border-top:1px solid #e8e8eb;">
            <p style="margin:0;color:#999;font-size:12px;text-align:center;">
              Murams Living &middot; Rushikonda, Visakhapatnam
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Murams Living" <${user}>`,
      to: adminEmail,
      subject: `New ${isPublic ? "Guest" : "Student"} Booking — ${body.name} (${buildingLabel})`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin notification email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
