import React from "react";
import { ManagerHeader } from "./managerHeader";
import { useCtx } from "../../../context/Ctx";
import { ManagersWaiterSection } from "./waiters";
import { ManagerCategory } from "./categories";
import { Modal } from "../../../components/modal";
import { ManagerItems } from "./items";
import { Lobbies } from "./lobbies";
// import { ClockingSystem } from "./clockingsystem";
import { PaymentMethods } from "./payment-methods";
import { CompletedOrder } from "./completed-order";
import { CancelledOrder } from "./cancelled-order";
import { PendingOrders } from "./pending-orders";
import { Home } from "./Home";

export function ManagerContent() {
  const { activeTab, modalStatus } = useCtx();

  const renderManagerContent = (slug) => {
    switch (slug) {
      case "Home":
        return <Home />;
      case "Pending Dine In Orders":
        return <PendingOrders />;
      case "Lobbies":
        return <Lobbies />;
      case "Categories":
        return <ManagerCategory />;
      case "Menu Items":
        return <ManagerItems />;
      case "Waiters":
        return <ManagersWaiterSection />;
      case "Payment Methods":
        return <PaymentMethods />;
      case "Completed Order":
        return <CompletedOrder />;
      case "Cancelled Order":
        return <CancelledOrder />;
      // case "Clocking System":
      //   return <ClockingSystem />;
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
