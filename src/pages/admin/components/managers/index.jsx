import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AdminAddManagers } from "./add-managers";
import { useCtx } from "../../../../context/Ctx";
import { Loading } from "../../../../components/loading";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { EditManager } from "./EditManager";
import api from "../../../../config/AxiosBase";

export function AdminManagerSection() {
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getBranches = async () => {
    setIsLoading(true);
    const resp = await api.get("/getAllBranches", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getBranches();
  }, [apiDone]);

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  if (error)
    return (
      <h1 className="text-xl font-semibold">Error fetching menu items..</h1>
    );

  console.log(formattedData);

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Branches</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <AdminAddManagers />)}
          className="h-8 w-8 text-gray-900"
        />
      </div>
      <div className="w-full">
        {formattedData?.length <= 0 && (
          <h1 className="font-bold text-xl">No Branches right now.</h1>
        )}
        {formattedData?.length > 0 &&
          formattedData.map((data) => (
            <div
              key={data.slug}
              className="flex bg-[#FBFBFB]  shadow-xl rounded-md relative my-2 w-full"
            >
              <div className="flex w-full items-center justify-between p-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold">{data.email}</h2>
                  <p className="text-base font-normal">
                    <span className="font-bold">Branch:</span>{" "}
                    <span className="bg-green-500 p-1 text-xs rounded-sm text-white">
                      {data.branchName}
                    </span>
                  </p>
                  <p className="text-base font-normal">
                    <span className="font-bold">Name:</span>{" "}
                    <span className="bg-gray-900 p-1 text-xs rounded-sm text-white">
                      {data.name}
                    </span>
                  </p>
                </div>
                <div className="flex mr-1">
                  <TrashIcon
                    onClick={() =>
                      updateModalStatus(
                        true,
                        <DeleteItemJSX
                          updateModalStatus={updateModalStatus}
                          slug={data._id}
                        />
                      )
                    }
                    className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                  <PencilIcon
                    onClick={() =>
                      updateModalStatus(
                        true,
                        <EditManager branchId={data._id} />
                      )
                    }
                    className="h-6 w-6 mr-2 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function DeleteItemJSX({ slug, updateModalStatus }) {
  const [status, setStatus] = useState({ loading: false, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { updateApiDoneStatus, apiDone } = useCtx();

  const deleteBranch = async () => {
    setIsLoading(true);
    const resp = await api.delete(`/deleteBranch/${slug}`, {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }

    updateApiDoneStatus(!apiDone);

    updateModalStatus(false, null);
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold py-2">Confirm to delete item.</h1>
      {isLoading ? (
        <button className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2">
          Deleting...
        </button>
      ) : (
        <div className="flex">
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={deleteBranch}
            disabled={isLoading}
          >
            Yes
          </button>
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={() => updateModalStatus(false, null)}
            disabled={isLoading}
          >
            No
          </button>
        </div>
      )}
      {error && <h1>Something goes wrong</h1>}
    </div>
  );
}
