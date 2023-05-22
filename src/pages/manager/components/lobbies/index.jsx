import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddLobbies } from "./add-lobbies";
import { ManagerLobbiesListingsItems } from "./manager-lobbies-listings-items";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function Lobbies() {
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getLobbies = async () => {
    setLoading(true);
    const resp = await api.get("/getLobbies", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getLobbies();
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
        <h1 className="text-2xl font-bold">Lobbies</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <ManagerAddLobbies />)}
        />
      </div>
      <div className="text-2xl">
        <ManagerLobbiesListingsItems formattedD={formattedData} />
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal ">
              No Lobbies right now. Add Lobbies to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
