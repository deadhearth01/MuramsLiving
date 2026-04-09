"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { CreditCard, Plus, Search, Trash2, X, IndianRupee, BarChart3, ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { logActivity } from "@/utils/activity-logger";

interface Payment {
  id: string;
  student_id: string;
  building: string;
  room_no: string;
  student_name: string;
  month: string;
  year: number;
  amount_paid: number;
  payment_date: string;
  payment_mode: string;
  comment: string;
  created_at: string;
}

interface Student {
  id: string;
  name: string;
  room_no: string;
  building: string;
  monthly_rent: number;
  new_rent: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const currentMonth = MONTHS[new Date().getMonth()];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(currentMonth);
  const [yearFilter, setYearFilter] = useState(currentYear);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [dueModal, setDueModal] = useState<{ studentId: string; studentName: string; rent: number; paid: number } | null>(null);
  const [form, setForm] = useState({
    student_id: "",
    building: "gold",
    room_no: "",
    student_name: "",
    month: currentMonth,
    year: currentYear,
    amount_paid: 0,
    payment_date: new Date().toISOString().split("T")[0],
    payment_mode: "cash",
    comment: "",
  });

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const [pm, st] = await Promise.all([
      supabase.from("student_payments").select("*").order("created_at", { ascending: false }),
      supabase.from("students").select("id, name, room_no, building, monthly_rent, new_rent").eq("status", "active").order("building").order("room_no"),
    ]);
    setPayments(pm.data || []);
    setStudents(st.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = payments.filter((p) => {
    const matchSearch = !search || p.student_name?.toLowerCase().includes(search.toLowerCase()) || p.room_no?.includes(search);
    const matchBuilding = buildingFilter === "all" || p.building === buildingFilter;
    const matchMonth = p.month === monthFilter && p.year === yearFilter;
    return matchSearch && matchBuilding && matchMonth;
  });

  const totalCollected = filtered.reduce((sum, p) => sum + (p.amount_paid || 0), 0);

  // Build due map: for each student, sum payments for selected month/year vs their rent
  const studentDueMap = new Map<string, { paid: number; rent: number; name: string }>();
  students.forEach((s) => {
    const rent = s.new_rent || s.monthly_rent || 0;
    const paid = payments
      .filter((p) => p.student_id === s.id && p.month === monthFilter && p.year === yearFilter)
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0);
    studentDueMap.set(s.id, { paid, rent, name: s.name });
  });

  const getPaymentStatus = (studentId: string) => {
    const info = studentDueMap.get(studentId);
    if (!info || info.rent === 0) return { label: "—", color: "", due: 0 };
    const due = info.rent - info.paid;
    if (due <= 0) return { label: "Paid", color: "bg-green-100 text-green-700 border-green-200", due: 0 };
    if (info.paid > 0) return { label: "Partial", color: "bg-amber-100 text-amber-700 border-amber-200", due };
    return { label: "Due", color: "bg-red-100 text-red-700 border-red-200", due };
  };

  // Rent info for Add Payment modal
  const selectedStudent = students.find((s) => s.id === form.student_id);
  const selectedRent = selectedStudent ? (selectedStudent.new_rent || selectedStudent.monthly_rent || 0) : 0;
  const alreadyPaidForMonth = form.student_id
    ? payments
        .filter((p) => p.student_id === form.student_id && p.month === form.month && p.year === form.year)
        .reduce((sum, p) => sum + (p.amount_paid || 0), 0)
    : 0;
  const remainingDue = Math.max(0, selectedRent - alreadyPaidForMonth - form.amount_paid);

  const handleStudentSelect = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (student) {
      setForm({
        ...form,
        student_id: id,
        student_name: student.name,
        room_no: student.room_no,
        building: student.building,
        amount_paid: student.new_rent || student.monthly_rent || 0,
      });
    }
  };

  const handleSave = async () => {
    if (!form.student_name) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("student_payments").insert(form);
    logActivity("create", "payments", `Payment ₹${form.amount_paid} for ${form.student_name} (${form.month} ${form.year})`);
    setShowAdd(false);
    setForm({
      student_id: "", building: "gold", room_no: "", student_name: "",
      month: currentMonth, year: currentYear, amount_paid: 0,
      payment_date: new Date().toISOString().split("T")[0], payment_mode: "cash", comment: "",
    });
    await fetchData();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    const supabase = createClient();
    await supabase.from("student_payments").delete().eq("id", id);
    logActivity("delete", "payments", `Deleted payment record ${id}`);
    await fetchData();
  };

  // Graph data — all months of selected year, all buildings
  const graphData = MONTHS.map((m) => {
    const monthPayments = payments.filter((p) => p.month === m && p.year === yearFilter);
    return {
      month: m.slice(0, 3),
      Gold:   Math.round(monthPayments.filter((p) => p.building === "gold").reduce((s, p) => s + (p.amount_paid || 0), 0)),
      Silver: Math.round(monthPayments.filter((p) => p.building === "silver").reduce((s, p) => s + (p.amount_paid || 0), 0)),
    };
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">
            {monthFilter} {yearFilter} · <span className="text-green-600 font-semibold">₹{totalCollected.toLocaleString("en-IN")} collected</span>
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add Payment
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="relative col-span-2 sm:col-span-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search name / room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
        >
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
        >
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
        >
          <option value="all">All Buildings</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Payments Recorded", value: filtered.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Collected", value: `₹${totalCollected.toLocaleString("en-IN")}`, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Per Student", value: filtered.length > 0 ? `₹${Math.round(totalCollected / filtered.length).toLocaleString("en-IN")}` : "—", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Graph toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowGraph((v) => !v)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
            showGraph
              ? "bg-navy text-white border-navy"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          <BarChart3 size={14} />
          {showGraph ? "Hide Graph" : "Show Graph"}
          {showGraph ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Graph */}
      {showGraph && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Monthly Collection {yearFilter} — by Building</p>
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 480 }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={graphData} barSize={14} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
                    width={52}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Bar dataKey="Gold"   fill="#eab308" radius={[4,4,0,0]} />
                  <Bar dataKey="Silver" fill="#94a3b8" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
            <p>No payments for {monthFilter} {yearFilter}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Room</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Building</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Month</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Mode</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Comment</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.room_no || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{p.student_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${p.building === "gold" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>
                        {p.building}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.month} {p.year}</td>
                    <td className="px-4 py-3 font-bold text-green-700">₹{p.amount_paid?.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{p.payment_mode}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[100px] truncate">{p.comment || "—"}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const status = getPaymentStatus(p.student_id);
                        if (status.label === "—") return <span className="text-gray-400 text-xs">—</span>;
                        return (
                          <button
                            onClick={() => {
                              const info = studentDueMap.get(p.student_id);
                              if (info && (status.label === "Due" || status.label === "Partial")) {
                                setDueModal({ studentId: p.student_id, studentName: info.name, rent: info.rent, paid: info.paid });
                              }
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color} ${status.label !== "Paid" ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                          >
                            {status.label === "Paid" && <CheckCircle size={11} />}
                            {status.label === "Partial" && <AlertCircle size={11} />}
                            {status.label === "Due" && <XCircle size={11} />}
                            {status.label}
                          </button>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Due Details Modal */}
      {dueModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Payment Status</h3>
              <button onClick={() => setDueModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className="font-semibold text-gray-800 text-lg">{dueModal.studentName}</p>
              <p className="text-xs text-gray-400">{monthFilter} {yearFilter}</p>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Rent</span>
                  <span className="font-bold text-gray-900">₹{dueModal.rent.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-semibold text-green-600">₹{dueModal.paid.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Remaining Due</span>
                  <span className="font-bold text-red-600">₹{(dueModal.rent - dueModal.paid).toLocaleString("en-IN")}</span>
                </div>
              </div>
              {/* Individual payments for this student this month */}
              {(() => {
                const studentPayments = payments.filter(
                  (p) => p.student_id === dueModal.studentId && p.month === monthFilter && p.year === yearFilter
                );
                if (studentPayments.length === 0) return <p className="text-xs text-gray-400 mt-3">No payments recorded yet.</p>;
                return (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Payment History</p>
                    <div className="space-y-1.5">
                      {studentPayments.map((sp) => (
                        <div key={sp.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">₹{sp.amount_paid.toLocaleString("en-IN")}</span>
                            <span className="text-gray-400 ml-2 capitalize">{sp.payment_mode}</span>
                          </div>
                          <span className="text-gray-400">
                            {sp.payment_date ? new Date(sp.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => { setDueModal(null); setShowAdd(true); }}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark text-sm"
              >
                <Plus size={14} className="inline mr-1" /> Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Add Payment</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Select Student</label>
                <select
                  value={form.student_id}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">— Choose Student —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.building === "gold" ? "Gold" : "Silver"}] Room {s.room_no} · {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rent Info Card */}
              {form.student_id && selectedRent > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Monthly Rent</span>
                    <span className="font-bold text-gray-900">₹{selectedRent.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Already Paid ({form.month.slice(0, 3)})</span>
                    <span className="font-semibold text-green-600">₹{alreadyPaidForMonth.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Paying Now</span>
                    <span className="font-semibold text-primary">₹{form.amount_paid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Remaining Due</span>
                    <span className={`font-bold ${remainingDue > 0 ? "text-red-600" : "text-green-600"}`}>
                      {remainingDue > 0 ? `₹${remainingDue.toLocaleString("en-IN")}` : "Fully Paid"}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                  <select
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    {[2024, 2025, 2026].map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount Paid (₹)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={form.amount_paid}
                      onChange={(e) => setForm({ ...form, amount_paid: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={form.payment_date}
                    onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode</label>
                  <select
                    value={form.payment_mode}
                    onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                  <input
                    type="text"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Optional note"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.student_name}
                className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark text-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
