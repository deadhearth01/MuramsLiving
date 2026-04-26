import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/send-email";

const LOGO_URL = "https://muramsliving.com/logo.png";

export interface BookingEmailPayload {
  name: string;
  email: string;
  phone: string;
  bookingId?: string;
  bookingType?: "student" | "public";
  building: string;
  // Student-specific
  roomGroup?: string;
  floorName?: string;
  sharing?: number;
  monthsStay?: number;
  // Public-specific
  adults?: number;
  children?: number;
  preferredRoomType?: "ac" | "non-ac";
  // Dates
  checkInDate?: string;
  checkOutDate?: string;
}

function fmtDate(d?: string) {
  if (!d) return "Flexible / To be confirmed";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;width:40%;background:#f8fafc;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;color:#1e293b;font-weight:500;border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

function rowBold(label: string, value: string, color = "#1a2e5a") {
  return `<tr>
    <td style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;width:40%;background:#f8fafc;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;color:${color};font-weight:700;border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

function rowHr() {
  return `<tr><td colspan="2" style="padding:0;height:3px;background:#f1f5f9;"></td></tr>`;
}

function step(num: string, color: string, title: string, desc: string) {
  return `<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
    <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${color};color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:28px;text-align:center;">${num}</div>
    <div>
      <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:2px;">${title}</div>
      <div style="font-size:12px;color:#64748b;line-height:1.6;">${desc}</div>
    </div>
  </div>`;
}

function emailShell(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Murams Living</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
        <!-- Header -->
        <tr>
          <td style="background:#1a2e5a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <img src="${LOGO_URL}" alt="Murams Living" width="140" style="display:inline-block;max-width:140px;height:auto;border-radius:8px;margin-bottom:10px;" />
            <div style="color:rgba(255,255,255,0.55);font-size:13px;">Rushikonda, Visakhapatnam</div>
          </td>
        </tr>
        ${content}
        <!-- Amenities strip -->
        <tr>
          <td style="background:#f8fafc;border:1.5px solid #e2e8f0;border-top:none;padding:20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;padding:0 8px;"><div style="font-size:18px;margin-bottom:4px;">🏖️</div><div style="font-size:11px;color:#64748b;font-weight:600;">1 km to Beach</div></td>
                <td style="text-align:center;padding:0 8px;"><div style="font-size:18px;margin-bottom:4px;">🍛</div><div style="font-size:11px;color:#64748b;font-weight:600;">Home-Cooked Meals</div></td>
                <td style="text-align:center;padding:0 8px;"><div style="font-size:18px;margin-bottom:4px;">🔒</div><div style="font-size:11px;color:#64748b;font-weight:600;">24/7 Security</div></td>
                <td style="text-align:center;padding:0 8px;"><div style="font-size:18px;margin-bottom:4px;">📶</div><div style="font-size:11px;color:#64748b;font-weight:600;">Free Wifi</div></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#1a2e5a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <img src="${LOGO_URL}" alt="Murams Living" width="80" style="opacity:0.8;border-radius:6px;margin-bottom:10px;" />
            <div style="color:rgba(255,255,255,0.45);font-size:12px;line-height:1.7;">
              Rushikonda, Visakhapatnam, AP — 530045<br />
              <a href="mailto:info@muramsliving.com" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@muramsliving.com</a>
              &nbsp;·&nbsp;
              <a href="tel:+917816055655" style="color:rgba(255,255,255,0.45);text-decoration:none;">+91 7816055655</a>
            </div>
            <div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:10px;">
              This is an automated confirmation. Please call us directly to speak with our team.
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function bookingIdBlock(id?: string): string {
  if (!id) return "";
  return `<div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your Booking ID</div>
    <div style="display:inline-block;background:#f8fafc;border:2px dashed #e2e8f0;border-radius:12px;padding:10px 24px;font-family:monospace;font-size:20px;font-weight:700;color:#1a2e5a;letter-spacing:2px;">${id}</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:6px;">Save this ID for your reference</div>
  </div>`;
}

function callCta(phone: string): string {
  return `<div style="text-align:center;">
    <div style="color:#64748b;font-size:13px;margin-bottom:14px;">Can&rsquo;t wait? Call us directly.</div>
    <a href="tel:+917816055655" style="display:inline-block;background:#e8601c;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;">
      📞 &nbsp;+91 78160 55655
    </a>
    <div style="margin-top:10px;">
      <a href="tel:+917842222284" style="color:#94a3b8;font-size:12px;text-decoration:none;">Alternate: +91 78422 22284</a>
    </div>
  </div>`;
}

function buildStudentHtml(d: BookingEmailPayload): string {
  const buildingLabel = d.building === "gold" ? "Gold Building" : d.building === "silver" ? "Silver Building" : d.building;
  const buildingColor = d.building === "gold" ? "#d97706" : "#64748b";
  const roomTypeLabel = d.preferredRoomType === "ac" ? "❄️ AC Room" : d.preferredRoomType === "non-ac" ? "🌀 Non-AC Room" : null;

  const content = `
    <!-- Banner -->
    <tr>
      <td style="background:#1a2e5a;padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:26px;margin-bottom:6px;">🎓</div>
        <div style="color:#fff;font-size:21px;font-weight:700;margin-bottom:6px;">Room Request Received!</div>
        <div style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.6;">
          Hi <strong style="color:#fff;">${d.name}</strong>, we&rsquo;ve received your long-term room request.<br />
          Our team will call you within a few hours to confirm your spot.
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background:#fff;padding:36px 40px;">
        ${bookingIdBlock(d.bookingId)}

        <!-- Summary -->
        <div style="margin-bottom:28px;">
          <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">Booking Summary</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            ${row("Name", d.name)}
            ${row("Phone", d.phone)}
            ${rowHr()}
            ${rowBold("Building", buildingLabel, buildingColor)}
            ${d.roomGroup ? rowBold("Room Assigned", `Room ${d.roomGroup}`) : row("Room", "To be assigned after confirmation")}
            ${d.floorName ? row("Floor", d.floorName) : ""}
            ${d.sharing ? row("Sharing", `${d.sharing}-Sharing Room`) : ""}
            ${roomTypeLabel ? row("Room Type", roomTypeLabel) : ""}
            ${rowHr()}
            ${row("Check-in Date", fmtDate(d.checkInDate))}
            ${d.monthsStay ? rowBold("Stay Duration", `${d.monthsStay} Month${d.monthsStay !== 1 ? "s" : ""}`, "#16a34a") : ""}
            ${row("Booking Type", "Student / Long-term Stay")}
          </table>
        </div>

        <!-- Next steps -->
        <div style="margin-bottom:32px;">
          <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">What Happens Next?</div>
          ${step("1", "#e8601c", "We call you to confirm your room", `Expect a call on <strong>${d.phone}</strong> within a few hours. We&rsquo;ll confirm the room, dates, and pricing.`)}
          ${step("2", "#1a2e5a", "Get your documents ready", "Bring your Aadhaar / passport, 2 passport-size photos, college ID / admission letter, and an emergency contact.")}
          ${step("3", "#16a34a", "Security deposit on arrival", "Pay 1 month&rsquo;s rent as a refundable security deposit + the first month&rsquo;s rent when you move in.")}
        </div>

        ${callCta(d.phone)}
      </td>
    </tr>`;

  return emailShell(content);
}

function buildPublicHtml(d: BookingEmailPayload): string {
  const buildingLabel = d.building === "gold" ? "Gold Building" : d.building === "silver" ? "Silver Building" : d.building;
  const buildingColor = d.building === "gold" ? "#d97706" : "#64748b";
  const roomTypeLabel = d.preferredRoomType === "ac" ? "❄️ AC Room" : d.preferredRoomType === "non-ac" ? "🌀 Non-AC Room" : null;

  const content = `
    <!-- Banner -->
    <tr>
      <td style="background:#e8601c;padding:24px 40px;text-align:center;">
        <div style="font-size:26px;margin-bottom:6px;">🎉</div>
        <div style="color:#fff;font-size:21px;font-weight:700;margin-bottom:6px;">Stay Request Received!</div>
        <div style="color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">
          Hi <strong>${d.name}</strong>, we&rsquo;ve received your stay request.<br />
          Our team will call you shortly to confirm your booking.
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background:#fff;padding:36px 40px;">
        ${bookingIdBlock(d.bookingId)}

        <!-- Summary -->
        <div style="margin-bottom:28px;">
          <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">Booking Summary</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            ${row("Name", d.name)}
            ${row("Phone", d.phone)}
            ${rowHr()}
            ${rowBold("Building", buildingLabel, buildingColor)}
            ${d.adults !== undefined ? row("Adults", `${d.adults} Adult${d.adults !== 1 ? "s" : ""}`) : ""}
            ${d.children ? row("Children", `${d.children} Child${d.children !== 1 ? "ren" : ""}`) : ""}
            ${roomTypeLabel ? row("Room Preference", roomTypeLabel) : ""}
            ${rowHr()}
            ${row("Check-in Date", fmtDate(d.checkInDate))}
            ${d.checkOutDate ? row("Check-out Date", fmtDate(d.checkOutDate)) : ""}
            ${row("Booking Type", "Guest Stay")}
          </table>
        </div>

        <!-- Next steps -->
        <div style="margin-bottom:32px;">
          <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">What Happens Next?</div>
          ${step("1", "#e8601c", "Our team calls to confirm", `We will call <strong>${d.phone}</strong> within a few hours to confirm your stay.`)}
          ${step("2", "#1a2e5a", "Prepare your documents", "Keep your ID proof (Aadhaar / passport) and emergency contact details handy.")}
          ${step("3", "#16a34a", "Pay on arrival", "Bring the agreed amount when you arrive. No advance payment needed to hold the booking.")}
        </div>

        ${callCta(d.phone)}
      </td>
    </tr>`;

  return emailShell(content);
}

function buildHtml(d: BookingEmailPayload): string {
  return d.bookingType === "public" ? buildPublicHtml(d) : buildStudentHtml(d);
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingEmailPayload = await req.json();

    if (!body.email) {
      return NextResponse.json({ skipped: true, reason: "No email provided" });
    }

    const isPublic = body.bookingType === "public";
    const buildingLabel = body.building === "gold" ? "Gold" : body.building === "silver" ? "Silver" : body.building;
    const subject = isPublic
      ? `Booking Request Received — ${buildingLabel} Building · Murams Living`
      : `Room ${body.roomGroup ?? "Booking"} Request Received — Murams Living`;

    const html = buildHtml(body);

    const result = await sendEmail({
      to: body.email,
      subject,
      html,
      replyTo: "info@muramsliving.com",
    });

    if (!result.success) {
      console.error("[send-booking-email] Failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ success: true, provider: result.provider, from: result.from });
  } catch (err) {
    console.error("[send-booking-email] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
