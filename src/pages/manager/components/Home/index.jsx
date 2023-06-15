import React, { useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { useCtx } from "../../../../context/Ctx";
import { ClockIn } from "./components/clockin";
import { ClockOut } from "./components/clockout";
import { Loading } from "../../../../components/loading";

export const Home = () => {
  const { updateModalStatus } = useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [formattedData, setFormattedData] = useState();
  const [date, setDate] = useState("");
  const [dateId, setDateId] = useState("");

  const clockIn = async () => {
    setStatus({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:5000/checkIn", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (data.message !== "Check-in successful!") {
        setStatus({ loading: false, error: "Error updating the status." });
      } else {
        setFormattedData(data.newClocking.startDateTime);
        localStorage.setItem("ClockInDate", data.newClocking.startDateTime);
        localStorage.setItem("ClockInId", data.newClocking._id);
        setStatus({ loading: false, error: null });
      }
    } catch (error) {
      setStatus({ loading: false, error: "Error updating the status." });
    }
  };

  const clockOut = async () => {
    setStatus({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:5000/checkOut/" + dateId, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();
      setFormattedData("");
      localStorage.removeItem("ClockInDate");
      localStorage.removeItem("ClockInId");
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error: "Error updating the status." });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[20vh]">
        <Loading />
      </div>
    );
  if (error)
    return <h1>{error?.message ? error?.message : "Error right now.."}</h1>;

  function convertDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();

    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    const formattedDateTime = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return formattedDateTime;
  }

  useEffect(() => {
    const storedData = localStorage.getItem("ClockInDate");
    const storedId = localStorage.getItem("ClockInId");
    setDate(storedData);
    setDateId(storedId);
  }, [formattedData]);

  return (
    <div className="py-4">
      {/* <h1 className="text-2xl font-bold">Homepage</h1> */}
      <div>
        <div className="flex items-center rounded shadow-md overflow-hidden max-w-xl relative dark:bg-gray-900 dark:text-gray-100">
          <div className="self-stretch flex items-center px-3 flex-shrink-0 dark:bg-gray-700 dark:text-teal-400">
            <BsClock className="h-8 w-8" />
          </div>
          <div className="p-4 flex justify-between w-full">
            {!date ? (
              <button
                type="button"
                className="px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800"
                onClick={() => {
                  updateModalStatus(
                    true,
                    <ClockIn
                      clockIn={clockIn}
                      disabled={status.loading || date}
                      loading={status.loading}
                    />
                  );
                }}
              >
                Clock In
              </button>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-bold">Clocked In at</h3>
                  <p className="text-sm dark:text-gray-400">
                    {convertDateTime(date)}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800"
                  onClick={() => {
                    updateModalStatus(
                      true,
                      <ClockOut
                        clockOut={clockOut}
                        disabled={status.loading || !date}
                        loading={status.loading}
                      />
                    );
                  }}
                >
                  Clock Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};