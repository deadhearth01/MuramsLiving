import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Panel | Murams Living",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 min-w-0 lg:ml-60 xl:ml-64 pt-14 lg:pt-0 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
