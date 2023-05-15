import React from "react";
import { ManagerHeader } from "./managerHeader";
import { useCtx } from "../../../context/Ctx";
//components
import { ManagersWaiterSection } from "./waiters";
import { ManagerCategory } from "./categories";
import { Modal } from "../../../components/modal";
import { ManagerItems } from "./items";
import { Lobbies } from "./lobbies";
import { ClockingSystem } from "./clockingsystem";
import { PaymentMethods } from "./payment-methods";
export function ManagerContent() {
  const { activeTab, managerSidebarLinks, modalStatus } = useCtx();

  const renderManagerContent = (slug) => {
    switch (slug) {
      // case "Dashboard":
      //   return <ManagerDashboard />;
      // case "Items":
      //   return <h1>Items</h1>;
      case "Pending Orders":
        return <h1>Pending Orders</h1>;
      case "Lobbies":
        return <Lobbies />;
      // case "Orders":
      //   return <ManagerOrder />;
      case "Categories":
        return <ManagerCategory />;
      case "Menu Items":
        return <ManagerItems />;
      case "Waiters":
        return <ManagersWaiterSection />;
      case "Clocking System":
        return <ClockingSystem />;
      case "Payment Methods":
        return <PaymentMethods />;
    }
  };

  return (
    <div className={"w-full px-4 lg:px-6 overflow-x-hidden"}>
      <ManagerHeader />
      {renderManagerContent(activeTab)}
      {modalStatus.status && <Modal />}
    </div>
  );
}
