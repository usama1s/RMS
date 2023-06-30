import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddLobbies } from "./add-lobbies";
import { ManagerLobbiesListingsItems } from "./manager-lobbies-listings-items";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function Lobbies() {
  const id = localStorage.getItem("managerId");
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getLobbies = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`/getLobbies/${id}`, {
        withCredentials: true,
      });

      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLobbies();
  }, [apiDone]);

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Lobbies</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <ManagerAddLobbies />)}
        />
      </div>
      <div className="text-2xl">
        <ManagerLobbiesListingsItems formattedD={formattedData} />
        {!formattedData && error && (
          <h1 className="font-bold text-xl">
            No Lobbies right now. Add Lobbies to proceed.
          </h1>
        )}
      </div>
    </div>
  );
}
