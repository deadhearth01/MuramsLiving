import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/send-email";

export interface BookingEmailPayload {
  name: string;
  email: string;
  phone: string;
  roomGroup: string;
  building: "gold" | "silver";
  floorName: string;
  sharing: number;
  checkInDate?: string;
  checkInTime?: string;
}

function buildEmailHtml(data: BookingEmailPayload): string {
  const buildingLabel =
    data.building === "gold" ? "Gold Building" : "Silver Building";
  const buildingColor = data.building === "gold" ? "#d97706" : "#64748b";
  const checkIn = data.checkInDate
    ? new Date(data.checkInDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Flexible / To be confirmed";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Request Received — Murams Living</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="background:#1a2e5a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <!-- Logo -->
              <div style="margin-bottom:14px;">
                <img
                  src="https://lh3.google.com/u/0/d/1l41-k1jw-fAQ-yU0R5WuppT0awayFQq9=w400-h200-iv1"
                  alt="Murams Living"
                  width="160"
                  style="display:inline-block;max-width:160px;height:auto;border-radius:8px;"
                />
              </div>
              <div style="color:rgba(255,255,255,0.55);font-size:13px;">Rushikonda, Visakhapatnam</div>
            </td>
          </tr>

          <!-- Hero banner -->
          <tr>
            <td style="background:#e8601c;padding:28px 40px;text-align:center;">
              <div style="font-size:28px;margin-bottom:8px;">🎉</div>
              <div style="color:#ffffff;font-size:22px;font-weight:700;margin-bottom:6px;">Booking Request Received!</div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">
                Hi <strong>${data.name}</strong>, we&rsquo;ve received your booking request.<br />
                Our team will call you shortly to confirm your room.
              </div>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <!-- Booking summary -->
              <div style="margin-bottom:28px;">
                <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">Booking Summary</div>

                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                  ${row("Resident Name", data.name)}
                  ${row("Phone", data.phone)}
                  ${rowHr()}
                  ${rowColored("Room", `Room ${data.roomGroup}`, "#1a2e5a")}
                  ${rowColored("Building", buildingLabel, buildingColor)}
                  ${row("Floor", data.floorName)}
                  ${row("Room Type", `${data.sharing}-Sharing`)}
                  ${rowHr()}
                  ${row("Check-in Date", checkIn)}
                  ${data.checkInTime ? row("Check-in Time", formatTime(data.checkInTime)) : ""}
                </table>
              </div>

              <!-- What to do next -->
              <div style="margin-bottom:32px;">
                <div style="font-size:11px;font-weight:700;color:#e8601c;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">What Happens Next?</div>

                ${step("1", "#e8601c", "Our team calls to confirm", "We will call you on <strong>${data.phone}</strong> within a few hours to confirm your room booking.")}
                ${step("2", "#1a2e5a", "Prepare your documents", "Keep your ID proof (Aadhaar / passport), 2 passport-size photos, and emergency contact details ready.")}
                ${step("3", "#16a34a", "Pay your deposit on arrival", "Bring 1 month&rsquo;s rent as a security deposit along with the first month&rsquo;s payment when you check in.")}
              </div>

              <!-- Call CTA -->
              <div style="text-align:center;margin-bottom:8px;">
                <div style="color:#64748b;font-size:13px;margin-bottom:16px;">
                  Can&rsquo;t wait? Give us a call right now to speak with our team.
                </div>
                <a href="tel:+917816055655"
                   style="display:inline-block;background:#e8601c;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;letter-spacing:0.3px;">
                  📞 &nbsp;Call +91 78160 55655
                </a>
                <div style="margin-top:12px;">
                  <a href="tel:+917842222284"
                     style="color:#64748b;font-size:12px;text-decoration:none;">
                    Alternate: +91 78422 22284
                  </a>
                </div>
              </div>

            </td>
          </tr>

          <!-- Quick info strip -->
          <tr>
            <td style="background:#f8fafc;border:1.5px solid #e2e8f0;border-top:none;padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding:0 8px;">
                    <div style="font-size:18px;margin-bottom:4px;">🏖️</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;">1 km to Beach</div>
                  </td>
                  <td style="text-align:center;padding:0 8px;">
                    <div style="font-size:18px;margin-bottom:4px;">🍛</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;">Home-Cooked Meals</div>
                  </td>
                  <td style="text-align:center;padding:0 8px;">
                    <div style="font-size:18px;margin-bottom:4px;">🔒</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;">24/7 Security</div>
                  </td>
                  <td style="text-align:center;padding:0 8px;">
                    <div style="font-size:18px;margin-bottom:4px;">📶</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;">Free Wifi</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a2e5a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <div style="margin-bottom:10px;">
                <img
                  src="https://lh3.google.com/u/0/d/1l41-k1jw-fAQ-yU0R5WuppT0awayFQq9=w400-h200-iv1"
                  alt="Murams Living"
                  width="100"
                  style="display:inline-block;max-width:100px;height:auto;opacity:0.85;border-radius:6px;"
                />
              </div>
              <div style="color:rgba(255,255,255,0.5);font-size:12px;line-height:1.7;">
                Rushikonda, Visakhapatnam, Andhra Pradesh — 530045<br />
                <a href="mailto:info@muramsliving.com" style="color:rgba(255,255,255,0.5);text-decoration:none;">info@muramsliving.com</a>
                &nbsp;·&nbsp;
                <a href="tel:+917816055655" style="color:rgba(255,255,255,0.5);text-decoration:none;">+91 7816055655</a>
              </div>
              <div style="color:rgba(255,255,255,0.3);font-size:11px;margin-top:12px;">
                This is an automated confirmation of your booking request at Murams Living.<br />
                Please do not reply to this email — call us directly to speak with our team.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Helper functions for table rows ───────────────────────────────────────────

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;width:40%;background:#f8fafc;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;color:#1e293b;font-weight:500;border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

function rowColored(label: string, value: string, color: string) {
  return `<tr>
    <td style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;width:40%;background:#f8fafc;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;font-weight:700;color:${color};border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

function rowHr() {
  return `<tr><td colspan="2" style="padding:0;"><div style="height:3px;background:#f1f5f9;"></div></td></tr>`;
}

function step(num: string, color: string, title: string, desc: string) {
  return `<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
    <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${color};color:#ffffff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;line-height:28px;">${num}</div>
    <div>
      <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:2px;">${title}</div>
      <div style="font-size:12px;color:#64748b;line-height:1.6;">${desc}</div>
    </div>
  </div>`;
}

function formatTime(time: string) {
  try {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return time;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: BookingEmailPayload = await req.json();

    if (!body.email) {
      return NextResponse.json({ skipped: true, reason: "No email provided" });
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const subject = `Booking Request Received — Room ${body.roomGroup}, ${body.building === "gold" ? "Gold" : "Silver"} Building`;
    const html = buildEmailHtml(body);

    const recipients: string[] = [body.email];
    if (adminEmail && adminEmail !== body.email) recipients.push(adminEmail);

    const result = await sendEmail({ to: recipients, subject, html });

    if (!result.success) {
      console.error("Booking email failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking confirmation email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
