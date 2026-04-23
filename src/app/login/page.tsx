"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col lg:flex-row">
      {/* ── LEFT: Brand panel (desktop only) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-dark">
        {/* Decorative glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Brand mark */}
          <Link href="/" className="inline-flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-2 group-hover:bg-white/15 transition-colors">
              <Image
                src="/logo.png"
                alt="Murams Living"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-heading text-white text-lg font-bold tracking-tight">
              Murams Living
            </span>
          </Link>

          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-5">
              <ShieldCheck size={13} className="text-primary-light" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Internal Access Only
              </span>
            </div>
            <h1 className="font-heading text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4">
              Management
              <br />
              <span className="text-primary-light">Console.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Restricted area for authorised staff. Use your admin credentials
              to access bookings, residents, payments and reports.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span>© Murams Living</span>
            <span>Rushikonda, Visakhapatnam</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Top nav — Go Home */}
        <div className="flex items-center justify-between p-5 lg:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-tertiary text-text-secondary hover:text-navy hover:border-navy/20 text-sm font-medium transition-all group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Go Home
          </Link>

          {/* Mobile-only internal notice */}
          <div className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider">
            <ShieldCheck size={11} />
            Staff Only
          </div>
        </div>

        {/* Form body */}
        <div className="flex-1 flex items-center justify-center p-5 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            {/* Mobile brand mark */}
            <div className="lg:hidden flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center p-3 mb-3 shadow-lg shadow-navy/20">
                <Image
                  src="/logo.png"
                  alt="Murams Living"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <p className="font-heading text-navy text-lg font-bold">
                Murams Living
              </p>
            </div>

            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                Sign In
              </p>
              <h2 className="font-heading text-navy text-3xl font-bold mb-2">
                Welcome back.
              </h2>
              <p className="text-text-secondary text-sm mb-8">
                Enter your admin credentials to continue.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-surface-tertiary rounded-xl text-navy placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="admin@muramsliving.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-surface-tertiary rounded-xl text-navy placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Security notice */}
            <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-navy/5 border border-navy/10">
              <ShieldCheck
                size={16}
                className="text-navy mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-navy mb-0.5">
                  Internal access only
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  This portal is reserved for Murams Living staff. All activity
                  is logged and monitored.
                </p>
              </div>
            </div>

            <p className="text-center text-text-muted text-[11px] mt-6">
              Murams Living Management System
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
