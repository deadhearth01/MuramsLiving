"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, BedDouble, CalendarCheck, IndianRupee, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalStudents: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingBookings: number;
  confirmedBookings: number;
  thisMonthExpenses: number;
  totalWorkers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    thisMonthExpenses: 0,
    totalWorkers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: string; name: string; phone: string; preferred_building: string;
    selected_room_no: string; status: string; created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

      const [students, rooms, bookings, expenses, workers, recentBk] = await Promise.all([
        supabase.from("students").select("id", { count: "exact" }).eq("status", "active"),
        supabase.from("rooms").select("status"),
        supabase.from("bookings").select("status"),
        supabase.from("expense_items").select("amount").gte("expense_date", firstOfMonth),
        supabase.from("workers").select("id", { count: "exact" }).eq("is_fixed_cost", false),
        supabase.from("bookings").select("id, name, phone, preferred_building, selected_room_no, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const roomData = rooms.data || [];
      const bookingData = bookings.data || [];
      const expenseData = expenses.data || [];

      setStats({
        totalStudents: students.count || 0,
        occupiedRooms: roomData.filter((r) => r.status === "occupied").length,
        availableRooms: roomData.filter((r) => r.status === "available").length,
        pendingBookings: bookingData.filter((b) => b.status === "pending").length,
        confirmedBookings: bookingData.filter((b) => b.status === "confirmed").length,
        thisMonthExpenses: expenseData.reduce((sum, e) => sum + (e.amount || 0), 0),
        totalWorkers: workers.count || 0,
      });

      setRecentBookings(recentBk.data || []);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Active Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Available Rooms",
      value: stats.availableRooms,
      icon: BedDouble,
      color: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Occupied Rooms",
      value: stats.occupiedRooms,
      icon: BedDouble,
      color: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Confirmed Bookings",
      value: stats.confirmedBookings,
      icon: CalendarCheck,
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "This Month Expenses",
      value: `₹${stats.thisMonthExpenses.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-600"}`;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening at Murams Living.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.text} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <p className="text-sm text-gray-500">Latest enquiries from the website</p>
          </div>
          <a
            href="/admin/bookings"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
          >
            View all
            <TrendingUp size={14} />
          </a>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CalendarCheck size={40} className="mx-auto mb-3 opacity-30" />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {booking.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{booking.name}</p>
                    <p className="text-xs text-gray-500">{booking.phone}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={statusBadge(booking.status)}>{booking.status}</span>
                  {booking.selected_room_no && (
                    <span className="text-xs text-gray-400">
                      Room {booking.selected_room_no} · {booking.preferred_building}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
