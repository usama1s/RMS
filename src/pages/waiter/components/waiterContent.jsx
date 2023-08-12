import React, { useEffect, useState } from "react";
import { useCtx } from "../../../context/Ctx";
import { Modal } from "../../../components/modal";
import { WaiterHeader } from "./waiterHeader";
import { TakeAway } from "./takeaway/index.jsx";
// import { Dinein } from "./simple-waiter/dinein";
import api from "../../../config/AxiosBase";
import PendingOrders from "./pendingOrders/PendingOrders";
import { AiFillWarning } from "react-icons/ai";

export function WaiterContent() {
  const { activeWaiterTab, modalStatus } = useCtx();
  const [clockInData, setClockInData] = useState("");
  const [subRole, setSubRole] = useState("");

  const getClockIn = async () => {
    const resp = await api.get(
      `/getAllClockings/${localStorage.getItem("managerId")}`,
      {
        withCredentials: true,
      }
    );
    setClockInData(resp.data.data[0]);
  };

  useEffect(() => {
    const role = localStorage.getItem("SubRole");
    setSubRole(role);
    getClockIn();
  }, [clockInData]);

  const renderWaiterContentHead = (slug) => {
    switch (slug) {
      case "Dine in":
        return <PendingOrders />;
      case "Take away":
        return <p>Take away is under development</p>;
      // return <TakeAway />;
      default:
        <h1>Abc</h1>;
    }
  };

  const renderWaiterContentNormal = (slug) => {
    switch (slug) {
      case "Dine in":
        return <PendingOrders />;
      case "Take away":
        return <p>Take away is under development</p>;
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

  console.log({ clockInData });

  return (
    <div className={"w-full px-4 lg:px-6 overflow-x-hidden"}>
      <WaiterHeader />
      {clockInData.managerId?._id === localStorage.getItem("managerId") &&
      clockInData.status != true ? (
        <>
          {subRole && subRole === "Regular Waiter" ? (
            <p className="text-sm font-semibold text-black italic underline mb-1">
              Welcome Regular Waiter
            </p>
          ) : subRole && subRole === "Head Waiter" ? (
            <p className="text-sm font-semibold text-black italic underline mb-1">
              Welcome Head Waiter
            </p>
          ) : subRole && subRole === "Chef" ? (
            <p className="text-sm font-semibold text-black italic underline mb-1">
              Welcome Chef
            </p>
          ) : (
            ""
          )}
          <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
              <AiFillWarning className="w-5 h-5" />
              <span className="sr-only">Warning icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">
              Ask manager to <span className="font-semibold">clock in</span>.
            </div>
          </div>
        </>
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
