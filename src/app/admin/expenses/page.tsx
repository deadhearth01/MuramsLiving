"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, Trash2, TrendingDown, ShoppingCart, Wrench, Zap, MoreHorizontal,
  ChevronDown, ChevronRight, CalendarDays, Calendar, BarChart3, ChevronUp,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface ExpenseItem {
  id: string;
  expense_date: string;
  item_name: string;
  category: "food" | "maintenance" | "utility" | "other";
  amount: number;
  created_at: string;
}

type View = "daily" | "monthly" | "yearly";
type Category = "food" | "maintenance" | "utility" | "other";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const categoryConfig: Record<Category, {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  bar: string;
  border: string;
}> = {
  food:        { label: "Food",        icon: ShoppingCart,   color: "text-orange-600", bg: "bg-orange-50",  bar: "bg-orange-400", border: "border-orange-200" },
  maintenance: { label: "Maintenance", icon: Wrench,          color: "text-blue-600",   bg: "bg-blue-50",    bar: "bg-blue-400",   border: "border-blue-200" },
  utility:     { label: "Utility",     icon: Zap,             color: "text-purple-600", bg: "bg-purple-50",  bar: "bg-purple-400", border: "border-purple-200" },
  other:       { label: "Other",       icon: MoreHorizontal,  color: "text-gray-600",   bg: "bg-gray-100",   bar: "bg-gray-400",   border: "border-gray-200" },
};

function formatMonthKey(key: string) {
  const [y, m] = key.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

function fmtINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// ── Category breakdown bar ─────────────────────────────────────────────────
function CategoryBars({ categories, total }: { categories: Record<string, number>; total: number }) {
  const cats = (Object.entries(categoryConfig) as [Category, typeof categoryConfig[Category]][])
    .filter(([k]) => (categories[k] || 0) > 0);
  if (cats.length === 0) return null;
  return (
    <div className="space-y-1.5">
      {cats.map(([k, cfg]) => {
        const pct = Math.round(((categories[k] || 0) / total) * 100);
        return (
          <div key={k} className="flex items-center gap-2">
            <span className={`text-xs font-medium ${cfg.color} w-[72px] flex-shrink-0`}>{cfg.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-0">
              <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-20 text-right flex-shrink-0">
              {fmtINR(categories[k] || 0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Category chips ─────────────────────────────────────────────────────────
function CategoryChips({ categories }: { categories: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.entries(categoryConfig) as [Category, typeof categoryConfig[Category]][])
        .filter(([k]) => (categories[k] || 0) > 0)
        .map(([k, cfg]) => {
          const Icon = cfg.icon;
          return (
            <span
              key={k}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}
            >
              <Icon size={10} />
              {fmtINR(categories[k] || 0)}
            </span>
          );
        })}
    </div>
  );
}

// ── Daily items list (reused in expanded views) ────────────────────────────
function DayBlock({
  date,
  dayItems,
  compact = false,
  onDelete,
}: {
  date: string;
  dayItems: ExpenseItem[];
  compact?: boolean;
  onDelete: (id: string) => void;
}) {
  const dayTotal = dayItems.reduce((s, i) => s + (i.amount || 0), 0);
  const dateObj = new Date(date + "T00:00:00");

  return (
    <div className={compact ? "" : "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"}>
      <div className={`flex items-center justify-between border-b border-gray-100 ${compact ? "px-5 py-2 bg-gray-50" : "px-5 py-3 bg-gray-50"}`}>
        <div className="flex items-center gap-3">
          <span className={`font-semibold text-gray-900 ${compact ? "text-xs" : "text-sm"}`}>
            {compact
              ? dateObj.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
              : dateObj.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          {!compact && (
            <Link href={`/admin/expenses/new?date=${date}`} className="text-xs text-primary hover:underline font-medium">
              + Add
            </Link>
          )}
        </div>
        <span className={`font-bold text-red-600 ${compact ? "text-xs" : "text-sm"}`}>{fmtINR(dayTotal)}</span>
      </div>
      <div className="divide-y divide-gray-50">
        {dayItems.map((item) => {
          const cat = categoryConfig[item.category] || categoryConfig.other;
          const Icon = cat.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={12} className={cat.color} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-800">{item.item_name}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">{cat.label}</span>
              <span className="font-semibold text-sm text-gray-900">{fmtINR(item.amount)}</span>
              <button
                onClick={() => onDelete(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors ml-1 flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ExpensesPage() {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("monthly");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [showGraph, setShowGraph] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("expense_items")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense item?")) return;
    const supabase = createClient();
    await supabase.from("expense_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleExpand = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ── Group data ────────────────────────────────────────────────────────────
  type MonthData = { total: number; categories: Record<string, number>; items: ExpenseItem[] };
  type YearData = { total: number; categories: Record<string, number>; months: Record<string, { total: number; categories: Record<string, number> }> };

  const dailyGroups: Record<string, ExpenseItem[]> = {};
  const monthlyGroups: Record<string, MonthData> = {};
  const yearlyGroups: Record<string, YearData> = {};

  for (const item of items) {
    // daily
    if (!dailyGroups[item.expense_date]) dailyGroups[item.expense_date] = [];
    dailyGroups[item.expense_date].push(item);

    // monthly
    const mk = item.expense_date.substring(0, 7);
    if (!monthlyGroups[mk]) monthlyGroups[mk] = { total: 0, categories: {}, items: [] };
    monthlyGroups[mk].total += item.amount || 0;
    monthlyGroups[mk].categories[item.category] = (monthlyGroups[mk].categories[item.category] || 0) + (item.amount || 0);
    monthlyGroups[mk].items.push(item);

    // yearly
    const yk = item.expense_date.substring(0, 4);
    if (!yearlyGroups[yk]) yearlyGroups[yk] = { total: 0, categories: {}, months: {} };
    yearlyGroups[yk].total += item.amount || 0;
    yearlyGroups[yk].categories[item.category] = (yearlyGroups[yk].categories[item.category] || 0) + (item.amount || 0);
    if (!yearlyGroups[yk].months[mk]) yearlyGroups[yk].months[mk] = { total: 0, categories: {} };
    yearlyGroups[yk].months[mk].total += item.amount || 0;
    yearlyGroups[yk].months[mk].categories[item.category] = (yearlyGroups[yk].months[mk].categories[item.category] || 0) + (item.amount || 0);
  }

  const allTimeTotal = items.reduce((s, i) => s + (i.amount || 0), 0);
  const todayStr = new Date().toISOString().split("T")[0];

  // Graph data — last 12 months with category breakdown
  const graphData = (() => {
    const result = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = MONTHS[d.getMonth()].slice(0, 3);
      const data = monthlyGroups[key];
      result.push({
        month: label,
        Food:        Math.round(data?.categories["food"]        || 0),
        Maintenance: Math.round(data?.categories["maintenance"] || 0),
        Utility:     Math.round(data?.categories["utility"]     || 0),
        Other:       Math.round(data?.categories["other"]       || 0),
        total:       Math.round(data?.total || 0),
      });
    }
    return result;
  })();

  const viewMeta: { v: View; label: string; Icon: React.ElementType }[] = [
    { v: "daily",   label: "Daily",   Icon: CalendarDays },
    { v: "monthly", label: "Monthly", Icon: Calendar },
    { v: "yearly",  label: "Yearly",  Icon: BarChart3 },
  ];

  const viewCount =
    view === "daily"   ? `${Object.keys(dailyGroups).length} days` :
    view === "monthly" ? `${Object.keys(monthlyGroups).length} months` :
                         `${Object.keys(yearlyGroups).length} year${Object.keys(yearlyGroups).length !== 1 ? "s" : ""}`;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 text-sm mt-1">
            All-time total:{" "}
            <span className="font-bold text-red-600">{fmtINR(allTimeTotal)}</span>
          </p>
        </div>
        <Link
          href={`/admin/expenses/new?date=${todayStr}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
        >
          <Plus size={16} /> Add Expense
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>
      )}

      {/* View Switcher + Graph toggle */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-0.5 bg-gray-100 p-1 rounded-xl">
          {viewMeta.map(({ v, label, Icon }) => (
            <button
              key={v}
              onClick={() => { setView(v); setExpanded(new Set()); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === v
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{viewCount} recorded</span>
        <button
          onClick={() => setShowGraph((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
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
          <p className="text-sm font-semibold text-gray-700 mb-4">Monthly Expenses — Last 12 Months</p>
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 480 }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={graphData} barSize={18} barCategoryGap="30%">
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
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Food"        stackId="a" fill="#fb923c" radius={[0,0,0,0]} />
                  <Bar dataKey="Maintenance" stackId="a" fill="#60a5fa" radius={[0,0,0,0]} />
                  <Bar dataKey="Utility"     stackId="a" fill="#a78bfa" radius={[0,0,0,0]} />
                  <Bar dataKey="Other"       stackId="a" fill="#9ca3af" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
          <TrendingDown size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-4">No expenses recorded yet</p>
          <Link
            href={`/admin/expenses/new?date=${todayStr}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl"
          >
            <Plus size={15} /> Add First Expense
          </Link>
        </div>
      ) : (
        <>
          {/* ── DAILY VIEW ─────────────────────────────────────────── */}
          {view === "daily" && (
            <div className="space-y-4">
              {Object.entries(dailyGroups).map(([date, dayItems]) => (
                <DayBlock key={date} date={date} dayItems={dayItems} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* ── MONTHLY VIEW ───────────────────────────────────────── */}
          {view === "monthly" && (
            <div className="space-y-3">
              {Object.entries(monthlyGroups)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([mk, data]) => {
                  const isOpen = expanded.has(mk);
                  // rebuild day groups for this month
                  const dayGroups: Record<string, ExpenseItem[]> = {};
                  for (const item of data.items) {
                    if (!dayGroups[item.expense_date]) dayGroups[item.expense_date] = [];
                    dayGroups[item.expense_date].push(item);
                  }

                  return (
                    <div key={mk} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Month header — clickable */}
                      <button
                        onClick={() => toggleExpand(mk)}
                        className="w-full px-5 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition-colors text-left"
                      >
                        {/* Left: month name + bars */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="font-bold text-gray-900">{formatMonthKey(mk)}</span>
                            <span className="text-xs text-gray-400">
                              {data.items.length} items · {Object.keys(dayGroups).length} days
                            </span>
                          </div>
                          <CategoryBars categories={data.categories} total={data.total} />
                          <div className="mt-2.5">
                            <CategoryChips categories={data.categories} />
                          </div>
                        </div>

                        {/* Right: total + toggle */}
                        <div className="flex-shrink-0 flex flex-col items-end gap-2 pt-0.5">
                          <span className="text-xl font-bold text-red-600">{fmtINR(data.total)}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            {isOpen ? "Hide" : "Daily"}
                          </span>
                        </div>
                      </button>

                      {/* Expanded: per-day items */}
                      {isOpen && (
                        <div className="border-t border-gray-100 bg-gray-50/30">
                          {Object.entries(dayGroups)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([date, dayItems]) => (
                              <DayBlock
                                key={date}
                                date={date}
                                dayItems={dayItems}
                                compact
                                onDelete={handleDelete}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* ── YEARLY VIEW ────────────────────────────────────────── */}
          {view === "yearly" && (
            <div className="space-y-4">
              {Object.entries(yearlyGroups)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([year, data]) => {
                  const isOpen = expanded.has(year);
                  const sortedMonths = Object.entries(data.months).sort(([a], [b]) => b.localeCompare(a));

                  return (
                    <div key={year} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Year header */}
                      <button
                        onClick={() => toggleExpand(year)}
                        className="w-full px-5 py-5 flex items-start gap-4 hover:bg-gray-50/60 transition-colors text-left"
                      >
                        {/* Left */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-bold text-gray-900">{year}</span>
                            <span className="text-xs text-gray-400">
                              {sortedMonths.length} month{sortedMonths.length !== 1 ? "s" : ""} · {items.filter(i => i.expense_date.startsWith(year)).length} items
                            </span>
                          </div>
                          <CategoryBars categories={data.categories} total={data.total} />
                          <div className="mt-2.5">
                            <CategoryChips categories={data.categories} />
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex-shrink-0 flex flex-col items-end gap-2 pt-0.5">
                          <span className="text-2xl font-bold text-red-600">{fmtINR(data.total)}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            {isOpen ? "Hide months" : "By month"}
                          </span>
                        </div>
                      </button>

                      {/* Expanded: monthly sub-cards */}
                      {isOpen && (
                        <div className="border-t border-gray-100 divide-y divide-gray-100">
                          {sortedMonths.map(([mk, mData]) => {
                            const mItemCount = items.filter(i => i.expense_date.startsWith(mk)).length;
                            return (
                              <div key={mk} className="px-5 py-4 bg-gray-50/30">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-semibold text-gray-800 text-sm">{formatMonthKey(mk)}</span>
                                      <span className="text-xs text-gray-400">{mItemCount} items</span>
                                    </div>
                                    <CategoryBars categories={mData.categories} total={mData.total} />
                                    <div className="mt-2">
                                      <CategoryChips categories={mData.categories} />
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                                    <span className="font-bold text-red-500 text-sm">{fmtINR(mData.total)}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setView("monthly"); setExpanded(new Set([mk])); }}
                                      className="text-xs text-primary hover:underline font-medium"
                                    >
                                      See days →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
