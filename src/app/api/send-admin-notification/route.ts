import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/send-email";

const LOGO_URL = "https://muramsliving.com/logo.png";

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
  checkOutDate?: string;
  checkInTime?: string;
  sharing?: number;
  monthsStay?: number;
}

function fmtDate(d?: string) {
  if (!d) return "Flexible";
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function tr(label: string, value: string, highlight = false) {
  return `<tr>
    <td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:13px;color:#888;">${label}</td>
    <td style="padding:12px 16px;border-top:1px solid #f0f0f3;font-size:14px;color:${highlight ? "#E8601C" : "#1A2E5A"};font-weight:${highlight ? "700" : "600"};">${value}</td>
  </tr>`;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ skipped: true, reason: "No admin email configured" });
    }

    const isPublic = body.bookingType === "public";
    const buildingLabel = body.building === "gold" ? "Gold" : body.building === "silver" ? "Silver" : body.building;
    const guestInfo = isPublic
      ? `${body.adults || 1} Adult${(body.adults || 1) !== 1 ? "s" : ""}${(body.children || 0) > 0 ? `, ${body.children} Child${(body.children || 0) !== 1 ? "ren" : ""}` : ""}`
      : body.sharing ? `${body.sharing}-Sharing Room` : "Not specified";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://muramsliving.com";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1A2E5A;padding:24px 32px;">
            <table width="100%"><tr>
              <td><img src="${LOGO_URL}" width="110" alt="Murams Living" style="display:block;border-radius:6px;" /></td>
              <td align="right">
                <span style="background:#E8601C;color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;">
                  🔔 New ${isPublic ? "Guest" : "Student"} Booking
                </span>
              </td>
            </tr></table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body.bookingId ? `
            <div style="margin-bottom:20px;background:#FFF7F0;border:1.5px solid #FFDCC5;border-radius:12px;padding:14px 20px;text-align:center;">
              <div style="font-size:11px;color:#E8601C;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Booking ID</div>
              <div style="font-family:monospace;font-size:22px;font-weight:700;color:#1A2E5A;letter-spacing:2px;">${body.bookingId}</div>
            </div>` : ""}
            <h2 style="margin:0 0 6px;color:#1A2E5A;font-size:20px;">New Booking Request</h2>
            <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">
              A ${isPublic ? "guest" : "student"} has submitted a booking request. Review the details below and follow up.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e8e8eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#f8f9fc;">
                <td style="padding:10px 16px;font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:35%;">Detail</td>
                <td style="padding:10px 16px;font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Value</td>
              </tr>
              ${tr("Name", body.name)}
              ${tr("Phone", body.phone)}
              ${tr("Email", body.email || "Not provided")}
              ${tr("Booking Type", isPublic ? "Guest / Public" : "Student / Long-term")}
              ${tr("Building", `${buildingLabel} Building`)}
              ${body.roomGroup ? tr("Room", body.roomGroup, true) : ""}
              ${tr(isPublic ? "Guests" : "Room Preference", guestInfo)}
              ${tr("Check-in Date", fmtDate(body.checkInDate))}
              ${isPublic && body.checkOutDate ? tr("Check-out Date", fmtDate(body.checkOutDate)) : ""}
              ${!isPublic && body.monthsStay ? tr("Stay Duration", `${body.monthsStay} month${body.monthsStay !== 1 ? "s" : ""}`, true) : ""}
            </table>
            <div style="margin-top:28px;text-align:center;">
              <a href="${siteUrl}/admin/bookings" style="display:inline-block;background:#E8601C;color:#ffffff;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.3px;">
                View in Dashboard →
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:18px 32px;background:#f8f9fc;border-top:1px solid #e8e8eb;">
            <p style="margin:0;color:#999;font-size:12px;text-align:center;">
              Murams Living &middot; Rushikonda, Visakhapatnam &middot; <a href="tel:+917816055655" style="color:#999;text-decoration:none;">+91 78160 55655</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const result = await sendEmail({
      to: adminEmail,
      subject: `🔔 New ${isPublic ? "Guest" : "Student"} Booking — ${body.name} · ${buildingLabel} Building`,
      html,
    });

    if (!result.success) {
      console.error("Admin notification email failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin notification email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
