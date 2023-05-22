import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddItem } from "./add-items";
import { ManagerItemsListingItems } from "./manager-items-listings-items";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function ManagerItems() {
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getItems = async () => {
    setLoading(true);
    const resp = await api.get("/getItems", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, [apiDone]);

  if (error)
    return (
      <h1 className="text-xl font-semibold">Error fetching menu items..</h1>
    );

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <ManagerAddItem />)}
          className="h-8 w-8 text-gray-900 cursor-pointer"
        />
      </div>
      <div className="text-2xl flex flex-col gap-2">
        <ManagerItemsListingItems formattedD={formattedData} />
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal">
              No Menu items right now. Add menu items to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
