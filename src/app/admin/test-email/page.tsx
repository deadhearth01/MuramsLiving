"use client";

import { useState } from "react";
import { Send, CheckCircle2, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TestResult {
  success: boolean;
  to?: string;
  provider?: string;
  from?: string;
  error?: string;
}

export default function TestEmailPage() {
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleSend = async () => {
    if (!to.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Network error — could not reach the API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-navy-dark px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Email Delivery Test</h1>
                <p className="text-white/50 text-xs mt-0.5">Send a test email to verify SMTP / Resend setup</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={to}
                onChange={(e) => { setTo(e.target.value); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="someone@example.com"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !to.trim()}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm shadow-primary/25"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending…</>
                ) : (
                  <><Send size={15} /> Send Test</>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Enter any email address — a test message will be delivered to that inbox.
            </p>
          </div>

          {/* Result */}
          {result && (
            <div className={`mx-6 mb-6 rounded-xl border p-4 ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                {result.success
                  ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  : <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                }
                <div className="min-w-0">
                  <p className={`font-semibold text-sm ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.success ? "Email sent successfully!" : "Email delivery failed"}
                  </p>
                  {result.success && (
                    <div className="mt-2 space-y-1 text-xs text-green-700">
                      <p><span className="font-medium">To:</span> {result.to}</p>
                      <p><span className="font-medium">Via:</span> {result.provider ?? "unknown"}</p>
                      <p><span className="font-medium">From:</span> {result.from ?? "—"}</p>
                    </div>
                  )}
                  {!result.success && (
                    <p className="mt-1 text-xs text-red-700 break-words">{result.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Config hints */}
          <div className="border-t border-gray-100 p-6 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Environment Variables</p>
            {[
              { key: "NEXT_RESEND_API_KEY",       note: "Resend API key (primary transport)" },
              { key: "RESEND_FROM_EMAIL",          note: "Override sender address (use verified domain)" },
              { key: "ADMIN_NOTIFICATION_EMAIL",   note: "Where new booking alerts are sent" },
              { key: "SMTP_HOST",                  note: "SMTP server (fallback if Resend fails)" },
              { key: "SMTP_USER / SMTP_PASS",      note: "SMTP credentials" },
            ].map((v) => (
              <div key={v.key} className="flex items-start gap-2">
                <code className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono flex-shrink-0">
                  {v.key}
                </code>
                <span className="text-xs text-gray-400">{v.note}</span>
              </div>
            ))}

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
              <strong>Domain not verified?</strong> Emails from <code>noreply@muramsliving.com</code> will only
              deliver to the Resend account owner. The system automatically retries with Resend&apos;s shared
              sender. To fix permanently: add <strong>RESEND_FROM_EMAIL</strong> with a verified domain address,
              or verify <code>muramsliving.com</code> in your Resend dashboard (Settings → Domains → Add DNS records).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
