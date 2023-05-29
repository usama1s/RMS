import { WaiterSidebar } from "./waiterSidebar";
import { useCtx } from "../../../context/Ctx";

export function WaiterLayout({ children }) {
  const { authenticatedUser } = useCtx();

  return (
    <>
      <div className="flex h-full w-full">
        <WaiterSidebar />
        {children}
      </div>
    </>
  );
}
