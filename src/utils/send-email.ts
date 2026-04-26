interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface SendResult {
  success: boolean;
  provider?: "resend" | "smtp";
  from?: string;
  error?: string;
}

async function trySendResend(
  apiKey: string,
  from: string,
  to: string[],
  subject: string,
  html: string,
  replyTo?: string,
): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  });
  const body = await res.json().catch(() => ({})) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, body };
}

export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  const resendKey = process.env.NEXT_RESEND_API_KEY;
  const to = Array.isArray(payload.to) ? payload.to : [payload.to];

  // Primary from: env-configured > payload > default custom domain
  const primaryFrom =
    process.env.RESEND_FROM_EMAIL ??
    payload.from ??
    "Murams Living <noreply@muramsliving.com>";

  // Fallback from: Resend's own verified shared sender — works for ANY recipient
  // without domain DNS setup. Used automatically when the custom domain fails.
  const fallbackFrom = "Murams Living <onboarding@resend.dev>";

  if (resendKey) {
    try {
      // 1st attempt — custom domain
      const r1 = await trySendResend(resendKey, primaryFrom, to, payload.subject, payload.html, payload.replyTo);

      if (r1.ok) {
        return { success: true, provider: "resend", from: primaryFrom };
      }

      console.warn(
        `[sendEmail] Resend attempt 1 failed (${r1.status}) from="${primaryFrom}":`,
        r1.body,
      );

      // Domain not verified (403) or validation error (422) — retry with shared sender
      if ((r1.status === 403 || r1.status === 422) && primaryFrom !== fallbackFrom) {
        console.info("[sendEmail] Retrying with Resend shared sender:", fallbackFrom);
        const r2 = await trySendResend(resendKey, fallbackFrom, to, payload.subject, payload.html, payload.replyTo);

        if (r2.ok) {
          console.info("[sendEmail] Resend shared sender succeeded.");
          return { success: true, provider: "resend", from: fallbackFrom };
        }

        console.error(
          `[sendEmail] Resend attempt 2 failed (${r2.status}) from="${fallbackFrom}":`,
          r2.body,
        );
      }
    } catch (e) {
      console.error("[sendEmail] Resend fetch threw:", e);
    }
  }

  // SMTP fallback
  try {
    const nodemailer = await import("nodemailer");
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT ?? "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS?.split("#")[0].trim();

    if (!host || !user || !pass) {
      return { success: false, error: "No email transport configured (Resend key missing/invalid, SMTP not set)" };
    }

    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,
      to: to.join(", "),
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo ?? user,
    });

    return { success: true, provider: "smtp", from: user };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[sendEmail] SMTP fallback failed:", msg);
    return { success: false, error: msg };
  }
}
