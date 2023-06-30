import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddExpense } from "./add-expenses";
import { ExpensesListingsItems } from "./expenses-listing";
import api from "../../../../config/AxiosBase";

export const Expenses = () => {
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [clockingData, setClockingData] = useState();
  const [selectedClocking, setSelectedClocking] = useState("all");

  const getClockingsData = async () => {
    const resp = await api.get(
      `/getAllClockings/${localStorage.getItem("managerId")}`,
      {
        withCredentials: true,
      }
    );
    setClockingData(resp.data.data);
  };

  const getExpenses = async () => {
    const resp = await api.get(`/getAllExpenses/${selectedClocking}`, {
      withCredentials: true,
    });
    setFormattedData(resp.data.data);
  };

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    getExpenses();
    getClockingsData();
  }, [apiDone]);

  useEffect(() => {
    getExpenses();
  }, [selectedClocking]);

  return (
    <div>
      <div className="flex items-center justify-between py-4 ">
        <h1 className="font-bold text-2xl">Expenses</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <AddExpense />)}
          className="h-8 w-8 font-bold text-gray-900 cursor-pointer"
        />
      </div>
      <div className="flex justify-end">
        <select
          onChange={(e) => setSelectedClocking(e.target.value)}
          className="bg-gray-900 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1"
        >
          <option value="all">All</option>
          {clockingData &&
            clockingData?.map((item, index) => (
              <option key={index + 1} value={item?.startDateTime}>
                {convertTimestamp(item?.startDateTime)}
              </option>
            ))}
        </select>
      </div>
      <div className="text-2xl">
        <ExpensesListingsItems formattedD={formattedData} />
        {formattedData?.length === 0 && (
          <div>
            <h1 className="font-bold text-xl">
              No Expense is added. Add a expense to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
