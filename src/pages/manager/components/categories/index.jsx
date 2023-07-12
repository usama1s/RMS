import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddCategories } from "./add-categories";
import { ManagerCategoriesListingsItems } from "./manager-categories-listings-items";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function ManagerCategory() {
  const { updateModalStatus, apiDone } = useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();

  const getCategories = async () => {
    try {
      setLoading(true);
      const resp = await api.get(
        `/getAllCategories/${localStorage.getItem("managerId")}`,
        {
          withCredentials: true,
        }
      );
      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
      setFormattedData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4 ">
        <h1 className="font-bold text-2xl">Categories</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <ManagerAddCategories />)}
          className="h-8 w-8 font-bold text-gray-900 hover:cursor-pointer"
        />
      </div>
      <div className="text-2xl">
        <ManagerCategoriesListingsItems formattedD={formattedData} />
        {!formattedData && error && (
          <h1 className="text-xl font-bold">
            No Categories right now. Add Categories to proceed.
          </h1>
        )}
      </div>
    </div>
  );
}
