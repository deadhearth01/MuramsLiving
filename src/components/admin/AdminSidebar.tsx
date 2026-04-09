"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, CalendarCheck, BedDouble, Users, CreditCard,
  Receipt, UserCog, Phone, LogOut, Menu, X, Briefcase, MessageSquare,
  ClipboardList, IndianRupee
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const allNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, key: "dashboard" },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, key: "bookings" },
  { href: "/admin/availability", label: "Room Availability", icon: BedDouble, key: "availability" },
  { href: "/admin/students", label: "Students Info", icon: Users, key: "students" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, key: "payments" },
  { href: "/admin/expenses", label: "Expenses", icon: Receipt, key: "expenses" },
  { href: "/admin/workers", label: "Workers", icon: Briefcase, key: "workers" },
  { href: "/admin/enquiries", label: "Site Enquiries", icon: MessageSquare, key: "enquiries" },
  { href: "/admin/contact-info", label: "Contact Info", icon: Phone, key: "contact-info" },
  { href: "/admin/activity-log", label: "Activity Log", icon: ClipboardList, key: "activity-log" },
  { href: "/admin/pricing", label: "Pricing", icon: IndianRupee, key: "pricing" },
  { href: "/admin/users", label: "User Management", icon: UserCog, key: "users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState(allNavItems);

  useEffect(() => {
    // Read session cookie to filter nav items by assigned pages
    try {
      const cookies = document.cookie.split(";").reduce((acc, c) => {
        const [k, v] = c.trim().split("=");
        acc[k] = v;
        return acc;
      }, {} as Record<string, string>);
      const session = cookies["ml_admin_session"];
      if (session) {
        const data = JSON.parse(atob(session));
        // Admin role or env-admin sees everything; others see only assigned pages
        if (data.role === "admin" || data.id === "env-admin" || !data.pages?.length) {
          setNavItems(allNavItems);
        } else {
          // Always show dashboard
          setNavItems(allNavItems.filter((item) => item.key === "dashboard" || data.pages.includes(item.key)));
        }
      }
    } catch { /* fallback to all items */ }
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Clear the admin session cookie
    document.cookie = "ml_admin_session=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  };

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="ML" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Murams Living</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-red-500/20 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy-dark border-b border-white/10 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white/70 hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 overflow-hidden">
            <Image src="/logo.png" alt="ML" width={28} height={28} className="object-contain w-full h-full" />
          </div>
          <span className="text-white font-semibold text-sm">Admin Panel</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-navy-dark z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 xl:w-64 bg-navy-dark h-screen fixed left-0 top-0 border-r border-white/10">
        <SidebarContent />
      </div>
    </>
  );
}
