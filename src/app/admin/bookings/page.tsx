"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Phone, Calendar, Building2, CheckCircle, XCircle, Clock, Search, Filter, MessageSquare, GraduationCap, Globe } from "lucide-react";
import { logActivity } from "@/utils/activity-logger";

type BookingPreference = "student" | "public";

interface Booking {
  id: string;
  booking_id: string;
  name: string;
  phone: string;
  email: string;
  check_in_date: string;
  check_in_time: string;
  preferred_building: string;
  selected_room_no: string;
  status: string;
  notes: string;
  admin_notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingPref, setBookingPref] = useState<BookingPreference>("student");
  const [prefLoading, setPrefLoading] = useState(false);

  // Fetch booking preference
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("value").eq("key", "booking_preference").single();
        if (data?.value) setBookingPref(data.value as BookingPreference);
      } catch { /* default stays student */ }
    })();
  }, []);

  const toggleBookingPref = async () => {
    const newVal: BookingPreference = bookingPref === "student" ? "public" : "student";
    setPrefLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("site_settings").update({ value: newVal, updated_at: new Date().toISOString() }).eq("key", "booking_preference");
      setBookingPref(newVal);
    } catch { /* silently fail */ }
    setPrefLoading(false);
  };

  const fetchBookings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          b.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status, admin_notes: notes || "", updated_at: new Date().toISOString() })
      .eq("id", id);
    logActivity(`update`, "bookings", `Booking ${id} marked as ${status}`);
    await fetchBookings();
    setSelectedBooking(null);
    setSaving(false);
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            {bookings.length} total · {bookings.filter((b) => b.status === "pending").length} pending
          </p>
        </div>

        {/* Booking Page Preference Toggle */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-xs font-medium text-gray-500">Booking Page:</span>
          <div className="flex rounded-lg bg-gray-100 p-0.5">
            <button
              onClick={bookingPref !== "student" ? toggleBookingPref : undefined}
              disabled={prefLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                bookingPref === "student"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap size={13} /> Student
            </button>
            <button
              onClick={bookingPref !== "public" ? toggleBookingPref : undefined}
              disabled={prefLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                bookingPref === "public"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe size={13} /> Public
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Booking ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Check-in</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Room</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Received</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        {booking.booking_id || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {booking.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{booking.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <a href={`tel:${booking.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Phone size={13} /> {booking.phone}
                        </a>
                        {booking.email && (
                          <span className="text-xs text-gray-400">{booking.email}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(booking.check_in_date)}
                        {booking.check_in_time && (
                          <span className="text-gray-400 text-xs">· {booking.check_in_time.slice(0, 5)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {booking.selected_room_no ? (
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="font-medium">{booking.selected_room_no}</span>
                          <span className="text-xs text-gray-400 capitalize">({booking.preferred_building})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs capitalize">{booking.preferred_building || "Any"}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[booking.status] || "bg-gray-100 text-gray-600"}`}>
                        {booking.status === "pending" && <Clock size={11} />}
                        {booking.status === "confirmed" && <CheckCircle size={11} />}
                        {booking.status === "cancelled" && <XCircle size={11} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {formatDate(booking.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setSelectedBooking(booking); setAdminNotes(booking.admin_notes || ""); }}
                        className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Manage Booking</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {selectedBooking.booking_id && (
                <div className="bg-primary/10 text-primary font-mono font-bold text-center py-2 rounded-xl text-sm">
                  {selectedBooking.booking_id}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Name", value: selectedBooking.name },
                  { label: "Phone", value: selectedBooking.phone },
                  { label: "Email", value: selectedBooking.email || "—" },
                  { label: "Check-in Date", value: formatDate(selectedBooking.check_in_date) },
                  { label: "Check-in Time", value: selectedBooking.check_in_time?.slice(0, 5) || "Flexible" },
                  { label: "Room", value: selectedBooking.selected_room_no ? `${selectedBooking.selected_room_no} (${selectedBooking.preferred_building})` : selectedBooking.preferred_building || "Any" },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</span>
                    <p className="font-medium text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare size={14} className="inline mr-1" />
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateStatus(selectedBooking.id, "confirmed", adminNotes)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all text-sm disabled:opacity-60"
                >
                  <CheckCircle size={16} /> Confirm
                </button>
                <button
                  onClick={() => updateStatus(selectedBooking.id, "cancelled", adminNotes)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all text-sm disabled:opacity-60"
                >
                  <XCircle size={16} /> Cancel
                </button>
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm"
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
