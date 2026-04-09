"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ClipboardList, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  page: string;
  details: string;
  ip: string;
  created_at: string;
}

const PAGE_SIZE = 30;

const PAGE_OPTIONS = [
  { value: "", label: "All Pages" },
  { value: "login", label: "Login" },
  { value: "bookings", label: "Bookings" },
  { value: "availability", label: "Room Availability" },
  { value: "students", label: "Students" },
  { value: "payments", label: "Payments" },
  { value: "expenses", label: "Expenses" },
  { value: "workers", label: "Workers" },
  { value: "users", label: "Users" },
  { value: "pricing", label: "Pricing" },
];

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  archive: "bg-amber-100 text-amber-700",
  restore: "bg-purple-100 text-purple-700",
  login: "bg-indigo-100 text-indigo-700",
  toggle: "bg-cyan-100 text-cyan-700",
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (pageFilter) query = query.eq("page", pageFilter);
    if (roleFilter) query = query.eq("user_role", roleFilter);
    if (dateFilter) {
      query = query.gte("created_at", `${dateFilter}T00:00:00`).lte("created_at", `${dateFilter}T23:59:59`);
    }

    const { data } = await query;
    setLogs(data || []);
    setHasMore((data || []).length === PAGE_SIZE);
    setLoading(false);
  }, [page, pageFilter, roleFilter, dateFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0); }, [pageFilter, roleFilter, dateFilter]);

  const filtered = search
    ? logs.filter(
        (l) =>
          l.user_name?.toLowerCase().includes(search.toLowerCase()) ||
          l.action?.toLowerCase().includes(search.toLowerCase()) ||
          l.details?.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const formatDateTime = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  const getActionColor = (action: string) => {
    const key = action.toLowerCase().split(" ")[0];
    return ACTION_COLORS[key] || "bg-gray-100 text-gray-600";
  };

  if (loading && logs.length === 0) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 text-sm mt-1">Track all admin actions across the panel</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="relative col-span-2 sm:col-span-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
        >
          {PAGE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        />
        {(pageFilter || roleFilter || dateFilter) && (
          <button
            onClick={() => { setPageFilter(""); setRoleFilter(""); setDateFilter(""); }}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <Filter size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Page</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                          {log.user_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 text-xs">{log.user_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{log.page}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate">{log.details || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400">
          Page {page + 1} · Showing {filtered.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
