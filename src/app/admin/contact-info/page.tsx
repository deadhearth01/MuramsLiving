"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Phone, Mail, MapPin, MessageSquare, Globe, Instagram, Facebook, Check, Pencil } from "lucide-react";

interface ContactInfo {
  id: string;
  key: string;
  value: string;
  label: string;
}

const iconMap: Record<string, React.ElementType> = {
  phone_primary: Phone,
  phone_secondary: Phone,
  email: Mail,
  address: MapPin,
  whatsapp: MessageSquare,
  google_maps: Globe,
  instagram: Instagram,
  facebook: Facebook,
};

export default function ContactInfoPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("contact_info").select("*").order("key");
    setContacts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleSave = async (key: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("contact_info").update({ value: editValue, updated_at: new Date().toISOString() }).eq("key", key);
    setEditingKey(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
    await fetchContacts();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-20" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Info</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the contact details shown on your website.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {contacts.map((contact) => {
          const Icon = iconMap[contact.key] || Globe;
          const isEditing = editingKey === contact.key;
          const wasSaved = saved === contact.key;
          return (
            <div key={contact.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{contact.label}</span>
                {wasSaved && (
                  <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                    <Check size={13} /> Saved
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {contact.key === "address" ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingKey(null)}
                      className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(contact.key)}
                      disabled={saving}
                      className="flex-[2] py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-600 flex-1 break-all">
                    {contact.value || <span className="text-gray-300 italic">Not set</span>}
                  </p>
                  <button
                    onClick={() => { setEditingKey(contact.key); setEditValue(contact.value || ""); }}
                    className="text-gray-400 hover:text-primary transition-colors flex-shrink-0"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
