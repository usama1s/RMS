import { WaiterSidebar } from "./waiterSidebar";

export function WaiterLayout({ children }) {
  return (
    <>
      <div className="flex h-full w-full">
        <WaiterSidebar />
        {children}
      </div>
    </>
  );
}
