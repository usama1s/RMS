import { AdminSidebar } from '../pages/admin/components/adminSidebar';

export function AdminLayout({ children }) {
  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      {children}
    </div>
  );
}
