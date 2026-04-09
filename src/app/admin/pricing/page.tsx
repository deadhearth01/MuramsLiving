"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical, GraduationCap, Globe, IndianRupee } from "lucide-react";
import { logActivity } from "@/utils/activity-logger";

interface PricingItem {
  id: string;
  category: "student" | "public";
  item_name: string;
  amount: number;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

const emptyItem: Partial<PricingItem> = {
  category: "student",
  item_name: "",
  amount: 0,
  display_order: 0,
  is_visible: true,
};

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"student" | "public">("student");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<PricingItem>>(emptyItem);
  const [saving, setSaving] = useState(false);

  const fetchPricing = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("pricing_config")
      .select("*")
      .order("display_order")
      .order("created_at");
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  const filtered = items.filter((i) => i.category === activeTab);
  const total = filtered.filter((i) => i.is_visible).reduce((sum, i) => sum + (i.amount || 0), 0);

  const handleSave = async () => {
    if (!form.item_name?.trim()) return;
    setSaving(true);
    const supabase = createClient();

    if (modal === "add") {
      const maxOrder = Math.max(0, ...filtered.map((i) => i.display_order));
      await supabase.from("pricing_config").insert({
        ...form,
        category: activeTab,
        display_order: maxOrder + 1,
      });
      logActivity("create", "pricing", `Added ${activeTab} pricing: ${form.item_name}`);
    } else if (form.id) {
      await supabase.from("pricing_config").update({
        item_name: form.item_name,
        amount: form.amount,
        display_order: form.display_order,
        is_visible: form.is_visible,
        updated_at: new Date().toISOString(),
      }).eq("id", form.id);
      logActivity("update", "pricing", `Updated ${activeTab} pricing: ${form.item_name}`);
    }

    setModal(null);
    setForm(emptyItem);
    await fetchPricing();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pricing item?")) return;
    const supabase = createClient();
    const item = items.find((i) => i.id === id);
    await supabase.from("pricing_config").delete().eq("id", id);
    logActivity("delete", "pricing", `Deleted pricing: ${item?.item_name || id}`);
    await fetchPricing();
  };

  const toggleVisibility = async (item: PricingItem) => {
    const supabase = createClient();
    await supabase.from("pricing_config").update({ is_visible: !item.is_visible, updated_at: new Date().toISOString() }).eq("id", item.id);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_visible: !i.is_visible } : i));
  };

  const moveItem = async (item: PricingItem, direction: "up" | "down") => {
    const sorted = [...filtered].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const supabase = createClient();
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      supabase.from("pricing_config").update({ display_order: b.display_order }).eq("id", a.id),
      supabase.from("pricing_config").update({ display_order: a.display_order }).eq("id", b.id),
    ]);
    await fetchPricing();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-500 text-sm mt-1">Manage pricing displayed on the website and booking page</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyItem, category: activeTab }); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("student")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "student" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <GraduationCap size={16} /> Student Pricing
        </button>
        <button
          onClick={() => setActiveTab("public")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "public" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <Globe size={16} /> Public Pricing
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <IndianRupee size={40} className="mx-auto mb-3 opacity-30" />
                <p>No pricing items for {activeTab === "student" ? "students" : "public"}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {[...filtered].sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-3 px-5 py-4 ${!item.is_visible ? "opacity-50" : ""}`}>
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveItem(item, "up")}
                        disabled={idx === 0}
                        className="text-gray-300 hover:text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical size={14} className="rotate-180" />
                      </button>
                      <button
                        onClick={() => moveItem(item, "down")}
                        disabled={idx === filtered.length - 1}
                        className="text-gray-300 hover:text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical size={14} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.item_name}</p>
                      <p className="text-xs text-gray-400">Order: {item.display_order}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right mr-4">
                      <p className="font-bold text-green-700 text-lg">₹{item.amount.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={`p-1.5 rounded-lg transition-colors ${item.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                        title={item.is_visible ? "Hide" : "Show"}
                      >
                        {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => { setForm(item); setModal("edit"); }}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-8">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Preview</h3>
            <p className="text-xs text-gray-400 mb-4">How prices appear on the website</p>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-navy text-sm mb-3 capitalize">{activeTab} Pricing</h4>
              {filtered.filter((i) => i.is_visible).length === 0 ? (
                <p className="text-xs text-gray-400">No visible items</p>
              ) : (
                <div className="space-y-2">
                  {[...filtered]
                    .filter((i) => i.is_visible)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.item_name}</span>
                        <span className="font-bold text-navy">₹{item.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="font-bold text-primary text-lg">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add Pricing Item" : "Edit Pricing Item"}</h3>
              <button onClick={() => { setModal(null); setForm(emptyItem); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={form.item_name || ""}
                  onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., 2-Sharing Room"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹) *</label>
                <div className="relative">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={form.amount || ""}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible ?? true}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="text-sm text-gray-600">Visible on website</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setModal(null); setForm(emptyItem); }} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.item_name?.trim()} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saving..." : modal === "add" ? "Add Item" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
