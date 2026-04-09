"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, ShoppingCart, Wrench, Zap, MoreHorizontal, ArrowLeft, Check } from "lucide-react";

interface LineItem {
  item_name: string;
  category: "food" | "maintenance" | "utility" | "other";
  amount: string;
}

const categoryConfig = {
  food:        { label: "Food & Grocery", icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-200",  active: "bg-orange-100 border-orange-400" },
  maintenance: { label: "Maintenance",    icon: Wrench,       color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200",    active: "bg-blue-100 border-blue-400" },
  utility:     { label: "Utility / Bills",icon: Zap,          color: "text-purple-600", bg: "bg-purple-50",  border: "border-purple-200",  active: "bg-purple-100 border-purple-400" },
  other:       { label: "Other",          icon: MoreHorizontal,color: "text-gray-600",  bg: "bg-gray-50",    border: "border-gray-200",    active: "bg-gray-100 border-gray-400" },
};

const emptyLine = (): LineItem => ({ item_name: "", category: "food", amount: "" });

function NewExpensesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(dateParam);
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const addLine = () => setLines(prev => [...prev, emptyLine()]);
  const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof LineItem, value: string) => {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const total = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const validLines = lines.filter(l => l.item_name.trim() && parseFloat(l.amount) > 0);

  const handleSave = async () => {
    if (!date || validLines.length === 0) {
      setError("Add at least one item with a name and amount.");
      return;
    }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const inserts = validLines.map(l => ({
      expense_date: date,
      item_name: l.item_name.trim(),
      category: l.category,
      amount: parseFloat(l.amount),
    }));
    const { error: err } = await supabase.from("expense_items").insert(inserts);
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSaved(true);
    setTimeout(() => router.push("/admin/expenses"), 800);
  };

  if (saved) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-600" />
          </div>
          <p className="font-bold text-gray-900 text-lg">Expenses saved!</p>
          <p className="text-gray-500 text-sm mt-1">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expenses</h1>
          <p className="text-gray-500 text-sm mt-0.5">Record daily expense items</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>}

      {/* Date */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Expense Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-sm">Expense Items</span>
          <span className="text-xs text-gray-400">{lines.length} item{lines.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="divide-y divide-gray-50">
          {lines.map((line, i) => {
            const cat = categoryConfig[line.category];
            const Icon = cat.icon;
            return (
              <div key={i} className="p-4 space-y-3">
                {/* Category selector */}
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(categoryConfig) as [string, typeof categoryConfig["food"]][]).map(([key, c]) => {
                    const CIcon = c.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateLine(i, "category", key as LineItem["category"])}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          line.category === key ? `${c.active} ${c.color}` : `border-gray-200 text-gray-400 hover:border-gray-300`
                        }`}
                      >
                        <CIcon size={12} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Item name + amount */}
                <div className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} className={cat.color} />
                  </div>
                  <input
                    type="text"
                    placeholder="Item description (e.g., Rice 2 bags)"
                    value={line.item_name}
                    onChange={(e) => updateLine(i, "item_name", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="relative flex-shrink-0 w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={line.amount}
                      onChange={(e) => updateLine(i, "amount", e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  {lines.length > 1 && (
                    <button
                      onClick={() => removeLine(i)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={addLine}
            className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors"
          >
            <Plus size={15} />
            Add Another Item
          </button>
        </div>
      </div>

      {/* Total + Save */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-600">Total for {date}</span>
          <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || validLines.length === 0}
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm disabled:opacity-50"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Check size={16} /> Save {validLines.length} Item{validLines.length !== 1 ? "s" : ""}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewExpensePage() {
  return (
    <Suspense fallback={<div className="p-6 lg:p-8"><div className="bg-white rounded-2xl p-8 animate-pulse h-64" /></div>}>
      <NewExpensesContent />
    </Suspense>
  );
}
