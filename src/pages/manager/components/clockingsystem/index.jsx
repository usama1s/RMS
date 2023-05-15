import moment from "moment";
import { db } from "../../../../config/@firebase";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCtx } from "../../../../context/Ctx";
import { useDocument } from "react-firebase-hooks/firestore";
import React from "react";
import { ClockIn } from "./components/clockin";
import { ClockOut } from "./components/clockout";
import { Loading } from "../../../../components/loading";
// import
export function ClockingSystem() {
  const { authenticatedUser, updateModalStatus } = useCtx();
  const [value, loading, error] = useDocument(
    doc(db, "branches", authenticatedUser.branchId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [status, setStatus] = React.useState({ loading: false, error: null });
  const clockIn = async () => {
    const clockInTime = moment().format("MMMM Do YYYY, h:mm:ss a").split(", ");
    const date = clockInTime[0];
    setStatus({ loading: true, error: null });
    try {
      await updateDoc(doc(db, `branches`, authenticatedUser.branchId), {
        clockInTime: serverTimestamp(),
        clockInDate: date,
      });
      await setDoc(doc(db, "orders", `${authenticatedUser.branchId}-${date}`), {
        orders: [],
      });
      setStatus({ loading: false, error: null });
    } catch (e) {
      console.log(e);
      setStatus({ loading: false, error: "Error updating the status." });
    }
  };
  const clockOut = async () => {
    if (!value?.data()) return;
    setStatus({ loading: true, error: null });
    try {
      await deleteDoc(
        doc(
          db,
          "orders",
          `${authenticatedUser.branchId}-${value?.data()?.clockInDate}`
        )
      );
      await updateDoc(doc(db, "branches", authenticatedUser.branchId), {
        clockInDate: "",
        clockInTime: "",
      });
      setStatus({ loading: false, error: null });
    } catch (e) {
      console.log(e?.message);
      setStatus({ loading: false, error: "Error updating the status." });
    }
  };
  if (loading)
    return (
      <div className="flex items-center justify-center h-[20vh]">
        {" "}
        <Loading />
      </div>
    );
  if (error)
    return <h1>{error?.message ? error?.message : "Error right now.."}</h1>;

  return (
    <>
      <div>
        {!value?.data()?.clockInTime ? (
          <div className="flex items-center justify-between">
            <h1>Clock in</h1>
            <button
              className="bg-black text-white"
              onClick={() => {
                updateModalStatus(
                  true,
                  <ClockIn
                    clockIn={clockIn}
                    disabled={status.loading || value?.data()?.clockInTime}
                    loading={status.loading}
                  />
                );
              }}
            >
              Clock in
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1>Clock out</h1>
            <button
              className="bg-black text-white"
              onClick={() => {
                updateModalStatus(
                  true,
                  <ClockOut
                    clockOut={clockOut}
                    disabled={status.loading || !value?.data()?.clockInTime}
                    loading={status.loading}
                  />
                );
              }}
            >
              Clock Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
