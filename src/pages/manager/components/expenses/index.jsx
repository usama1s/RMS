import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddExpense } from "./add-expenses";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";
import { ExpensesListingsItems } from "./expenses-listing";

export const Expenses = () => {
  const { updateModalStatus, apiDone } = useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();

  const getExpenses = async () => {
    setLoading(true);
    const resp = await api.get("/getAllExpenses", {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }
    console.log(resp);
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getExpenses();
  }, [apiDone]);

  if (error)
    return (
      <h1 className="text-xl font-semibold">
        Error fetching payment methods..
      </h1>
    );

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4 ">
        <h1 className="font-bold text-2xl">Expenses</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <AddExpense />)}
          className="h-8 w-8 font-bold text-gray-900 cursor-pointer"
        />
      </div>
      <div className="text-2xl">
        <ExpensesListingsItems formattedD={formattedData} />
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal">
              No Expense is added. Add a expense to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
