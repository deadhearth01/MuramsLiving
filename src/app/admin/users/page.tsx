"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Pencil, Trash2, X, Mail, Key, AlertCircle, RefreshCw, Copy, Check, Shield, Settings2, Users } from "lucide-react";
import { logActivity } from "@/utils/activity-logger";

const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  role_id: string | null;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

interface AdminRole {
  id: string;
  name: string;
  pages: string[];
  created_at: string;
}

const PAGE_OPTIONS = [
  { key: "bookings", label: "Bookings" },
  { key: "availability", label: "Room Availability" },
  { key: "students", label: "Students Info" },
  { key: "payments", label: "Payments" },
  { key: "expenses", label: "Expenses" },
  { key: "workers", label: "Workers" },
  { key: "enquiries", label: "Site Enquiries" },
  { key: "contact-info", label: "Contact Info" },
  { key: "activity-log", label: "Activity Log" },
  { key: "pricing", label: "Pricing" },
  { key: "users", label: "User Management" },
];

const emptyUser: { email: string; name: string; role: "admin" | "staff"; is_active: boolean; password: string; id?: string; role_id?: string } = {
  email: "", name: "", role: "staff", is_active: true, password: "", role_id: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | "self" | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [selfForm, setSelfForm] = useState({ email: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [roleModal, setRoleModal] = useState<"add" | "edit" | null>(null);
  const [roleForm, setRoleForm] = useState<{ id?: string; name: string; pages: string[] }>({ name: "", pages: [] });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchUsers = useCallback(async () => {
    const supabase = createClient();
    const [{ data: authData }, { data: usersData }, { data: rolesData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("admin_users").select("id, email, name, role, is_active, last_login, created_at, role_id").order("created_at"),
      supabase.from("admin_roles").select("*").order("created_at"),
    ]);
    setCurrentEmail(authData?.user?.email || "");
    setUsers(usersData || []);
    setRoles(rolesData || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSave = async () => {
    setError("");
    if (!form.email || !form.name) { setError("Email and name are required"); return; }
    if (modal === "add" && !form.password) { setError("Password is required for new users"); return; }
    setSaving(true);

    try {
      if (modal === "add") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.toLowerCase().trim(),
            password: form.password,
            role: form.role,
            role_id: form.role_id || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed to create user"); setSaving(false); return; }
      } else if (form.id) {
        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: form.id,
            name: form.name.trim(),
            role: form.role,
            role_id: form.role_id || null,
            is_active: form.is_active,
            ...(form.password ? { password: form.password } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed to update user"); setSaving(false); return; }
      }
    } catch {
      setError("Network error"); setSaving(false); return;
    }

    logActivity(modal === "add" ? "create" : "update", "users", `${modal === "add" ? "Created" : "Updated"} user: ${form.email}`);
    setModal(null);
    setForm(emptyUser);
    await fetchUsers();
    setSaving(false);
  };

  const handleSaveSelf = async () => {
    setError("");
    setSaving(true);
    const supabase = createClient();
    const updates: Record<string, string> = {};
    if (selfForm.email.trim() && selfForm.email !== currentEmail) updates.email = selfForm.email.trim();
    if (selfForm.newPassword.trim()) updates.password = selfForm.newPassword.trim();

    if (Object.keys(updates).length === 0) {
      setError("No changes to save.");
      setSaving(false);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser(updates);
    if (authError) { setError(authError.message); setSaving(false); return; }

    // Also update admin_users table email if changed
    if (updates.email) {
      await supabase.from("admin_users")
        .update({ email: updates.email, updated_at: new Date().toISOString() })
        .eq("email", currentEmail);
      setCurrentEmail(updates.email);
    }

    setSuccess("Account updated successfully!");
    setModal(null);
    setSelfForm({ email: "", newPassword: "" });
    setTimeout(() => setSuccess(""), 3000);
    await fetchUsers();
    setSaving(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === currentEmail) { alert("You cannot delete your own account."); return; }
    if (users.length <= 1) { alert("Cannot delete the last admin user!"); return; }
    if (!confirm(`Delete user ${email}?`)) return;
    const supabase = createClient();
    await supabase.from("admin_users").delete().eq("id", id);
    await fetchUsers();
  };

  const toggleActive = async (id: string, email: string, current: boolean) => {
    if (email === currentEmail && current) { alert("You cannot deactivate your own account!"); return; }
    if (users.filter(u => u.is_active).length <= 1 && current) {
      alert("Cannot deactivate the last active admin!"); return;
    }
    const supabase = createClient();
    await supabase.from("admin_users").update({ is_active: !current }).eq("id", id);
    await fetchUsers();
  };

  const handleSaveRole = async () => {
    if (!roleForm.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    if (roleModal === "add") {
      await supabase.from("admin_roles").insert({ name: roleForm.name.trim(), pages: roleForm.pages });
    } else if (roleForm.id) {
      await supabase.from("admin_roles").update({ name: roleForm.name.trim(), pages: roleForm.pages, updated_at: new Date().toISOString() }).eq("id", roleForm.id);
    }
    setRoleModal(null);
    setRoleForm({ name: "", pages: [] });
    await fetchUsers();
    setSaving(false);
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    const supabase = createClient();
    await supabase.from("admin_roles").delete().eq("id", id);
    await fetchUsers();
  };

  const toggleRolePage = (page: string) => {
    setRoleForm((prev) => ({
      ...prev,
      pages: prev.pages.includes(page) ? prev.pages.filter((p) => p !== page) : [...prev.pages, page],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-3">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.filter(u => u.is_active).length} active users</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelfForm({ email: currentEmail, newPassword: "" }); setModal("self"); setError(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary/30 transition-all text-sm shadow-sm"
          >
            <Shield size={15} /> My Account
          </button>
          <button
            onClick={() => { setForm(emptyUser); setModal("add"); setError(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200 flex items-center gap-2">
          <Check size={15} /> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "users" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <Users size={16} /> Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "roles" ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
          }`}
        >
          <Settings2 size={16} /> Roles
        </button>
      </div>

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">Define roles with specific page access permissions</p>
            <button
              onClick={() => { setRoleForm({ name: "", pages: [] }); setRoleModal("add"); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
            >
              <Plus size={16} /> Add Role
            </button>
          </div>
          <div className="grid gap-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 capitalize">{role.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setRoleForm({ id: role.id, name: role.name, pages: role.pages || [] }); setRoleModal("edit"); }}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.pages?.length > 0 ? role.pages.map((p) => (
                    <span key={p} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg capitalize">
                      {PAGE_OPTIONS.find((o) => o.key === p)?.label || p}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-400">No pages assigned — this role has full access</span>
                  )}
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                <Settings2 size={40} className="mx-auto mb-3 opacity-30" />
                <p>No roles created yet</p>
              </div>
            )}
          </div>

          {/* Role Modal */}
          {roleModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{roleModal === "add" ? "Create New Role" : "Edit Role"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Define a role with specific page access permissions</p>
                  </div>
                  <button onClick={() => setRoleModal(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-5">
                  {/* Role Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role Name *</label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g., Manager, Accountant, Receptionist"
                      autoFocus
                    />
                  </div>

                  {/* Page Access */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Page Access</label>
                        <p className="text-xs text-gray-400 mt-0.5">Dashboard is always visible for all roles</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRoleForm({ ...roleForm, pages: PAGE_OPTIONS.map((p) => p.key) })}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => setRoleForm({ ...roleForm, pages: [] })}
                          className="text-xs text-gray-500 font-medium hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Selected count badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-lg">
                        {roleForm.pages.length} of {PAGE_OPTIONS.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {PAGE_OPTIONS.map((page) => {
                        const isChecked = roleForm.pages.includes(page.key);
                        return (
                          <label
                            key={page.key}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "border-primary/30 bg-primary/5 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleRolePage(page.key)}
                              className="w-4 h-4 rounded text-primary accent-primary"
                            />
                            <span className={`text-sm ${isChecked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                              {page.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button onClick={() => setRoleModal(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleSaveRole} disabled={saving || !roleForm.name.trim()} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60 hover:bg-primary-dark transition-colors">
                    {saving ? "Saving..." : roleModal === "add" ? "Create Role" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Users Tab */}
      {activeTab === "users" && <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Last Login</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                const isSelf = user.email === currentEmail;
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${isSelf ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isSelf ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          {isSelf && <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">You</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(user.id, user.email, user.is_active)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${user.is_active ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600" : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"}`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setForm({ ...emptyUser, id: user.id, email: user.email, name: user.name, role: user.role, is_active: user.is_active, role_id: user.role_id || "" });
                            setModal("edit");
                            setError("");
                          }}
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        {!isSelf && (
                          <button onClick={() => handleDelete(user.id, user.email)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>}

      {/* My Account Modal */}
      {modal === "self" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Shield size={18} className="text-primary" /> My Account</h3>
              <button onClick={() => { setModal(null); setError(""); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3"><AlertCircle size={15} />{error}</div>}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={selfForm.email}
                    onChange={(e) => setSelfForm({ ...selfForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">New Password (leave blank to keep current)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selfForm.newPassword}
                      onChange={(e) => setSelfForm({ ...selfForm, newPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                      placeholder="Enter new password"
                    />
                  </div>
                  <button type="button" onClick={() => setSelfForm({ ...selfForm, newPassword: generatePassword() })}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                    <RefreshCw size={15} />
                  </button>
                  <button type="button" onClick={() => selfForm.newPassword && copyToClipboard(selfForm.newPassword)}
                    disabled={!selfForm.newPassword}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors disabled:opacity-40">
                    {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setModal(null); setError(""); }} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={handleSaveSelf} disabled={saving} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add User" : "Edit User"}</h3>
              <button onClick={() => { setModal(null); setForm(emptyUser); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3"><AlertCircle size={15} />{error}</div>}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={modal === "edit"}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="user@muramsliving.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {modal === "add" ? "Password *" : "New Password (leave blank to keep current)"}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                      placeholder={modal === "add" ? "Enter or generate" : "Leave blank to keep current"} />
                  </div>
                  <button type="button" onClick={() => setForm({ ...form, password: generatePassword() })}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                    <RefreshCw size={15} />
                  </button>
                  <button type="button" onClick={() => form.password && copyToClipboard(form.password)} disabled={!form.password}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors disabled:opacity-40">
                    {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                <select
                  value={form.role_id || ""}
                  onChange={(e) => {
                    const selectedRole = roles.find((r) => r.id === e.target.value);
                    setForm({
                      ...form,
                      role_id: e.target.value || undefined,
                      role: selectedRole?.name === "admin" ? "admin" : "staff",
                    });
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Admin (Full Access)</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Show pages this role can access */}
              {(() => {
                const selectedRole = roles.find((r) => r.id === form.role_id);
                if (!form.role_id || !selectedRole) {
                  return (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Full Access</p>
                      <p className="text-xs text-green-600">This user can access all pages in the admin panel.</p>
                    </div>
                  );
                }
                const assignedPages = selectedRole.pages || [];
                return (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Pages accessible ({assignedPages.length})
                    </p>
                    {assignedPages.length === 0 ? (
                      <p className="text-xs text-gray-400">No pages assigned to this role. Go to Roles tab to configure.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {assignedPages.map((p: string) => (
                          <span key={p} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                            {PAGE_OPTIONS.find((o) => o.key === p)?.label || p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-primary" />
                  <span className="text-sm text-gray-600">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setModal(null); setForm(emptyUser); }} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saving..." : modal === "add" ? "Add User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
