interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const resendKey = process.env.NEXT_RESEND_API_KEY;
  const fromAddress = payload.from ?? `Murams Living <noreply@muramsliving.com>`;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: Array.isArray(payload.to) ? payload.to : [payload.to],
          subject: payload.subject,
          html: payload.html,
          reply_to: payload.replyTo,
        }),
      });

      if (res.ok) return { success: true };

      const err = await res.json().catch(() => ({}));
      console.error("[sendEmail] Resend error:", err);
    } catch (e) {
      console.error("[sendEmail] Resend fetch failed:", e);
    }
  }

  // SMTP fallback via nodemailer
  try {
    const nodemailer = await import("nodemailer");
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT ?? "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS?.split("#")[0].trim();

    if (!host || !user || !pass) {
      return { success: false, error: "No email transport configured" };
    }

    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,
      to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo ?? user,
    });

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[sendEmail] SMTP fallback failed:", msg);
    return { success: false, error: msg };
  }
}
