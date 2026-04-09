"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Plus, Search, Pencil, Trash2, X, Building2, Phone, Archive, MoreVertical } from "lucide-react";
import Link from "next/link";
import { logActivity } from "@/utils/activity-logger";

interface Student {
  id: string;
  building: "gold" | "silver";
  room_no: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  join_date: string;
  no_of_months: number;
  aadhar_no: string;
  institution_name: string;
  branch: string;
  year_of_study: string;
  parent_name: string;
  parent_contact: string;
  address: string;
  reference: string;
  advance: number;
  monthly_rent: number;
  new_rent: number;
  comment: string;
  status: "active" | "inactive" | "left" | "archived";
  archived_at: string | null;
}

// Extracted outside component to prevent re-creation on every render (fixes auto-focus bug)
function StudentInputField({
  label, value, onChange, type = "text", placeholder = "",
}: {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        placeholder={placeholder}
      />
    </div>
  );
}

const emptyStudent: Partial<Student> = {
  building: "gold",
  room_no: "",
  name: "",
  phone: "",
  email: "",
  dob: "",
  join_date: "",
  no_of_months: 0,
  aadhar_no: "",
  institution_name: "",
  branch: "",
  year_of_study: "",
  parent_name: "",
  parent_contact: "",
  address: "",
  reference: "",
  advance: 0,
  monthly_rent: 0,
  new_rent: 0,
  comment: "",
  status: "active",
  archived_at: null,
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Student>>(emptyStudent);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("students").select("*").is("archived_at", null).order("building").order("room_no");
    setStudents(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => {
    let result = students.filter((s) => s.building === activeTab);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.room_no?.toLowerCase().includes(q)
      );
    }
    if (buildingFilter !== "all") {
      result = result.filter((s) => s.building === buildingFilter);
    }
    setFiltered(result);
  }, [search, buildingFilter, students, activeTab]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    if (modal === "add") {
      await supabase.from("students").insert({ ...form });
    } else {
      await supabase.from("students").update({ ...form, updated_at: new Date().toISOString() }).eq("id", form.id!);
    }
    logActivity(modal === "add" ? "create" : "update", "students", `${modal === "add" ? "Added" : "Updated"} student: ${form.name}`);
    setModal(null);
    setForm(emptyStudent);
    await fetchStudents();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student record?")) return;
    const supabase = createClient();
    const student = students.find((s) => s.id === id);
    await supabase.from("students").delete().eq("id", id);
    logActivity("delete", "students", `Deleted student: ${student?.name || id}`);
    await fetchStudents();
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this student? They can be restored from the archive page.")) return;
    const supabase = createClient();
    const student = students.find((s) => s.id === id);
    await supabase
      .from("students")
      .update({ status: "archived", archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id);
    logActivity("archive", "students", `Archived student: ${student?.name || id}`);
    await fetchStudents();
  };

  const goldCount = students.filter((s) => s.building === "gold" && s.status === "active").length;
  const silverCount = students.filter((s) => s.building === "silver" && s.status === "active").length;

  // Helper to create bound input fields using the extracted StudentInputField
  const F = (label: string, field: keyof Student, type = "text", placeholder = "") => (
    <StudentInputField
      label={label}
      value={(form[field] as string | number) ?? ""}
      onChange={(val) => setForm((prev) => ({ ...prev, [field]: val }))}
      type={type}
      placeholder={placeholder}
    />
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Students Info</h1>
          <p className="text-gray-500 text-sm mt-1">Gold: {goldCount} active · Silver: {silverCount} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/students/archive"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            <Archive size={16} /> Archive
          </Link>
          <button
            onClick={() => { setForm(emptyStudent); setModal("add"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Building Tabs */}
      <div className="flex gap-2 mb-5">
        {(["gold", "silver"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setActiveTab(b)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === b ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
            }`}
          >
            <span>{b === "gold" ? "🥇" : "🥈"}</span>
            <span className="capitalize">{b} Building</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === b ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
              {b === "gold" ? goldCount : silverCount}
            </span>
          </button>
        ))}
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
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Room</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Institution</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Rent</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Join Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{student.room_no || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{student.name || "—"}</p>
                      {student.parent_name && <p className="text-xs text-gray-400">{student.parent_name}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {student.phone ? (
                        <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-primary text-xs hover:underline">
                          <Phone size={12} />{student.phone}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {student.institution_name || "—"}
                      {student.branch && <span className="text-gray-400"> · {student.branch}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {student.new_rent ? (
                          <span className="font-semibold text-green-700">₹{student.new_rent.toLocaleString("en-IN")}</span>
                        ) : student.monthly_rent ? (
                          <span className="font-medium text-gray-700">₹{student.monthly_rent.toLocaleString("en-IN")}</span>
                        ) : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {student.join_date ? new Date(student.join_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        student.status === "active" ? "bg-green-100 text-green-700" :
                        student.status === "left" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === student.id ? null : student.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {actionMenu === student.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 w-36">
                            <button
                              onClick={() => { setForm(student); setModal("edit"); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => { handleArchive(student.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50"
                            >
                              <Archive size={14} /> Archive
                            </button>
                            <button
                              onClick={() => { handleDelete(student.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">
                {modal === "add" ? "Add New Student" : "Edit Student"}
              </h3>
              <button onClick={() => { setModal(null); setForm(emptyStudent); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Building *</label>
                  <select
                    value={form.building}
                    onChange={(e) => setForm({ ...form, building: e.target.value as "gold" | "silver" })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
                {F("Room Number", "room_no", "text", "e.g., 11-1")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Full Name", "name", "text", "Student name")}
                {F("Phone Number", "phone", "text", "Mobile number")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Email", "email", "text", "email@example.com")}
                {F("Date of Birth", "dob", "date")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Join Date", "join_date", "date")}
                {F("Aadhar Number", "aadhar_no")}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {F("No. of Months", "no_of_months", "number")}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Student["status"] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {F("Institution", "institution_name")}
                {F("Branch", "branch")}
                {F("Year of Study", "year_of_study")}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {F("Advance (₹)", "advance", "number")}
                {F("Monthly Rent (₹)", "monthly_rent", "number")}
                {F("New Rent (₹)", "new_rent", "number")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Parent/Guardian Name", "parent_name")}
                {F("Parent Contact", "parent_contact")}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <textarea
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Reference", "reference", "text", "How they found us")}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                  <input
                    type="text"
                    value={form.comment || ""}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Any notes"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setModal(null); setForm(emptyStudent); }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : modal === "add" ? "Add Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
