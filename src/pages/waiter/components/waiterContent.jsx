import React, { useEffect, useState } from "react";
import { useCtx } from "../../../context/Ctx";
import { Modal } from "../../../components/modal";
import { WaiterHeader } from "./waiterHeader";
import { TakeAway } from "./takeaway/index.jsx";
import { Dinein } from "./dinein";

export function WaiterContent() {
  const { activeWaiterTab, modalStatus } = useCtx();
  const [clockInDate, setClockInDate] = useState("");
  const [subRole, setSubRole] = useState("");

  useEffect(() => {
    const date = localStorage.getItem("ClockInDate");
    const dateId = localStorage.getItem("ClockInDate");
    const role = localStorage.getItem("SubRole");

    setClockInDate(date);
    setSubRole(role);
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

  return (
    <div className={"w-full px-4 lg:px-6 overflow-x-hidden"}>
      <WaiterHeader />

      {!clockInDate ? (
        <h2>Ask manager to clock in.</h2>
      ) : subRole === "Regular Waiter" ? (
        renderWaiterContentNormal(activeWaiterTab)
      ) : subRole === "Chef" ? (
        renderWaiterContentChef(activeWaiterTab)
      ) : (
        ""
      )}

      {modalStatus.status && <Modal />}
    </div>
  );
}
