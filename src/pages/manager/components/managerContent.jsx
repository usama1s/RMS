import React, { useEffect, useState } from "react";
import { ManagerHeader } from "./managerHeader";
import { useCtx } from "../../../context/Ctx";
import { Modal } from "../../../components/modal";
import { Home } from "./Home";
import { Lobbies } from "./lobbies";
import { ManagerCategory } from "./categories";
import { ManagerItems } from "./items";
import { ManagersWaiterSection } from "./waiters";
import { PaymentMethods } from "./payment-methods";
import { CompletedOrder } from "./completed-order";
import { Expenses } from "./expenses";
import api from "../../../config/AxiosBase";
// import { ClockingSystem } from "./clockingsystem";
// import { CancelledOrder } from "./cancelled-order";
// import { PendingOrders } from "./pending-orders";

export function ManagerContent() {
  const { activeTab, modalStatus } = useCtx();

  const renderManagerContent = (slug) => {
    switch (slug) {
      case "Home":
        return <Home />;
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
      case "Manage Expenses":
        return <Expenses />;
      // case "Cancelled Order":
      //   return <CancelledOrder />;
      // case "Pending Dine In Orders":
      //   return <PendingOrders />;
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
