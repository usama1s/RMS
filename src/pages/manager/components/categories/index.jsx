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
    setLoading(true);
    const resp = await api.get("/getAllCategories", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  if (error)
    return (
      <h1 className="text-xl font-semibold">Error fetching categories..</h1>
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
        <h1 className="font-bold text-2xl">Categories</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <ManagerAddCategories />)}
          className="h-8 w-8 font-bold text-gray-900"
        />
      </div>
      <div className="text-2xl">
        <ManagerCategoriesListingsItems formattedD={formattedData} />
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal">
              No Categories right now. Add Categories to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
