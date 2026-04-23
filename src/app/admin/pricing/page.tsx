"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical, GraduationCap, Globe, IndianRupee, Building2, Info, Users, Minus } from "lucide-react";
import { logActivity } from "@/utils/activity-logger";

interface PricingItem {
  id: string;
  category: "student" | "public";
  building: string | null;
  item_name: string;
  amount: number;
  display_order: number;
  is_visible: boolean;
  price_type: "per_adult" | "per_child" | "item";
  created_at: string;
}

const emptyItem: Partial<PricingItem> = {
  category: "student",
  building: "gold",
  item_name: "",
  amount: 0,
  display_order: 0,
  is_visible: true,
  price_type: "item",
};

const WHERE_USED: Record<string, { label: string; pages: string[] }> = {
  "student-gold": {
    label: "Gold Building (Student)",
    pages: ["Home page — Room Types section", "Booking page — pricing card (student mode)"],
  },
  "student-silver": {
    label: "Silver Building (Student)",
    pages: ["Silver Building page — Room pricing", "Booking page — pricing card (student mode)"],
  },
  "public-gold": {
    label: "Gold Building (Public)",
    pages: ["Booking page — dynamic price calculator (public mode)"],
  },
  "public-silver": {
    label: "Silver Building (Public)",
    pages: ["Booking page — dynamic price calculator (public mode)"],
  },
};

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"student" | "public">("student");
  const [activeBuilding, setActiveBuilding] = useState<"gold" | "silver">("gold");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<PricingItem>>(emptyItem);
  const [saving, setSaving] = useState(false);
  const [bookingPreference, setBookingPreference] = useState<string>("student");
  // Preview guest counters
  const [previewAdults, setPreviewAdults] = useState(2);
  const [previewChildren, setPreviewChildren] = useState(1);

  const fetchPricing = useCallback(async () => {
    const supabase = createClient();
    const [{ data: pricingData }, { data: settingsData }] = await Promise.all([
      supabase.from("pricing_config").select("*").order("display_order").order("created_at"),
      supabase.from("site_settings").select("value").eq("key", "booking_preference").single(),
    ]);
    setItems(pricingData || []);
    if (settingsData?.value) setBookingPreference(settingsData.value);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  const filtered = items.filter((i) => i.category === activeCategory && i.building === activeBuilding);
  const isPublicTab = activeCategory === "public";

  // Public pricing split
  const perAdultItem = filtered.find((i) => i.price_type === "per_adult");
  const perChildItem = filtered.find((i) => i.price_type === "per_child");
  const additionalItems = filtered.filter((i) => i.price_type === "item");

  // Student total
  const studentTotal = filtered.filter((i) => i.is_visible).reduce((sum, i) => sum + (i.amount || 0), 0);

  // Public preview calculation
  const adultRate = perAdultItem?.is_visible ? (perAdultItem.amount || 0) : 0;
  const childRate = perChildItem?.is_visible ? (perChildItem.amount || 0) : 0;
  const extrasTotal = additionalItems.filter((i) => i.is_visible).reduce((sum, i) => sum + (i.amount || 0), 0);
  const publicNightlyTotal = (previewAdults * adultRate) + (previewChildren * childRate) + extrasTotal;

  const whereKey = `${activeCategory}-${activeBuilding}`;
  const whereInfo = WHERE_USED[whereKey];

  // Save per-person rate inline
  const handleSaveRate = async (item: PricingItem, newAmount: number) => {
    const supabase = createClient();
    await supabase.from("pricing_config").update({
      amount: newAmount,
      updated_at: new Date().toISOString(),
    }).eq("id", item.id);
    logActivity("update", "pricing", `Updated ${activeBuilding} ${item.price_type} rate to ₹${newAmount}`);
    await fetchPricing();
  };

  const handleSave = async () => {
    if (!form.item_name?.trim()) return;
    setSaving(true);
    const supabase = createClient();

    if (modal === "add") {
      const maxOrder = Math.max(0, ...filtered.map((i) => i.display_order));
      await supabase.from("pricing_config").insert({
        ...form,
        category: activeCategory,
        building: activeBuilding,
        price_type: "item",
        display_order: maxOrder + 1,
      });
      logActivity("create", "pricing", `Added ${activeBuilding} ${activeCategory} pricing: ${form.item_name}`);
    } else if (form.id) {
      await supabase.from("pricing_config").update({
        item_name: form.item_name,
        amount: form.amount,
        display_order: form.display_order,
        is_visible: form.is_visible,
        updated_at: new Date().toISOString(),
      }).eq("id", form.id);
      logActivity("update", "pricing", `Updated ${activeBuilding} ${activeCategory} pricing: ${form.item_name}`);
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
    const list = isPublicTab ? additionalItems : [...filtered];
    const sorted = [...list].sort((a, b) => a.display_order - b.display_order);
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

  // Shared item row component
  const ItemRow = ({ item, idx, list }: { item: PricingItem; idx: number; list: PricingItem[] }) => (
    <div className={`flex items-center gap-3 px-5 py-4 ${!item.is_visible ? "opacity-50" : ""}`}>
      <div className="flex flex-col gap-0.5">
        <button onClick={() => moveItem(item, "up")} disabled={idx === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
          <GripVertical size={14} className="rotate-180" />
        </button>
        <button onClick={() => moveItem(item, "down")} disabled={idx === list.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
          <GripVertical size={14} />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{item.item_name}</p>
        <p className="text-xs text-gray-400">Order: {item.display_order}</p>
      </div>
      <div className="text-right mr-4">
        <p className="font-bold text-green-700 text-lg">₹{item.amount.toLocaleString("en-IN")}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`} title={item.is_visible ? "Hide" : "Show"}>
          {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button onClick={() => { setForm(item); setModal("edit"); }} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );

  // Inline rate editor for per_adult / per_child
  const RateEditor = ({ item, label, icon }: { item: PricingItem | undefined; label: string; icon: string }) => {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(item?.amount || 0);

    if (!item) return (
      <div className="bg-gray-50 rounded-xl p-5 text-center text-gray-400 text-sm">
        <p>{label} rate not configured.</p>
        <p className="text-xs mt-1">Run migration_v5.sql to set up per-person rates.</p>
      </div>
    );

    return (
      <div className={`rounded-xl border-2 p-5 transition-all ${item.is_visible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400">Per night rate</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`} title={item.is_visible ? "Hide" : "Show"}>
              {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number" value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
            <button onClick={async () => { await handleSaveRate(item, val); setEditing(false); }} className="px-4 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark">Save</button>
            <button onClick={() => { setVal(item.amount); setEditing(false); }} className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="w-full text-left group">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-700">₹{item.amount.toLocaleString("en-IN")}</p>
              <Pencil size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-500 text-sm mt-1">Manage pricing for Gold & Silver buildings</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyItem, category: activeCategory, building: activeBuilding }); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add {isPublicTab ? "Extra Item" : "Item"}
        </button>
      </div>

      {/* Active mode indicator */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-800">
            Current booking mode: <strong className="capitalize">{bookingPreference}</strong>.{" "}
            {bookingPreference === "student"
              ? "Home page and booking page show student pricing."
              : "Booking page shows public pricing with per-person rates."}
          </p>
          <p className="text-blue-600 text-xs mt-1">Change this in Settings → Booking Preference.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveCategory("student")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeCategory === "student" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <GraduationCap size={16} /> Student Pricing
        </button>
        <button
          onClick={() => setActiveCategory("public")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeCategory === "public" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <Globe size={16} /> Public Pricing
        </button>
      </div>

      {/* Building Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveBuilding("gold")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeBuilding === "gold"
              ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
              : "bg-white border border-gray-200 text-gray-500 hover:border-yellow-200"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-yellow-400" /> Gold Building
        </button>
        <button
          onClick={() => setActiveBuilding("silver")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeBuilding === "silver"
              ? "bg-slate-100 text-slate-700 border-2 border-slate-300"
              : "bg-white border border-gray-200 text-gray-500 hover:border-slate-200"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-slate-400" /> Silver Building
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2">
          {isPublicTab ? (
            /* ─── PUBLIC TAB: Per-person rates + additional items ─── */
            <div className="space-y-5">
              {/* Per-person rates */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={14} className="text-gray-400" /> Per-Person Rates
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <RateEditor item={perAdultItem} label="Per Adult" icon="🧑" />
                  <RateEditor item={perChildItem} label="Per Child" icon="👶" />
                </div>
              </div>

              {/* Additional items */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IndianRupee size={14} className="text-gray-400" /> Additional Items
                  <span className="text-xs font-normal text-gray-400">(food, extras, etc.)</span>
                </h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {additionalItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <IndianRupee size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No additional items yet</p>
                      <p className="text-xs mt-1">Click &quot;Add Extra Item&quot; to add food, laundry, etc.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {[...additionalItems].sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                        <ItemRow key={item.id} item={item} idx={idx} list={additionalItems} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ─── STUDENT TAB: Regular list ─── */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <IndianRupee size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No pricing items for {activeBuilding} building ({activeCategory})</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[...filtered].sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                    <ItemRow key={item.id} item={item} idx={idx} list={filtered} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Preview + Where Used */}
        <div className="space-y-5">
          {/* Where used */}
          {whereInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-1 text-sm flex items-center gap-2">
                <Building2 size={14} className="text-gray-400" /> Where This Reflects
              </h3>
              <p className="text-xs text-gray-400 mb-3">These prices appear on:</p>
              <ul className="space-y-1.5">
                {whereInfo.pages.map((page) => (
                  <li key={page} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {page}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-8">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Preview</h3>
            <p className="text-xs text-gray-400 mb-4">
              {isPublicTab ? "How nightly price is calculated" : "How prices appear on the website"}
            </p>

            <div className={`rounded-xl p-4 ${activeBuilding === "gold" ? "bg-yellow-50" : "bg-slate-50"}`}>
              <h4 className="font-bold text-navy text-sm mb-3 capitalize">
                {activeBuilding} · {activeCategory} Pricing
              </h4>

              {isPublicTab ? (
                /* Public preview with interactive counters */
                <div className="space-y-3">
                  {/* Guest counter controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Adults</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPreviewAdults(Math.max(1, previewAdults - 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30" disabled={previewAdults <= 1}>
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-navy">{previewAdults}</span>
                        <button onClick={() => setPreviewAdults(Math.min(10, previewAdults + 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary">
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Children</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPreviewChildren(Math.max(0, previewChildren - 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30" disabled={previewChildren <= 0}>
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-navy">{previewChildren}</span>
                        <button onClick={() => setPreviewChildren(Math.min(10, previewChildren + 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary">
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-1.5">
                    {perAdultItem?.is_visible && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{previewAdults} × ₹{adultRate.toLocaleString("en-IN")} (adult)</span>
                        <span className="font-semibold text-gray-700">₹{(previewAdults * adultRate).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {perChildItem?.is_visible && previewChildren > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{previewChildren} × ₹{childRate.toLocaleString("en-IN")} (child)</span>
                        <span className="font-semibold text-gray-700">₹{(previewChildren * childRate).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {additionalItems.filter((i) => i.is_visible).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{item.item_name}</span>
                        <span className="font-semibold text-gray-700">₹{item.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-700 text-sm">Per night</span>
                    <span className="font-bold text-primary text-lg">₹{publicNightlyTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                /* Student preview */
                filtered.filter((i) => i.is_visible).length === 0 ? (
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
                      <span className="font-bold text-primary text-lg">₹{studentTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal (for additional items / student items) */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add Pricing Item" : "Edit Pricing Item"}</h3>
              <button onClick={() => { setModal(null); setForm(emptyItem); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                Adding to: <strong className="capitalize text-gray-700">{activeBuilding}</strong> Building · <strong className="capitalize text-gray-700">{activeCategory}</strong> Pricing
                {isPublicTab && <span className="text-gray-400"> (additional item)</span>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={form.item_name || ""}
                  onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={isPublicTab ? "e.g., Food (per day)" : "e.g., 2-Sharing Room"}
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
