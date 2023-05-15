import { AdminSidebar } from "./adminSidebar";
export function AdminLayout({ children }) {
  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      {children}
    </div>
  );
}
