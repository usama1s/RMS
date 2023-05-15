import React from "react";
import { ManagerSidebar } from "./managerSidebar";
export function ManagerLayout({ children }) {
  return (
    <div className="flex h-full w-full">
      <ManagerSidebar />
      {children}
    </div>
  );
}
