"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, User, Mail, Calendar, Clock, CheckCircle2,
  ChevronRight, ChevronLeft, Building2, Search, DoorOpen,
  MapPin, Users, Minus, Plus,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type BookingMode = "student" | "public";

type Step = 1 | 2 | 3 | 4;
type Sharing = "any" | "2" | "3" | "4" | "6";

interface RawRoom {
  id: string;
  room_no: string;
  building: "gold" | "silver";
  floor_name: string;
  floor_order: number;
  room_group: string;
  status: string;
}

interface RoomGroup {
  room_group: string;
  building: "gold" | "silver";
  floor_name: string;
  floor_order: number;
  capacity: number;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkInTime: string;
  preferredBuilding: "gold" | "silver" | "any";
  preferredSharing: Sharing;
}

const STUDENT_STEPS = [
  { id: 1, title: "Your Details",        sub: "Name, phone & preferences" },
  { id: 2, title: "Check Availability",  sub: "Search available rooms"    },
  { id: 3, title: "Select Room",         sub: "Pick your room"            },
  { id: 4, title: "Confirm Booking",     sub: "Review & submit"           },
];

const PUBLIC_STEPS = [
  { id: 1, title: "Your Details",        sub: "Name, phone & guests"      },
  { id: 2, title: "Select Building",     sub: "Choose preferred building"  },
  { id: 3, title: "Confirm Booking",     sub: "Review & submit"           },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(t: string) {
  try {
    return new Date(`2000-01-01T${t}`).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return t; }
}

function generateBookingId() {
  const prefix = "ML";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

// ── sub-components ────────────────────────────────────────────────────────────

function InputField({
  icon: Icon, label, required, children,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "w-full pl-11 pr-4 py-3 border border-surface-tertiary rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm";

// ── main page ─────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [bookingMode, setBookingMode] = useState<BookingMode>("student");
  const [modeLoaded, setModeLoaded]   = useState(false);
  const [step, setStep]               = useState<Step>(1);
  const [formData, setFormData]       = useState<FormData>({
    name: "", phone: "", email: "",
    checkInDate: "", checkInTime: "",
    preferredBuilding: "any", preferredSharing: "any",
  });
  const [adults, setAdults]     = useState(1);
  const [children, setChildren] = useState(0);
  const [availableGroups, setAvailableGroups] = useState<RoomGroup[]>([]);
  const [selectedGroup,   setSelectedGroup]   = useState<RoomGroup | null>(null);
  const [step3Building,   setStep3Building]   = useState<"gold" | "silver" | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error,    setError]    = useState("");

  const STEPS = bookingMode === "student" ? STUDENT_STEPS : PUBLIC_STEPS;
  const isPublic = bookingMode === "public";

  // Fetch booking mode from site_settings
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("value").eq("key", "booking_preference").single();
        if (data?.value) setBookingMode(data.value as BookingMode);
      } catch { /* default student */ }
      setModeLoaded(true);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckAvailability = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("rooms")
        .select("id, room_no, building, floor_name, floor_order, room_group, status")
        .order("floor_order")
        .order("room_no");

      if (err) throw err;
      const rooms: RawRoom[] = data || [];

      const groupMap: Record<string, { group: RoomGroup; hasAvailable: boolean }> = {};
      for (const r of rooms) {
        const key = `${r.building}::${r.room_group || r.room_no}`;
        if (!groupMap[key]) {
          groupMap[key] = {
            group: {
              room_group: r.room_group || r.room_no,
              building: r.building,
              floor_name: r.floor_name,
              floor_order: r.floor_order ?? 99,
              capacity: 0,
            },
            hasAvailable: false,
          };
        }
        groupMap[key].group.capacity += 1;
        if (r.status === "available") groupMap[key].hasAvailable = true;
      }

      let groups = Object.values(groupMap)
        .filter((g) => g.hasAvailable)
        .map((g) => g.group);

      if (formData.preferredBuilding !== "any") {
        groups = groups.filter((g) => g.building === formData.preferredBuilding);
      }
      if (formData.preferredSharing !== "any") {
        const target = parseInt(formData.preferredSharing);
        groups = groups.filter((g) => g.capacity === target);
      }

      setAvailableGroups(groups);
      setSelectedGroup(null);
      const hasGold   = groups.some((g) => g.building === "gold");
      const hasSilver = groups.some((g) => g.building === "silver");
      setStep3Building(hasGold && !hasSilver ? "gold" : !hasGold && hasSilver ? "silver" : null);
      setStep(3);
    } catch {
      setError("Failed to fetch availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const newBookingId = generateBookingId();
      const { error: dbError } = await supabase.from("bookings").insert({
        booking_id: newBookingId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        check_in_date: formData.checkInDate || null,
        check_in_time: formData.checkInTime || null,
        preferred_building: selectedGroup?.building || formData.preferredBuilding,
        selected_room_no: selectedGroup?.room_group || null,
        booking_type: bookingMode,
        adults: isPublic ? adults : 1,
        children: isPublic ? children : 0,
        notes: isPublic
          ? `${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}`
          : formData.preferredSharing !== "any"
          ? `Prefers ${formData.preferredSharing}-sharing room`
          : null,
        status: "pending",
      });

      if (dbError) throw dbError;

      if (formData.email && selectedGroup) {
        try {
          await fetch("/api/send-booking-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              roomGroup: selectedGroup.room_group,
              building: selectedGroup.building,
              floorName: selectedGroup.floor_name,
              sharing: selectedGroup.capacity,
              checkInDate: formData.checkInDate || undefined,
              checkInTime: formData.checkInTime || undefined,
            }),
          });
        } catch {
          console.warn("Booking confirmation email failed to send.");
        }
      }

      // Send admin notification (fire-and-forget)
      try {
        await fetch("/api/send-admin-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            building: selectedGroup?.building || formData.preferredBuilding,
            roomGroup: selectedGroup?.room_group || undefined,
            bookingType: bookingMode,
            bookingId: newBookingId,
            adults: isPublic ? adults : undefined,
            children: isPublic ? children : undefined,
            sharing: selectedGroup?.capacity || undefined,
            checkInDate: formData.checkInDate || undefined,
            checkInTime: formData.checkInTime || undefined,
          }),
        });
      } catch {
        console.warn("Admin notification email failed to send.");
      }

      setBookingId(newBookingId);
      setIsSubmitted(true);
    } catch {
      setError("Failed to submit booking. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const groupByFloor = (groups: RoomGroup[]) => {
    const floorMap: Record<string, { order: number; groups: RoomGroup[] }> = {};
    for (const g of groups) {
      const floor = g.floor_name || "Other";
      if (!floorMap[floor]) floorMap[floor] = { order: g.floor_order, groups: [] };
      floorMap[floor].groups.push(g);
    }
    return Object.entries(floorMap).sort((a, b) => a[1].order - b[1].order);
  };

  const goldGroups   = availableGroups.filter((g) => g.building === "gold");
  const silverGroups = availableGroups.filter((g) => g.building === "silver");

  // ── success screen ─────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-surface-tertiary p-10 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-navy mb-3">Request Sent!</h2>
          {bookingId && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-lg px-5 py-2.5 rounded-xl mb-4">
              Booking ID: {bookingId}
            </div>
          )}
          <p className="text-text-secondary mb-1">
            Thank you <strong className="text-navy">{formData.name}</strong>! We&apos;ve received your
            booking request
            {selectedGroup ? (
              <> for{" "}
                <strong className="text-navy">
                  Room {selectedGroup.room_group}{" "}
                  ({selectedGroup.building === "gold" ? "Gold" : "Silver"} Building)
                </strong>
              </>
            ) : isPublic && step3Building ? (
              <> for <strong className="text-navy">{step3Building === "gold" ? "Gold" : "Silver"} Building</strong></>
            ) : null}
            .
          </p>
          <p className="text-text-secondary mb-2 text-sm">
            Our team will call you on <strong>{formData.phone}</strong> to confirm.
          </p>
          {bookingId && (
            <p className="text-xs text-text-secondary mb-8">
              Please save your booking ID <strong>{bookingId}</strong> for reference.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+917816055655"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm"
            >
              <Phone size={16} /> Call to Confirm
            </a>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-secondary text-navy font-semibold rounded-xl hover:bg-surface-tertiary transition-all text-sm"
            >
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── left step sidebar ───────────────────────────────────────────────────────

  const StepSidebar = () => (
    <div className="sticky top-8">
      <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em] mb-6">Progress</p>
      <ol className="space-y-0">
        {STEPS.map((s, idx) => {
          const done    = step > s.id;
          const active  = step === s.id;
          const last    = idx === STEPS.length - 1;
          return (
            <li key={s.id} className="relative flex gap-4">
              {/* Connector line */}
              {!last && (
                <div
                  className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-8px)] transition-colors duration-300 ${
                    done ? "bg-primary" : "bg-surface-tertiary"
                  }`}
                />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  done   ? "bg-primary text-white shadow-md shadow-primary/25"
                  : active ? "bg-white border-2 border-primary text-primary shadow-md shadow-primary/10"
                  : "bg-white border-2 border-surface-tertiary text-text-secondary"
                }`}
              >
                {done ? <CheckCircle2 size={18} /> : s.id}
              </div>
              {/* Labels */}
              <div className={`pb-8 ${last ? "pb-0" : ""}`}>
                <p className={`text-sm font-semibold leading-tight mt-2 transition-colors ${
                  active ? "text-navy" : done ? "text-primary" : "text-text-secondary"
                }`}>
                  {s.title}
                </p>
                <p className={`text-xs mt-0.5 leading-snug ${
                  active ? "text-text-secondary" : "text-text-secondary/60"
                }`}>
                  {done && s.id === 1 && formData.name
                    ? formData.name
                    : done && s.id === 3 && selectedGroup
                    ? `Room ${selectedGroup.room_group}`
                    : s.sub}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Help box */}
      <div className="mt-8 p-4 bg-navy/5 rounded-2xl border border-navy/10">
        <p className="text-xs font-semibold text-navy mb-2">Need help?</p>
        <a
          href="tel:+917816055655"
          className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
        >
          <Phone size={12} /> +91 78160 55655
        </a>
        <a
          href="tel:+917842222284"
          className="flex items-center gap-2 text-xs text-text-secondary mt-1.5 hover:text-primary"
        >
          <Phone size={12} /> +91 78422 22284
        </a>
      </div>
    </div>
  );

  // ── right summary panel ─────────────────────────────────────────────────────

  const SummaryPanel = () => {
    const hasAnyData = formData.name || formData.phone || formData.checkInDate || selectedGroup;
    return (
      <div className="sticky top-8">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em] mb-5">Your Booking</p>

        <div className="bg-white rounded-2xl border border-surface-tertiary overflow-hidden shadow-sm">
          {/* Room/building badge */}
          {selectedGroup ? (
            <div className={`px-5 py-4 ${selectedGroup.building === "gold" ? "bg-yellow-50 border-b border-yellow-100" : "bg-slate-50 border-b border-slate-100"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${selectedGroup.building === "gold" ? "bg-yellow-500" : "bg-slate-400"}`} />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {selectedGroup.building === "gold" ? "Gold" : "Silver"} Building
                </span>
              </div>
              <p className="text-xl font-bold text-navy">Room {selectedGroup.room_group}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {selectedGroup.floor_name} &middot; {selectedGroup.capacity}-Sharing
              </p>
            </div>
          ) : isPublic && formData.preferredBuilding !== "any" ? (
            <div className={`px-5 py-4 ${formData.preferredBuilding === "gold" ? "bg-yellow-50 border-b border-yellow-100" : "bg-slate-50 border-b border-slate-100"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${formData.preferredBuilding === "gold" ? "bg-yellow-500" : "bg-slate-400"}`} />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Selected</span>
              </div>
              <p className="text-lg font-bold text-navy">
                {formData.preferredBuilding === "gold" ? "Gold" : "Silver"} Building
              </p>
            </div>
          ) : (
            <div className="px-5 py-4 bg-surface-primary border-b border-surface-tertiary text-center">
              <DoorOpen size={24} className="mx-auto text-text-secondary/40 mb-1.5" />
              <p className="text-xs text-text-secondary">{isPublic ? "Building not selected yet" : "Room not selected yet"}</p>
            </div>
          )}

          {/* Details */}
          <div className="p-5 space-y-3">
            {!hasAnyData ? (
              <p className="text-xs text-text-secondary/60 text-center py-4">
                Fill in your details to see a summary here.
              </p>
            ) : (
              <>
                {formData.name && (
                  <SummaryRow icon={User} label="Name" value={formData.name} />
                )}
                {formData.phone && (
                  <SummaryRow icon={Phone} label="Phone" value={formData.phone} />
                )}
                {formData.email && (
                  <SummaryRow icon={Mail} label="Email" value={formData.email} />
                )}
                {formData.checkInDate && (
                  <SummaryRow icon={Calendar} label="Check-in" value={formatDate(formData.checkInDate)} />
                )}
                {formData.checkInTime && (
                  <SummaryRow icon={Clock} label="Time" value={formatTime(formData.checkInTime)} />
                )}
                {formData.preferredBuilding !== "any" && (
                  <SummaryRow
                    icon={Building2}
                    label="Building"
                    value={formData.preferredBuilding === "gold" ? "Gold Building" : "Silver Building"}
                  />
                )}
                {!isPublic && formData.preferredSharing !== "any" && (
                  <SummaryRow
                    icon={Users}
                    label="Room Type"
                    value={`${formData.preferredSharing}-Sharing`}
                  />
                )}
                {isPublic && (adults > 0 || children > 0) && (
                  <SummaryRow
                    icon={Users}
                    label="Guests"
                    value={`${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}`}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Murams note */}
        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Rushikonda, Visakhapatnam — 1 km from the beach
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="relative bg-navy-dark text-white py-14 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">Book a Room</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              {isPublic ? "Book Your Stay" : "Check Availability"}
            </h1>
            <p className="text-white/60 max-w-lg">
              {isPublic
                ? "Fill in your details, choose your preferred building, and we\u2019ll take care of the rest."
                : "Fill in your details, check what\u2019s available, and reserve your spot at Murams Living."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile step strip ───────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-surface-tertiary px-4 py-3">
        <div className="flex items-center gap-0 max-w-md mx-auto">
          {STEPS.map((s, idx) => {
            const done   = step > s.id;
            const active = step === s.id;
            const last   = idx === STEPS.length - 1;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    done   ? "bg-primary text-white"
                    : active ? "bg-white border-2 border-primary text-primary"
                    : "bg-surface-secondary border-2 border-surface-tertiary text-text-secondary"
                  }`}>
                    {done ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                    active ? "text-primary" : done ? "text-primary/70" : "text-text-secondary/50"
                  }`}>
                    {s.title.split(" ")[0]}
                  </span>
                </div>
                {!last && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${done ? "bg-primary" : "bg-surface-tertiary"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3-column layout ─────────────────────────────────────── */}
      <div className="container-custom py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[220px,1fr,280px] lg:gap-8 xl:gap-10">

          {/* LEFT: Step sidebar (desktop only) */}
          <div className="hidden lg:block">
            <StepSidebar />
          </div>

          {/* CENTER: Form content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Your Details ──────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8"
                >
                  <div className="mb-7">
                    <h2 className="text-xl font-bold text-navy">Tell us about yourself</h2>
                    <p className="text-text-secondary text-sm mt-1">Fill in your contact details and preferences.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField icon={User} label="Full Name" required>
                        <input
                          type="text" name="name" required
                          value={formData.name} onChange={handleChange}
                          className={inputCls} placeholder="Your full name"
                        />
                      </InputField>
                      <InputField icon={Phone} label="Phone Number" required>
                        <input
                          type="tel" name="phone" required
                          value={formData.phone} onChange={handleChange}
                          className={inputCls} placeholder="10-digit mobile number"
                        />
                      </InputField>
                    </div>

                    <InputField icon={Mail} label="Email Address">
                      <input
                        type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        className={inputCls} placeholder="Optional — for booking confirmation email"
                      />
                    </InputField>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField icon={Calendar} label="Preferred Check-in Date">
                        <input
                          type="date" name="checkInDate"
                          value={formData.checkInDate} onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          className={inputCls}
                        />
                      </InputField>
                      <InputField icon={Clock} label="Preferred Check-in Time">
                        <input
                          type="time" name="checkInTime"
                          value={formData.checkInTime} onChange={handleChange}
                          className={inputCls}
                        />
                      </InputField>
                    </div>

                    {/* Building preference */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-3">Preferred Building</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "any",    label: "Any",    sub: "No preference", dot: "bg-navy/30" },
                          { value: "gold",   label: "Gold",   sub: "Premium",       dot: "bg-yellow-500" },
                          { value: "silver", label: "Silver", sub: "Great value",   dot: "bg-slate-400" },
                        ].map((b) => (
                          <button
                            key={b.value} type="button"
                            onClick={() => setFormData({ ...formData, preferredBuilding: b.value as FormData["preferredBuilding"] })}
                            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all text-center ${
                              formData.preferredBuilding === b.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-surface-tertiary text-text-secondary hover:border-primary/30 hover:bg-surface-primary"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${b.dot}`} />
                            <div>
                              <p className="text-xs font-bold">{b.label}</p>
                              <p className="text-[10px] opacity-60 mt-0.5">{b.sub}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Student: Sharing preference / Public: Guest count */}
                    {isPublic ? (
                      <div>
                        <label className="block text-sm font-medium text-navy mb-3">Number of Guests</label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-surface-tertiary">
                            <div>
                              <p className="text-sm font-semibold text-navy">Adults</p>
                              <p className="text-xs text-text-secondary">Age 13+</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-8 h-8 rounded-lg border border-surface-tertiary flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                                disabled={adults <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-bold text-navy text-lg">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(Math.min(10, adults + 1))}
                                className="w-8 h-8 rounded-lg border border-surface-tertiary flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-surface-tertiary">
                            <div>
                              <p className="text-sm font-semibold text-navy">Children</p>
                              <p className="text-xs text-text-secondary">Age 0–12</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-8 h-8 rounded-lg border border-surface-tertiary flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                                disabled={children <= 0}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-bold text-navy text-lg">{children}</span>
                              <button
                                type="button"
                                onClick={() => setChildren(Math.min(10, children + 1))}
                                className="w-8 h-8 rounded-lg border border-surface-tertiary flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1">Preferred Room Type</label>
                        <p className="text-xs text-text-secondary mb-3">How many people in a room?</p>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {([
                            { value: "any", label: "Any",  sub: "No preference" },
                            { value: "2",   label: "2×",   sub: "2-sharing" },
                            { value: "3",   label: "3×",   sub: "3-sharing" },
                            { value: "4",   label: "4×",   sub: "4-sharing" },
                            { value: "6",   label: "6×",   sub: "6-sharing" },
                          ] as { value: Sharing; label: string; sub: string }[]).map((opt) => (
                            <button
                              key={opt.value} type="button"
                              onClick={() => setFormData({ ...formData, preferredSharing: opt.value })}
                              className={`flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border-2 transition-all text-center ${
                                formData.preferredSharing === opt.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-surface-tertiary text-text-secondary hover:border-primary/30 hover:bg-surface-primary"
                              }`}
                            >
                              <span className="font-bold text-sm">{opt.label}</span>
                              <span className="text-[10px] opacity-60 leading-tight">{opt.sub}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-surface-tertiary">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.name || !formData.phone}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/25 text-sm"
                    >
                      {isPublic ? "Choose Building" : "Continue to Availability"}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2 ────────────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8"
                >
                  {isPublic ? (
                    /* ── PUBLIC: Building Selection ── */
                    <>
                      <div className="mb-7">
                        <h2 className="text-xl font-bold text-navy">Select Building</h2>
                        <p className="text-text-secondary text-sm mt-1">Choose which building you&apos;d like to stay in.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {[
                          { value: "gold"   as const, label: "Gold Building",   desc: "Premium rooms with modern amenities", dot: "bg-yellow-500" },
                          { value: "silver" as const, label: "Silver Building", desc: "Comfortable rooms at great value",    dot: "bg-slate-400"  },
                        ].map(({ value, label, desc, dot }) => (
                          <button
                            key={value} type="button"
                            onClick={() => setFormData({ ...formData, preferredBuilding: value })}
                            className={`relative flex flex-col items-start gap-3 p-6 rounded-2xl border-2 text-left transition-all ${
                              formData.preferredBuilding === value
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-surface-tertiary bg-white hover:border-primary/40 hover:shadow-md"
                            }`}
                          >
                            <span className={`w-10 h-10 rounded-full ${dot} flex items-center justify-center`}>
                              <span className="w-4 h-4 rounded-full bg-white/60" />
                            </span>
                            <div>
                              <p className="font-bold text-navy">{label}</p>
                              <p className="text-sm text-text-secondary mt-0.5">{desc}</p>
                            </div>
                            {formData.preferredBuilding === value && (
                              <CheckCircle2 size={20} className="absolute top-4 right-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setStep(3 as Step)}
                        disabled={formData.preferredBuilding === "any"}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/25 text-sm"
                      >
                        Continue to Confirm <ChevronRight size={18} />
                      </button>

                      <button
                        onClick={() => setStep(1)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-3 text-text-secondary hover:text-navy transition-colors text-sm"
                      >
                        <ChevronLeft size={15} /> Edit Details
                      </button>
                    </>
                  ) : (
                    /* ── STUDENT: Check Availability ── */
                    <>
                      <div className="mb-7">
                        <h2 className="text-xl font-bold text-navy">Check Availability</h2>
                        <p className="text-text-secondary text-sm mt-1">
                          We&apos;ll search for rooms in{" "}
                          {formData.preferredBuilding === "any"
                            ? "both buildings"
                            : `the ${formData.preferredBuilding === "gold" ? "Gold" : "Silver"} Building`}
                          {formData.preferredSharing !== "any" ? ` matching ${formData.preferredSharing}-sharing` : ""}.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {[
                          formData.preferredBuilding !== "any" && `${formData.preferredBuilding === "gold" ? "Gold" : "Silver"} Building`,
                          formData.preferredSharing !== "any" && `${formData.preferredSharing}-sharing`,
                          formData.checkInDate && `Check-in: ${formatDate(formData.checkInDate)}`,
                        ].filter(Boolean).map((chip) => (
                          <span key={String(chip)} className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                            {chip}
                          </span>
                        ))}
                        {formData.preferredBuilding === "any" && formData.preferredSharing === "any" && !formData.checkInDate && (
                          <span className="px-3 py-1.5 bg-surface-secondary text-text-secondary text-xs rounded-full">
                            No preferences set — showing all available rooms
                          </span>
                        )}
                      </div>

                      {error && (
                        <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
                      )}

                      <button
                        onClick={handleCheckAvailability}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-navy text-white font-bold rounded-xl hover:bg-navy-dark transition-all shadow-lg disabled:opacity-60 text-sm"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Checking availability...
                          </>
                        ) : (
                          <>
                            <Search size={18} />
                            Check Room Availability
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setStep(1)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-3 text-text-secondary hover:text-navy transition-colors text-sm"
                      >
                        <ChevronLeft size={15} /> Edit Details
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── STEP 3: Select Room (Student) / Confirm (Public) ── */}
              {step === 3 && isPublic && (
                <motion.div
                  key="step3-public"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy">Confirm Your Booking</h2>
                    <p className="text-text-secondary text-sm mt-1">Review everything before sending your request.</p>
                  </div>

                  {/* Building highlight */}
                  <div className={`rounded-xl p-5 mb-6 border ${
                    formData.preferredBuilding === "gold"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full flex-shrink-0 ${
                        formData.preferredBuilding === "gold" ? "bg-yellow-500" : "bg-slate-400"
                      }`} />
                      <div>
                        <p className="font-bold text-navy text-lg">
                          {formData.preferredBuilding === "gold" ? "Gold" : "Silver"} Building
                        </p>
                        <p className="text-sm text-text-secondary">
                          {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="bg-surface-primary rounded-xl p-5 mb-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Name",          value: formData.name },
                        { label: "Phone",         value: formData.phone },
                        { label: "Email",         value: formData.email || "Not provided" },
                        {
                          label: "Check-in Date",
                          value: formData.checkInDate ? formatDate(formData.checkInDate) : "Flexible",
                        },
                        {
                          label: "Check-in Time",
                          value: formData.checkInTime ? formatTime(formData.checkInTime) : "Flexible",
                        },
                        {
                          label: "Guests",
                          value: `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}`,
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-text-secondary uppercase tracking-wide">{item.label}</p>
                          <p className="font-semibold text-navy text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
                    <strong>Note:</strong> This is a booking request, not a confirmed reservation. Our team will call{" "}
                    <strong>{formData.phone}</strong> within 24 hours to confirm and finalise your stay.
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-surface-tertiary text-navy font-semibold rounded-xl hover:bg-surface-primary text-sm"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/25 text-sm"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Send Booking Request
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
              {step === 3 && !isPublic && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* No rooms found */}
                  {availableGroups.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-10 text-center">
                      <DoorOpen size={40} className="mx-auto mb-4 text-text-secondary/30" />
                      <p className="font-semibold text-navy mb-1">No rooms found</p>
                      <p className="text-sm text-text-secondary mb-6">
                        {formData.preferredSharing !== "any"
                          ? "Try a different room type or call us — we may have unlisted options."
                          : "Please call us to check availability."}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {formData.preferredSharing !== "any" && (
                          <button
                            onClick={() => { setFormData({ ...formData, preferredSharing: "any" }); setStep(2); }}
                            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 text-sm"
                          >
                            Try Any Room Type
                          </button>
                        )}
                        <a href="tel:+917816055655" className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl text-sm">
                          <Phone size={15} /> Call Us Now
                        </a>
                      </div>
                      <button onClick={() => setStep(2)} className="mt-4 flex items-center justify-center gap-2 w-full py-3 text-text-secondary hover:text-navy text-sm">
                        <ChevronLeft size={15} /> Back
                      </button>
                    </div>

                  /* Building picker */
                  ) : !step3Building ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-navy">Choose a Building</h2>
                        <p className="text-text-secondary text-sm mt-1">Select which building you&apos;d like to stay in.</p>
                      </div>

                      {formData.preferredSharing !== "any" && (
                        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs text-primary font-medium">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          Showing {formData.preferredSharing}-sharing rooms only
                          <button onClick={() => setFormData({ ...formData, preferredSharing: "any" })} className="ml-1 text-primary/60 hover:text-primary underline">
                            Clear
                          </button>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { value: "gold"   as const, label: "Gold Building",   desc: "Premium rooms with modern amenities", dot: "bg-yellow-500", countColor: "text-yellow-700", countBg: "bg-yellow-50" },
                          { value: "silver" as const, label: "Silver Building", desc: "Comfortable rooms at great value",    dot: "bg-slate-400",  countColor: "text-slate-700",  countBg: "bg-slate-50"  },
                        ].map(({ value, label, desc, dot, countColor, countBg }) => {
                          const count    = availableGroups.filter((g) => g.building === value).length;
                          const disabled = count === 0;
                          return (
                            <button
                              key={value} disabled={disabled}
                              onClick={() => setStep3Building(value)}
                              className={`relative flex flex-col items-start gap-3 p-6 rounded-2xl border-2 text-left transition-all ${
                                disabled
                                  ? "border-surface-tertiary bg-surface-primary opacity-50 cursor-not-allowed"
                                  : "border-surface-tertiary bg-white hover:border-primary/40 hover:shadow-md"
                              }`}
                            >
                              <span className={`w-10 h-10 rounded-full ${dot} flex items-center justify-center`}>
                                <span className="w-4 h-4 rounded-full bg-white/60" />
                              </span>
                              <div>
                                <p className="font-bold text-navy">{label}</p>
                                <p className="text-sm text-text-secondary mt-0.5">{desc}</p>
                              </div>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${disabled ? "bg-gray-100 text-gray-400" : `${countBg} ${countColor}`}`}>
                                {disabled ? "No rooms" : `${count} room${count !== 1 ? "s" : ""} available`}
                              </span>
                              {!disabled && <ChevronRight size={18} className="absolute top-1/2 -translate-y-1/2 right-5 text-text-secondary" />}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-3 text-text-secondary hover:text-navy text-sm"
                      >
                        <ChevronLeft size={15} /> Back to Availability
                      </button>
                    </div>

                  /* Room list */
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <button
                          onClick={() => { setStep3Building(null); setSelectedGroup(null); }}
                          className="w-8 h-8 rounded-xl bg-surface-primary hover:bg-surface-secondary flex items-center justify-center flex-shrink-0"
                        >
                          <ChevronLeft size={15} className="text-navy" />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-full flex-shrink-0 ${step3Building === "gold" ? "bg-yellow-500" : "bg-slate-400"}`} />
                          <div>
                            <p className="font-bold text-navy leading-tight">
                              {step3Building === "gold" ? "Gold" : "Silver"} Building
                            </p>
                            <p className="text-xs text-text-secondary">
                              {availableGroups.filter((g) => g.building === step3Building).length} rooms
                              {formData.preferredSharing !== "any" ? ` · ${formData.preferredSharing}-sharing` : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {groupByFloor(availableGroups.filter((g) => g.building === step3Building)).map(([floor, { groups: fg }]) => (
                          <div key={floor}>
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <Building2 size={11} /> {floor}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {fg.map((g) => {
                                const sel = selectedGroup?.room_group === g.room_group && selectedGroup?.building === g.building;
                                return (
                                  <button
                                    key={`${g.building}::${g.room_group}`}
                                    onClick={() => setSelectedGroup(g)}
                                    className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${
                                      sel
                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                        : "border-surface-tertiary bg-white hover:border-primary/40 hover:bg-surface-primary"
                                    }`}
                                  >
                                    {sel
                                      ? <CheckCircle2 size={15} className="absolute top-3 right-3 text-primary" />
                                      : <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400" />
                                    }
                                    <span className={`font-bold text-sm ${sel ? "text-primary" : "text-navy"}`}>
                                      Room {g.room_group}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                      sel ? "bg-primary/10 text-primary" : "bg-surface-secondary text-text-secondary"
                                    }`}>
                                      {g.capacity}-Sharing
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected room CTA */}
                  {step3Building && (
                    <>
                      {selectedGroup && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs text-text-secondary mb-0.5">Selected</p>
                            <p className="font-bold text-navy">
                              Room {selectedGroup.room_group} &mdash;{" "}
                              {selectedGroup.building === "gold" ? "Gold" : "Silver"} Building
                            </p>
                            <p className="text-xs text-text-secondary">
                              {selectedGroup.floor_name} &middot; {selectedGroup.capacity}-Sharing
                            </p>
                          </div>
                          <CheckCircle2 size={28} className="text-primary flex-shrink-0" />
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-surface-tertiary text-navy font-semibold rounded-xl hover:bg-surface-primary transition-all text-sm"
                        >
                          <ChevronLeft size={16} /> Back
                        </button>
                        <button
                          onClick={() => setStep(4)}
                          disabled={!selectedGroup}
                          className="flex-[2] flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-40 shadow-lg shadow-primary/25 text-sm"
                        >
                          Confirm Selection <ChevronRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── STEP 4: Confirm (Student mode only) ─────── */}
              {step === 4 && !isPublic && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-surface-tertiary p-6 lg:p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy">Confirm Your Booking</h2>
                    <p className="text-text-secondary text-sm mt-1">Review everything before sending your request.</p>
                  </div>

                  {/* Room highlight */}
                  <div className={`rounded-xl p-5 mb-6 border ${
                    selectedGroup?.building === "gold"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full flex-shrink-0 ${
                        selectedGroup?.building === "gold" ? "bg-yellow-500" : "bg-slate-400"
                      }`} />
                      <div>
                        <p className="font-bold text-navy text-lg">Room {selectedGroup?.room_group}</p>
                        <p className="text-sm text-text-secondary">
                          {selectedGroup?.building === "gold" ? "Gold" : "Silver"} Building &middot;{" "}
                          {selectedGroup?.floor_name} &middot; {selectedGroup?.capacity}-Sharing
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="bg-surface-primary rounded-xl p-5 mb-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Name",          value: formData.name },
                        { label: "Phone",         value: formData.phone },
                        { label: "Email",         value: formData.email || "Not provided" },
                        {
                          label: "Check-in Date",
                          value: formData.checkInDate ? formatDate(formData.checkInDate) : "Flexible",
                        },
                        {
                          label: "Check-in Time",
                          value: formData.checkInTime ? formatTime(formData.checkInTime) : "Flexible",
                        },
                        {
                          label: "Room Type",
                          value: formData.preferredSharing === "any" ? "No preference" : `${formData.preferredSharing}-Sharing`,
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-text-secondary uppercase tracking-wide">{item.label}</p>
                          <p className="font-semibold text-navy text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
                    <strong>Note:</strong> This is a booking request, not a confirmed reservation. Our team will call{" "}
                    <strong>{formData.phone}</strong> within 24 hours to confirm and finalise your stay.
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-surface-tertiary text-navy font-semibold rounded-xl hover:bg-surface-primary text-sm"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/25 text-sm"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Send Booking Request
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT: Summary panel (desktop only) */}
          <div className="hidden lg:block">
            <SummaryPanel />
          </div>

          {/* Mobile summary (shown below form) */}
          {(formData.name || formData.phone || selectedGroup) && (
            <div className="lg:hidden mt-6 bg-white rounded-2xl border border-surface-tertiary overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-surface-tertiary bg-surface-primary">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.12em]">Your Booking So Far</p>
              </div>
              <div className="p-5 space-y-3">
                {formData.name   && <SummaryRow icon={User}     label="Name"     value={formData.name}   />}
                {formData.phone  && <SummaryRow icon={Phone}    label="Phone"    value={formData.phone}  />}
                {formData.checkInDate && <SummaryRow icon={Calendar} label="Check-in" value={formatDate(formData.checkInDate)} />}
                {selectedGroup && (
                  <SummaryRow
                    icon={DoorOpen}
                    label="Room"
                    value={`Room ${selectedGroup.room_group} · ${selectedGroup.building === "gold" ? "Gold" : "Silver"}`}
                  />
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── SummaryRow helper ─────────────────────────────────────────────────────────

function SummaryRow({
  icon: Icon, label, value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-surface-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-text-secondary uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-sm font-semibold text-navy truncate">{value}</p>
      </div>
    </div>
  );
}
