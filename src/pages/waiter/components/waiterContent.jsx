import React from "react";
import { useCtx } from "../../../context/Ctx";
import { Modal } from "../../../components/modal";
import { WaiterHeader } from "./waiterHeader";
import { TakeAway } from "./takeaway/index.jsx";
import { Dinein } from "./dinein";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../config/@firebase";
export function WaiterContent() {
  const {
    activeWaiterTab,
    waiterSidebarLinks,
    modalStatus,
    authenticatedUser,
  } = useCtx();
  const [value, loading, error] = useDocument(
    doc(db, "branches", authenticatedUser.branchId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  // const ref = `${authenticatedUser.branchId}-${value?.data()?.clockInDate}`;

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
  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <div className={"w-full px-4 lg:px-6 overflow-x-hidden"}>
      <WaiterHeader />
      {/* { value && value?.data()?.clockInTime && value?.data()?.clockInDate ? (
        authenticatedUser.subRole === "NORMAL"
      ) ? renderWaiterContentNormal(activeWaiterTab) : (
        authenticatedUser.subRole === "CHEF"
      ) ? renderWaiterContentChef(activeWaiterTab) :(
        ""
      )} */}
      {!value?.data()?.clockInTime && !value?.data()?.clockInDate ? (
        <h2>Ask manager to clock in.</h2>
      ) : authenticatedUser.subRole === "NORMAL" ? (
        renderWaiterContentNormal(activeWaiterTab)
      ) : authenticatedUser.subRole === "CHEF" ? (
        renderWaiterContentChef(activeWaiterTab)
      ) : (
        ""
      )}
      {/* {!value?.data()?.clockInTime && !value?.data()?.clockInDate && (
         <h2>Ask manager to clock in.</h2>
       )} */}
      {modalStatus.status && <Modal />}
    </div>
    // {/* {value?.data()?.clockInTime && value?.data()?.clockInDate ? (
    //     <div className="flex h-full w-full">
    //       <WaiterSidebar />
    //       {children}
    //     </div>
    //   ) : (
    //     <h2>Ask manager to clock in..</h2>
    //   )} */}
  );
}
