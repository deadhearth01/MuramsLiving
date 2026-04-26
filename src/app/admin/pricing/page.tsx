"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical,
  GraduationCap, Globe, IndianRupee, Building2, Info,
  Users, Minus, ChevronDown, Copy,
} from "lucide-react";
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
  room_type: "ac" | "non-ac" | null;
  sharing_count: 2 | 3 | 4 | null;
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
  room_type: "ac",
};

function getWhereInfo(category: string, building: string, roomType: "ac" | "non-ac") {
  const buildingLabel = building === "gold" ? "Gold Building" : "Silver Building";
  const rtLabel = roomType === "ac" ? "AC" : "Non-AC";
  if (category === "student") {
    return {
      label: `${buildingLabel} · Student · ${rtLabel}`,
      pages: [
        building === "silver" ? "Silver Building page — Room pricing" : "Home page — Room Types section",
        "Booking page — pricing card (student mode)",
      ],
    };
  }
  return {
    label: `${buildingLabel} · Public · ${rtLabel}`,
    pages: ["Booking page — dynamic price calculator (public mode)"],
  };
}

const ROOM_TYPE_TABS = [
  { value: "ac"     as const, label: "AC Rooms",     icon: "❄️" },
  { value: "non-ac" as const, label: "Non-AC Rooms", icon: "🌀" },
];

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"student" | "public">("student");
  const [activeBuilding, setActiveBuilding] = useState<"gold" | "silver">("gold");
  const [activeRoomType, setActiveRoomType] = useState<"ac" | "non-ac">("ac");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<PricingItem>>(emptyItem);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [bookingPreference, setBookingPreference] = useState<string>("student");
  const [previewAdults, setPreviewAdults] = useState(2);
  const [previewChildren, setPreviewChildren] = useState(1);
  const [addItemType, setAddItemType] = useState<"sharing_bed" | "other">("sharing_bed");
  const [addSharingCount, setAddSharingCount] = useState<2 | 3 | 4>(2);

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

  // Strictly filtered by room_type — no fallback
  const filtered = items.filter(
    (i) => i.category === activeCategory && i.building === activeBuilding && i.room_type === activeRoomType,
  );

  // Null-type rows — used for "Initialize from existing" convenience
  const nullRows = items.filter(
    (i) => i.category === activeCategory && i.building === activeBuilding && !i.room_type,
  );

  const isPublicTab = activeCategory === "public";

  const perAdultItem = filtered.find((i) => i.price_type === "per_adult");
  const perChildItem = filtered.find((i) => i.price_type === "per_child");
  const additionalItems = filtered.filter((i) => i.price_type === "item");
  const studentTotal = filtered.filter((i) => i.is_visible).reduce((sum, i) => sum + (i.amount || 0), 0);

  const adultRate = perAdultItem?.is_visible ? (perAdultItem.amount || 0) : 0;
  const childRate = perChildItem?.is_visible ? (perChildItem.amount || 0) : 0;
  const extrasTotal = additionalItems.filter((i) => i.is_visible).reduce((sum, i) => sum + (i.amount || 0), 0);
  const publicNightlyTotal = (previewAdults * adultRate) + (previewChildren * childRate) + extrasTotal;

  const whereInfo = getWhereInfo(activeCategory, activeBuilding, activeRoomType);
  const activeRoomTab = ROOM_TYPE_TABS.find((t) => t.value === activeRoomType)!;

  // ── Initialize from null rows ─────────────────────────────────────────────
  const handleInitializeFromExisting = async () => {
    if (nullRows.length === 0) return;
    if (!confirm(`Copy existing general pricing as ${activeRoomType.toUpperCase()}-specific pricing? You can edit individual rates after.`)) return;
    setInitializing(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await supabase.from("pricing_config").insert(
      nullRows.map(({ id: _id, created_at: _ca, room_type: _rt, ...rest }) => ({
        ...rest,
        room_type: activeRoomType,
      })),
    );
    logActivity("create", "pricing", `Initialized ${activeBuilding} ${activeCategory} ${activeRoomType} pricing from general`);
    await fetchPricing();
    setInitializing(false);
  };

  // ── Create per-person rate ────────────────────────────────────────────────
  const handleCreateRate = async (priceType: "per_adult" | "per_child", label: string, amount: number) => {
    const supabase = createClient();
    await supabase.from("pricing_config").insert({
      category: activeCategory,
      building: activeBuilding,
      price_type: priceType,
      room_type: activeRoomType,
      item_name: label,
      amount,
      is_visible: true,
      display_order: priceType === "per_adult" ? 1 : 2,
    });
    logActivity("create", "pricing", `Created ${activeBuilding} ${activeCategory} ${priceType} for ${activeRoomType} at ₹${amount}`);
    await fetchPricing();
  };

  // ── Update per-person rate ────────────────────────────────────────────────
  const handleSaveRate = async (item: PricingItem, newAmount: number) => {
    const supabase = createClient();
    await supabase.from("pricing_config").update({
      amount: newAmount,
      updated_at: new Date().toISOString(),
    }).eq("id", item.id);
    logActivity("update", "pricing", `Updated ${activeBuilding} ${item.price_type} (${activeRoomType}) to ₹${newAmount}`);
    await fetchPricing();
  };

  const handleSave = async () => {
    const isSharingBedAdd = modal === "add" && activeCategory === "student" && addItemType === "sharing_bed";
    if (!isSharingBedAdd && !form.item_name?.trim()) return;
    setSaving(true);
    const supabase = createClient();

    if (modal === "add") {
      const maxOrder = Math.max(0, ...filtered.map((i) => i.display_order));
      const isSharingBed = activeCategory === "student" && addItemType === "sharing_bed";
      const itemName = isSharingBed ? `${addSharingCount}-Sharing Room` : (form.item_name || "");

      // Deduplicate: if a sharing bed with the same count already exists under this tab, update it
      const existingDuplicate = isSharingBed
        ? items.find((i) =>
            i.category === activeCategory &&
            i.building === activeBuilding &&
            i.room_type === activeRoomType &&
            (i.sharing_count === addSharingCount || i.item_name === itemName)
          )
        : null;

      if (existingDuplicate) {
        await supabase.from("pricing_config").update({
          item_name: itemName,
          amount: form.amount || 0,
          is_visible: form.is_visible ?? true,
          sharing_count: addSharingCount,
          updated_at: new Date().toISOString(),
        }).eq("id", existingDuplicate.id);
        logActivity("update", "pricing", `Updated (dedup) ${activeBuilding} ${activeCategory} ${activeRoomType}: ${itemName}`);
      } else {
        await supabase.from("pricing_config").insert({
          ...form,
          item_name: itemName,
          category: activeCategory,
          building: activeBuilding,
          price_type: "item",
          room_type: activeRoomType,
          sharing_count: isSharingBed ? addSharingCount : null,
          display_order: maxOrder + 1,
        });
        logActivity("create", "pricing", `Added ${activeBuilding} ${activeCategory} ${activeRoomType}: ${itemName}`);
      }
    } else if (form.id) {
      await supabase.from("pricing_config").update({
        item_name: form.item_name,
        amount: form.amount,
        display_order: form.display_order,
        is_visible: form.is_visible,
        updated_at: new Date().toISOString(),
      }).eq("id", form.id);
      logActivity("update", "pricing", `Updated ${activeBuilding} ${activeCategory}: ${form.item_name}`);
    }

    setModal(null);
    setForm(emptyItem);
    setAddItemType("sharing_bed");
    setAddSharingCount(2);
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

  // ── Item row ──────────────────────────────────────────────────────────────
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
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.room_type === "ac" ? "bg-sky-50 text-sky-600" : "bg-stone-100 text-stone-500"}`}>
            {item.room_type === "ac" ? "❄️ AC" : "🌀 Non-AC"}
          </span>
        </div>
      </div>
      <div className="text-right mr-4">
        <p className="font-bold text-green-700 text-lg">₹{item.amount.toLocaleString("en-IN")}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
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

  // ── Per-person rate editor (public tab) ───────────────────────────────────
  const RateEditor = ({
    item, label, icon, priceType,
  }: {
    item: PricingItem | undefined;
    label: string;
    icon: string;
    priceType: "per_adult" | "per_child";
  }) => {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(item?.amount || 0);

    if (!item) {
      return (
        <CreateRateCard
          label={label}
          icon={icon}
          priceType={priceType}
          onCreated={fetchPricing}
          activeCategory={activeCategory}
          activeBuilding={activeBuilding}
          activeRoomType={activeRoomType}
          handleCreateRate={handleCreateRate}
        />
      );
    }

    return (
      <div className={`rounded-xl border-2 p-5 transition-all ${item.is_visible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400">Per night · {activeRoomType === "ac" ? "❄️ AC" : "🌀 Non-AC"}</p>
            </div>
          </div>
          <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
            {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
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

  // ── Empty state with initialize option ────────────────────────────────────
  const EmptyState = ({ forPublic }: { forPublic: boolean }) => (
    <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
      <div className="text-3xl mb-3">{activeRoomTab.icon}</div>
      <p className="font-semibold text-gray-600 mb-1">
        No {activeRoomType.toUpperCase()} pricing set up yet
      </p>
      <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
        {nullRows.length > 0
          ? `You have ${nullRows.length} general pricing item${nullRows.length !== 1 ? "s" : ""}. Copy them as a starting point, then edit individual rates.`
          : `Use the "Add ${forPublic ? "Extra Item" : "Item"}" button above to add pricing for ${activeBuilding} ${activeCategory} ${activeRoomType.toUpperCase()} rooms.`}
      </p>
      {nullRows.length > 0 && (
        <button
          onClick={handleInitializeFromExisting}
          disabled={initializing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm"
        >
          <Copy size={14} />
          {initializing ? "Copying…" : "Copy existing pricing as starting point"}
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-500 text-sm mt-1">Manage pricing for Gold &amp; Silver buildings</p>
        </div>
        <button
          onClick={() => {
            setForm({ ...emptyItem, category: activeCategory, building: activeBuilding, room_type: activeRoomType });
            setModal("add");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add {isPublicTab ? "Extra Item" : "Item"}
        </button>
      </div>

      {/* Booking mode banner */}
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

      {/* ── Category dropdown ── */}
      <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 focus-within:border-primary/40 transition-colors">
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Updating prices for:</span>
        <div className="relative flex-1">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as "student" | "public")}
            className="w-full font-bold text-gray-900 text-sm bg-transparent border-none outline-none cursor-pointer appearance-none pr-6"
          >
            <option value="student">🎓 Student Pricing — monthly flat rates</option>
            <option value="public">🌐 Public Pricing — nightly per-person rates</option>
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Building tabs ── */}
      <div className="flex gap-2 mb-3">
        {(["gold", "silver"] as const).map((b) => (
          <button key={b} onClick={() => setActiveBuilding(b)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              activeBuilding === b
                ? b === "gold" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300" : "bg-slate-100 text-slate-700 border-2 border-slate-300"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${b === "gold" ? "bg-yellow-400" : "bg-slate-400"}`} />
            {b === "gold" ? "Gold Building" : "Silver Building"}
          </button>
        ))}
      </div>

      {/* ── Room type tabs ── */}
      <div className="flex gap-2 mb-5">
        {ROOM_TYPE_TABS.map(({ value, label, icon }) => (
          <button key={value} onClick={() => setActiveRoomType(value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeRoomType === value
                ? value === "ac"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
                  : "bg-slate-600 text-white shadow-sm shadow-slate-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span>{icon}</span> {label}
            {/* Item count badge */}
            {(() => {
              const cnt = items.filter(i => i.category === activeCategory && i.building === activeBuilding && i.room_type === value).length;
              return cnt > 0 ? (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeRoomType === value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {cnt}
                </span>
              ) : null;
            })()}
          </button>
        ))}
      </div>

      {/* Context breadcrumb */}
      <div className="mb-5 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-500 flex items-center gap-1.5">
        <span className="font-semibold text-gray-700">{whereInfo.label}</span>
        <span className="text-gray-300">—</span>
        <span>prices below apply only to {activeRoomType === "ac" ? "AC (air-conditioned)" : "Non-AC (fan)"} rooms</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content ── */}
        <div className="lg:col-span-2">
          {isPublicTab ? (
            <div className="space-y-5">
              {/* Per-person rates */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={14} className="text-gray-400" /> Per-Person Rates
                  <span className="text-xs font-normal text-gray-400 ml-1">— per night</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <RateEditor item={perAdultItem} label="Per Adult" icon="🧑" priceType="per_adult" />
                  <RateEditor item={perChildItem} label="Per Child" icon="👶" priceType="per_child" />
                </div>
              </div>

              {/* Additional items */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IndianRupee size={14} className="text-gray-400" /> Additional Items
                  <span className="text-xs font-normal text-gray-400">(food, extras, etc.)</span>
                </h3>
                {additionalItems.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-sm">
                    <p>No additional items yet.</p>
                    <p className="text-xs mt-0.5">Click &quot;Add Extra Item&quot; above to add food, laundry, etc.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {[...additionalItems].sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                      <ItemRow key={item.id} item={item} idx={idx} list={additionalItems} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Student tab */
            filtered.length === 0 ? (
              <EmptyState forPublic={false} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {[...filtered].sort((a, b) => a.display_order - b.display_order).map((item, idx) => (
                  <ItemRow key={item.id} item={item} idx={idx} list={filtered} />
                ))}
              </div>
            )
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-5">
          {/* Where used */}
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

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-8">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Live Preview</h3>
            <p className="text-xs text-gray-400 mb-4">
              {isPublicTab ? "Nightly price as shown on booking page" : "Prices shown on website"}
            </p>

            <div className={`rounded-xl p-4 ${activeBuilding === "gold" ? "bg-yellow-50" : "bg-slate-50"}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-navy text-sm capitalize">
                  {activeBuilding} · {activeCategory}
                </h4>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activeRoomType === "ac" ? "bg-sky-100 text-sky-700" : "bg-stone-100 text-stone-600"}`}>
                  {activeRoomTab.icon} {activeRoomType.toUpperCase()}
                </span>
              </div>

              {isPublicTab ? (
                filtered.filter(i => i.is_visible).length === 0 && !perAdultItem && !perChildItem ? (
                  <p className="text-xs text-gray-400 text-center py-3">No rates configured yet</p>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Adults</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setPreviewAdults(Math.max(1, previewAdults - 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30" disabled={previewAdults <= 1}><Minus size={10} /></button>
                          <span className="w-6 text-center font-bold text-sm text-navy">{previewAdults}</span>
                          <button onClick={() => setPreviewAdults(Math.min(10, previewAdults + 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary"><Plus size={10} /></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Children</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setPreviewChildren(Math.max(0, previewChildren - 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30" disabled={previewChildren <= 0}><Minus size={10} /></button>
                          <span className="w-6 text-center font-bold text-sm text-navy">{previewChildren}</span>
                          <button onClick={() => setPreviewChildren(Math.min(10, previewChildren + 1))} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary"><Plus size={10} /></button>
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
                )
              ) : (
                filtered.filter((i) => i.is_visible).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">No visible items</p>
                ) : (
                  <div className="space-y-2">
                    {[...filtered].filter((i) => i.is_visible).sort((a, b) => a.display_order - b.display_order).map((item) => (
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

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add Pricing Item" : "Edit Pricing Item"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeBuilding} · {activeCategory} · {activeRoomTab.icon} {activeRoomType.toUpperCase()}
                </p>
              </div>
              <button onClick={() => { setModal(null); setForm(emptyItem); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Student Add: item type selector */}
              {modal === "add" && activeCategory === "student" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Item Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["sharing_bed", "other"] as const).map((t) => (
                      <button
                        key={t} type="button"
                        onClick={() => setAddItemType(t)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          addItemType === t
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-primary/30"
                        }`}
                      >
                        {t === "sharing_bed" ? "🛏 Sharing Bed" : "📦 Other"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sharing Bed selector (student + sharing_bed mode) */}
              {modal === "add" && activeCategory === "student" && addItemType === "sharing_bed" ? (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Sharing Count</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([2, 3, 4] as const).map((n) => (
                      <button
                        key={n} type="button"
                        onClick={() => setAddSharingCount(n)}
                        className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                          addSharingCount === n
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-primary/30"
                        }`}
                      >
                        {n}-Sharing
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Item name will be set to &ldquo;{addSharingCount}-Sharing Room&rdquo;</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Item Name *</label>
                  <input
                    type="text" value={form.item_name || ""}
                    onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={isPublicTab ? "e.g., Food (per day)" : "e.g., Extra charges"}
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹) *</label>
                <div className="relative">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number" value={form.amount || ""}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                    autoFocus={modal === "add" && activeCategory === "student" && addItemType === "sharing_bed"}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_visible ?? true} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="w-4 h-4 rounded text-primary" />
                <span className="text-sm text-gray-600">Visible on website</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setModal(null); setForm(emptyItem); setAddItemType("sharing_bed"); setAddSharingCount(2); }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || (!(activeCategory === "student" && addItemType === "sharing_bed") && !form.item_name?.trim())}
                className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60"
              >
                {saving ? "Saving…" : modal === "add" ? "Add Item" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Separate component to avoid hooks-in-callbacks issue ─────────────────────
function CreateRateCard({
  label, icon, priceType, activeCategory, activeBuilding, activeRoomType, handleCreateRate,
}: {
  label: string;
  icon: string;
  priceType: "per_adult" | "per_child";
  activeCategory: string;
  activeBuilding: string;
  activeRoomType: string;
  onCreated: () => void;
  handleCreateRate: (pt: "per_adult" | "per_child", label: string, amount: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(0);
  const [saving, setSaving] = useState(false);

  void activeCategory; void activeBuilding;

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="font-semibold text-gray-700 text-sm">{label}</p>
          <p className="text-xs text-gray-400">
            Not set for {activeRoomType === "ac" ? "❄️ AC" : "🌀 Non-AC"} rooms
          </p>
        </div>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number" value={val || ""}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              autoFocus placeholder="Enter rate"
            />
          </div>
          <button
            onClick={async () => {
              if (!val) return;
              setSaving(true);
              await handleCreateRate(priceType, label, val);
              setSaving(false);
              setEditing(false);
            }}
            disabled={saving || !val}
            className="px-4 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "…" : "Set"}
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm bg-white">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full py-2.5 border-2 border-dashed border-primary/30 text-primary text-sm font-semibold rounded-xl hover:border-primary/60 hover:bg-primary/5 transition-all"
        >
          + Set {activeRoomType === "ac" ? "AC" : "Non-AC"} rate
        </button>
      )}
    </div>
  );
}
