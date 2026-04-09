"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Phone, Mail, Clock, Trash2, CheckCircle, Circle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: "new" | "read" | "replied";
  created_at: string;
}

const STATUS_CONFIG = {
  new:     { label: "New",     bg: "bg-blue-100",  text: "text-blue-700",  dot: "bg-blue-500" },
  read:    { label: "Read",    bg: "bg-gray-100",   text: "text-gray-600",  dot: "bg-gray-400" },
  replied: { label: "Replied", bg: "bg-green-100",  text: "text-green-700", dot: "bg-green-500" },
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("site_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setEnquiries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: Enquiry["status"]) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("site_enquiries").update({ status }).eq("id", id);
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    setUpdating(null);
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry? This cannot be undone.")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("site_enquiries").delete().eq("id", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  const counts = {
    all:     enquiries.length,
    new:     enquiries.filter((e) => e.status === "new").length,
    read:    enquiries.filter((e) => e.status === "read").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-28 border border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Enquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">Messages received from the Contact Us page.</p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "new", "read", "replied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? "bg-navy text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span className="capitalize">{f}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Enquiries list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No {filter !== "all" ? filter : ""} enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((enq) => {
              const cfg = STATUS_CONFIG[enq.status];
              return (
                <motion.div
                  key={enq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    enq.status === "new" ? "border-blue-100 shadow-sm" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{enq.name}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />
                          {formatDate(enq.created_at)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                          <Phone size={13} />
                          {enq.phone}
                        </a>
                        {enq.email && (
                          <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
                            <Mail size={13} />
                            {enq.email}
                          </a>
                        )}
                      </div>

                      {enq.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                          {enq.message}
                        </p>
                      )}
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {enq.status !== "read" && (
                        <button
                          onClick={() => updateStatus(enq.id, "read")}
                          disabled={updating === enq.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Circle size={12} />
                          Mark Read
                        </button>
                      )}
                      {enq.status !== "replied" && (
                        <button
                          onClick={() => updateStatus(enq.id, "replied")}
                          disabled={updating === enq.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={12} />
                          Mark Replied
                        </button>
                      )}
                      <button
                        onClick={() => deleteEnquiry(enq.id)}
                        disabled={deleting === enq.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
