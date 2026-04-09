"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, ArrowLeft, RotateCcw, Trash2, Search, Phone } from "lucide-react";
import Link from "next/link";

interface ArchivedStudent {
  id: string;
  building: string;
  room_no: string;
  name: string;
  phone: string;
  email: string;
  institution_name: string;
  branch: string;
  monthly_rent: number;
  new_rent: number;
  archived_at: string;
  join_date: string;
}

export default function StudentArchivePage() {
  const [students, setStudents] = useState<ArchivedStudent[]>([]);
  const [filtered, setFiltered] = useState<ArchivedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArchived = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("status", "archived")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false });
    setStudents(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchArchived(); }, [fetchArchived]);

  useEffect(() => {
    if (!search) { setFiltered(students); return; }
    const q = search.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.room_no?.toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  const handleRestore = async (id: string) => {
    if (!confirm("Restore this student to active status?")) return;
    const supabase = createClient();
    await supabase
      .from("students")
      .update({ status: "active", archived_at: null, updated_at: new Date().toISOString() })
      .eq("id", id);
    await fetchArchived();
  };

  const handleDeletePermanently = async (id: string) => {
    if (!confirm("Permanently delete this student? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("students").delete().eq("id", id);
    await fetchArchived();
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Archived Students</h1>
            <p className="text-gray-500 text-sm mt-1">{students.length} archived student{students.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Archive size={40} className="mx-auto mb-3 opacity-30" />
            <p>No archived students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Building</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Room</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Institution</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Rent</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Archived On</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{student.name}</td>
                    <td className="px-4 py-3">
                      {student.phone ? (
                        <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-primary text-xs hover:underline">
                          <Phone size={12} />{student.phone}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${student.building === "gold" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>
                        {student.building}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{student.room_no || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {student.institution_name || "—"}
                      {student.branch && <span className="text-gray-400"> · {student.branch}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      ₹{(student.new_rent || student.monthly_rent || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(student.archived_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRestore(student.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button
                          onClick={() => handleDeletePermanently(student.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
