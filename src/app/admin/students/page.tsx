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

const STATIC_ROOMS: Record<string, Record<string, string[]>> = {
  gold: {
    "1st Floor": ["11-1","11-2","12-1","12-2","12-3","13-1","13-2","13-3","13-4","14-1","14-2","14-3","15-1","15-2","15-3"],
    "2nd Floor": ["21-1","21-2","22-1","22-2","22-3","23-1","23-2","23-3","23-4","24-1","24-2","24-3","25-1","25-2","25-3"],
    "3rd Floor": ["31-1","31-2","32-1","32-2","32-3","33-1","33-2","33-3","33-4","34-1","34-2","34-3","34-4","34-5","35-1","35-2","35-3"],
    "4th Floor": ["41-1","41-2","42-1","42-2","42-3","43-1","43-2","43-3","43-4","44-1","44-2","44-3","44-4","44-5","44-6"],
  },
  silver: {
    "Ground Floor": ["GF1-H-1","GF1-H-2","GF1-L-1","GF1-L-2","GF1-L-3","GF1-R-1","GF1-R-2","GF1-R-3","GF2-H-1","GF2-H-2","GF2-L-1","GF2-L-2","GF2-L-3","GF2-R-1","GF2-R-2","GF2-R-3"],
    "1st Floor":    ["FF1-H-1","FF1-H-2","FF1-L-1","FF1-L-2","FF1-L-3","FF1-R-1","FF1-R-2","FF1-R-3","FF2-H-1","FF2-H-2","FF2-L-1","FF2-L-2","FF2-L-3","FF2-R-1","FF2-R-2","FF2-R-3"],
    "2nd Floor":    ["SF1-H-1","SF1-H-2","SF1-L-1","SF1-L-2","SF1-L-3","SF1-R-1","SF1-R-2","SF1-R-3","SF2-H-1","SF2-H-2","SF2-L-1","SF2-L-2","SF2-L-3","SF2-R-1","SF2-R-2","SF2-R-3"],
  },
};

function isValidIndianPhone(phone: string): boolean {
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, "").replace(/-/g, ""));
}
function isValidEmailAddr(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Extracted outside component to prevent re-creation on every render (fixes auto-focus bug)
function StudentInputField({
  label, value, onChange, type = "text", placeholder = "", validate,
}: {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
  placeholder?: string;
  validate?: (val: string) => string | null;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => { onChange(type === "number" ? Number(e.target.value) : e.target.value); if (error) setError(null); }}
        onBlur={(e) => { if (validate) setError(validate(e.target.value)); }}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-400 focus:ring-red-200 focus:border-red-400"
            : "border-gray-200 focus:ring-primary/20 focus:border-primary"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [floorOptions, setFloorOptions] = useState<string[]>([]);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchStudents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("students").select("*").is("archived_at", null).order("building").order("room_no");
    setStudents(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // Populate floor options from static data when modal opens or building changes
  useEffect(() => {
    if (!modal) return;
    const building = form.building || "gold";
    setFloorOptions(Object.keys(STATIC_ROOMS[building] || {}));
    setSelectedFloor("");
    setRoomOptions([]);
  }, [modal, form.building]);

  // Update room options when floor is selected
  useEffect(() => {
    if (!selectedFloor) {
      setRoomOptions([]);
      return;
    }
    const building = form.building || "gold";
    setRoomOptions(STATIC_ROOMS[building]?.[selectedFloor] || []);
  }, [selectedFloor, form.building]);

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

  const isValidPhone = (phone: string) =>
    /^(\+91|91|0)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, "").replace(/-/g, ""));

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    // Validate phone — mandatory
    if (!form.phone || !form.phone.trim()) {
      alert("Phone number is required.");
      return;
    }
    if (!isValidPhone(form.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).");
      return;
    }
    // Validate email — optional but must be valid if provided
    if (form.email && form.email.trim() && !isValidEmail(form.email)) {
      alert("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    // Validate parent contact if provided
    if (form.parent_contact && form.parent_contact.trim() && !isValidPhone(form.parent_contact)) {
      alert("Please enter a valid parent/guardian contact number.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const wasAdd = modal === "add";
    let error = null;
    if (wasAdd) {
      const res = await supabase.from("students").insert({ ...form });
      error = res.error;
    } else {
      const res = await supabase.from("students").update({ ...form, updated_at: new Date().toISOString() }).eq("id", form.id!);
      error = res.error;
    }
    if (error) {
      setSaving(false);
      setToast({ message: `Failed to ${wasAdd ? "add" : "update"} student: ${error.message}`, type: "error" });
      setTimeout(() => setToast(null), 5000);
      return;
    }
    logActivity(wasAdd ? "create" : "update", "students", `${wasAdd ? "Added" : "Updated"} student: ${form.name}`);
    setModal(null);
    setForm(emptyStudent);
    setSelectedFloor("");
    await fetchStudents();
    setSaving(false);
    setToast({ message: wasAdd ? `Student "${form.name}" added successfully!` : `Student "${form.name}" updated successfully!`, type: "success" });
    setTimeout(() => setToast(null), 4000);
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

  const phoneValidator = (v: string) => {
    if (!v || !v.trim()) return "Phone number is required.";
    if (!isValidIndianPhone(v)) return "Enter a valid 10-digit Indian mobile number.";
    return null;
  };
  const emailValidator = (v: string) => {
    if (!v || !v.trim()) return null; // optional
    if (!isValidEmailAddr(v)) return "Enter a valid email (e.g. name@example.com).";
    return null;
  };
  const parentPhoneValidator = (v: string) => {
    if (!v || !v.trim()) return null; // optional
    if (!isValidIndianPhone(v)) return "Enter a valid 10-digit Indian mobile number.";
    return null;
  };

  // Helper to create bound input fields using the extracted StudentInputField
  const F = (label: string, field: keyof Student, type = "text", placeholder = "", validate?: (v: string) => string | null) => (
    <StudentInputField
      label={label}
      value={(form[field] as string | number) ?? ""}
      onChange={(val) => setForm((prev) => ({ ...prev, [field]: val }))}
      type={type}
      placeholder={placeholder}
      validate={validate}
    />
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />)}
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white"><X size={14} /></button>
        </div>
      )}
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
            onClick={() => { setForm({ ...emptyStudent, building: activeTab }); setSelectedFloor(""); setModal("add"); }}
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
                   <th className="text-left px-4 py-3 font-semibold text-gray-500">Advance</th>
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
                    <td className="px-4 py-3 text-sm">
                      {student.advance ? (
                        <span className="font-semibold text-green-700">₹{student.advance.toLocaleString("en-IN")}</span>
                      ) : <span className="text-gray-400">—</span>}
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
                              onClick={() => {
                                setForm(student);
                                setModal("edit");
                                setActionMenu(null);
                                // Auto-detect floor from room data after it loads
                                const supabase = createClient();
                                supabase.from("rooms").select("floor_name").eq("building", student.building).eq("room_group", student.room_no).limit(1).then(({ data }) => {
                                  if (data && data[0]) setSelectedFloor(data[0].floor_name);
                                });
                              }}
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
            {/* Building color indicator bar */}
            <div className={`h-1.5 rounded-t-2xl ${form.building === "gold" ? "bg-yellow-400" : "bg-slate-400"}`} />
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${form.building === "gold" ? "bg-yellow-400" : "bg-slate-400"}`} />
                <h3 className="font-bold text-gray-900 text-lg">
                  {modal === "add" ? "Add New Student" : "Edit Student"}
                </h3>
              </div>
              <button onClick={() => { setModal(null); setForm(emptyStudent); setSelectedFloor(""); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Building *</label>
                  <select
                    value={form.building}
                    onChange={(e) => { setForm({ ...form, building: e.target.value as "gold" | "silver", room_no: "" }); setSelectedFloor(""); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Floor *</label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => { setSelectedFloor(e.target.value); setForm({ ...form, room_no: "" }); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">— Select Floor —</option>
                    {floorOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Room Number *</label>
                  <select
                    value={form.room_no || ""}
                    onChange={(e) => setForm({ ...form, room_no: e.target.value })}
                    disabled={!selectedFloor}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">— Select Room —</option>
                    {roomOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    {form.room_no && !roomOptions.includes(form.room_no) && (
                      <option value={form.room_no}>{form.room_no} (current)</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Full Name", "name", "text", "Student name")}
                {F("Phone Number *", "phone", "text", "Mobile number", phoneValidator)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {F("Email", "email", "text", "email@example.com", emailValidator)}
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
                {F("Parent Contact", "parent_contact", "text", "Mobile number", parentPhoneValidator)}
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
                onClick={() => { setModal(null); setForm(emptyStudent); setSelectedFloor(""); }}
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
