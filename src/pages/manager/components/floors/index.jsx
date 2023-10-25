import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddFloors } from "./add-floors";
import { ManagerFloorsListingsItems } from "./manager-floors-listings-items";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function Floors() {
  const id = localStorage.getItem("managerId");
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getFloors = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`/getLobbies/${id}`, {
        withCredentials: true,
      });

      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
      setFormattedData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFloors();
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
        <h1 className="text-2xl font-bold">Floors</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <ManagerAddFloors />)}
        />
      </div>
      <div className="text-2xl">
        <ManagerFloorsListingsItems formattedD={formattedData} />
        {!formattedData && error && (
          <h1 className="font-bold text-xl">
            No Floors right now. Add Floors to proceed.
          </h1>
        )}
      </div>
    </div>
  );
}
