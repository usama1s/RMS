import React, { useEffect, useState } from "react";
import { useCtx } from "../../../context/Ctx";
import { Modal } from "../../../components/modal";
import { WaiterHeader } from "./waiterHeader";
import { TakeAway } from "./takeaway/index.jsx";
import { Dinein } from "./dinein";
import api from "../../../config/AxiosBase";
import PendingOrders from "./pendingOrders/PendingOrders";

export function WaiterContent() {
  const { activeWaiterTab, modalStatus } = useCtx();
  const [clockInData, setClockInData] = useState("");
  const [subRole, setSubRole] = useState("");

  const getClockIn = async () => {
    const resp = await api.get("/getAllClockings", { withCredentials: true });
    setClockInData(resp.data.data[0]);
  };

  useEffect(() => {
    const role = localStorage.getItem("SubRole");
    setSubRole(role);
    getClockIn();
  }, []);

  const renderWaiterContentNormal = (slug) => {
    switch (slug) {
      case "Dine in":
        return <Dinein />;
      case "Take away":
        return <TakeAway />;
      default:
        <h1>Abc</h1>;
    }
  };

  const renderWaiterContentChef = (slug) => {
    switch (slug) {
      case "Pending Orders":
        return <h1>Pending Orders for Chef</h1>;
      default:
        <h1>Abc</h1>;
    }
  };

  const renderWaiterContentHead = (slug) => {
    switch (slug) {
      case "Dine in":
        return <PendingOrders />;
      case "Take away":
        return <TakeAway />;
      // case "Pending Orders":
      //   return <Dinein />;
      default:
        <h1>Abc</h1>;
    }
  };

  return (
    <div className={"w-full px-4 lg:px-6 overflow-x-hidden"}>
      <WaiterHeader />

      {clockInData.status != true ? (
        <h2>Ask manager to clock in.</h2>
      ) : subRole && subRole === "Regular Waiter" ? (
        renderWaiterContentNormal(activeWaiterTab)
      ) : subRole && subRole === "Chef" ? (
        renderWaiterContentChef(activeWaiterTab)
      ) : subRole && subRole == "Head Waiter" ? (
        renderWaiterContentHead(activeWaiterTab)
      ) : (
        ""
      )}

      {modalStatus.status && <Modal />}
    </div>
  );
}
