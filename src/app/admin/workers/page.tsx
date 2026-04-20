"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import { Briefcase, Plus, Pencil, Trash2, X, Phone, IndianRupee } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  monthly_amount: number;
  comment: string;
  is_fixed_cost: boolean;
  cost_category: string;
}

const emptyWorker: Partial<Worker> = {
  name: "", role: "", phone: "", monthly_amount: 0, comment: "",
  is_fixed_cost: false, cost_category: "salary",
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Worker>>(emptyWorker);
  const [saving, setSaving] = useState(false);

  const fetchWorkers = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("workers").select("*").order("is_fixed_cost").order("role");
    setWorkers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const staffWorkers = workers.filter((w) => !w.is_fixed_cost);
  const fixedCosts = workers.filter((w) => w.is_fixed_cost);
  const totalSalary = staffWorkers.reduce((s, w) => s + (w.monthly_amount || 0), 0);
  const totalFixed = fixedCosts.reduce((s, w) => s + (w.monthly_amount || 0), 0);
  const grandTotal = totalSalary + totalFixed;

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    if (modal === "add") {
      await supabase.from("workers").insert(form);
    } else {
      await supabase.from("workers").update({ ...form, updated_at: new Date().toISOString() }).eq("id", form.id!);
    }
    logActivity(modal === "add" ? "create" : "update", "workers", `${modal === "add" ? "Added" : "Updated"} worker: ${form.name}`);
    setModal(null);
    setForm(emptyWorker);
    await fetchWorkers();
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Delete this record?")) return;
    const supabase = createClient();
    await supabase.from("workers").delete().eq("id", id);
    logActivity("delete", "workers", `Deleted worker: ${name}`);
    await fetchWorkers();
  };

  const WorkerRow = ({ worker }: { worker: Worker }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {worker.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{worker.name}</p>
            <p className="text-xs text-gray-400">{worker.role}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {worker.phone ? (
          <a href={`tel:${worker.phone}`} className="flex items-center gap-1.5 text-primary text-sm hover:underline">
            <Phone size={13} />{worker.phone}
          </a>
        ) : <span className="text-gray-400 text-sm">—</span>}
      </td>
      <td className="px-5 py-3.5">
        <span className="font-bold text-gray-900">₹{worker.monthly_amount?.toLocaleString("en-IN")}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          worker.cost_category === "salary" ? "bg-blue-100 text-blue-700" :
          worker.cost_category === "utility" ? "bg-yellow-100 text-yellow-700" :
          worker.cost_category === "rent" ? "bg-purple-100 text-purple-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {worker.cost_category}
        </span>
      </td>
      <td className="px-5 py-3.5 text-xs text-gray-400 max-w-[120px] truncate">{worker.comment || "—"}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button onClick={() => { setForm(worker); setModal("edit"); }} className="text-primary hover:text-primary-dark transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(worker.id, worker.name)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workers & Monthly Costs</h1>
          <p className="text-gray-500 text-sm mt-1">Total monthly outflow: <span className="font-bold text-red-600">₹{grandTotal.toLocaleString("en-IN")}</span></p>
        </div>
        <button
          onClick={() => { setForm(emptyWorker); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Staff Salaries", value: totalSalary, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Fixed Costs", value: totalFixed, color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Grand Total", value: grandTotal, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>₹{s.value.toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      {/* Staff/Workers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-900">Staff & Workers</h2>
          <p className="text-xs text-gray-500 mt-0.5">Monthly salaries — Total: ₹{totalSalary.toLocaleString("en-IN")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Name / Role</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Monthly Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Comment</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staffWorkers.map((w) => <WorkerRow key={w.id} worker={w} />)}
              {staffWorkers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">No staff records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed Costs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-purple-50">
          <h2 className="font-bold text-gray-900">Fixed Monthly Costs</h2>
          <p className="text-xs text-gray-500 mt-0.5">Rent, utilities, maintenance — Total: ₹{totalFixed.toLocaleString("en-IN")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Description</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Monthly Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Comment</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fixedCosts.map((w) => <WorkerRow key={w.id} worker={w} />)}
              {fixedCosts.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">No fixed costs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add Record" : "Edit Record"}</h3>
              <button onClick={() => { setModal(null); setForm(emptyWorker); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[["Name *", "name", "text"], ["Role / Description", "role", "text"]].map(([label, field, type]) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type={type} value={(form[field as keyof Worker] as string) || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" value={form.monthly_amount || ""} onChange={(e) => setForm({ ...form, monthly_amount: Number(e.target.value) })} className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select value={form.cost_category || "salary"} onChange={(e) => setForm({ ...form, cost_category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="salary">Salary</option>
                    <option value="utility">Utility</option>
                    <option value="rent">Rent</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_fixed_cost || false} onChange={(e) => setForm({ ...form, is_fixed_cost: e.target.checked })} className="w-4 h-4 rounded text-primary" />
                    <span className="text-sm text-gray-600">Fixed Monthly Cost</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                <input type="text" value={form.comment || ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Optional note" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setModal(null); setForm(emptyWorker); }} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
