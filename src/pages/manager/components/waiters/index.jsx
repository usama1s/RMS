import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddWaiters } from "./add-waiter";
import { Loading } from "../../../../components/loading";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { ManagerEditWaiter } from "./edit-waiter";
import api from "../../../../config/AxiosBase";

export function ManagersWaiterSection() {
  const { updateModalStatus, apiDone, updateApiDoneStatus, managerClocking } =
    useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();

  const getWaiters = async () => {
    try {
      setLoading(true);
      const resp = await api.get("/getAllWaiters", { withCredentials: true });

      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
      setFormattedData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWaiters();
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
        <h1 className="text-2xl font-bold">Waiter</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <AddWaiters />)}
        />
      </div>
      <div className="w-full flex flex-col gap-5">
        {!formattedData && error && (
          <h1 className="font-bold text-xl">
            No Waiters right now. Add waiters to proceed.
          </h1>
        )}
        {formattedData?.map((data, index) => (
          <div
            key={index + 1}
            className="flex bg-[#FBFBFB] shadow-md rounded-md relative p-4 w-full"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Username:
                  <span className="ml-1 font-semibold bg-green-500 text-white p-1 rounded-md text-sm">
                    {data.userName}
                  </span>
                </h2>
                <p className="text-sm font-normal">
                  <span className="font-bold">Name:</span> {data.name}
                </p>
                <p className="text-sm font-normal">
                  <span className="font-bold">Role:</span> {data.waiterRole}
                </p>
                <div className="flex gap-2 flex-wrap pt-1">
                  {data.waiterRole === "Regular Waiter" ? (
                    data?.lobbyAssigned?.length > 0 ? (
                      data?.lobbyAssigned.map((item, index) => (
                        <div key={index + 1}>
                          <p className="font-semibold bg-green-500 text-white p-1 rounded-md text-sm">
                            {item?.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm underline text-red-600">
                        No Lobby Assigned
                      </p>
                    )
                  ) : null}
                </div>
              </div>
              {(managerClocking?.managerId._id ===
                localStorage.getItem("managerId") &&
                managerClocking === undefined) ||
              managerClocking.status !== true ? (
                <div className="flex mr-1">
                  <TrashIcon
                    onClick={async () =>
                      updateModalStatus(
                        true,
                        <DeleteItemJSX
                          slug={data?._id}
                          updateModalStatus={updateModalStatus}
                          updateApiDoneStatus={updateApiDoneStatus}
                          apiDone={apiDone}
                        />
                      )
                    }
                    className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                  <PencilIcon
                    onClick={() =>
                      updateModalStatus(
                        true,
                        <ManagerEditWaiter
                          waiterId={data?._id}
                          wr_userName={data?.userName}
                          wr_name={data?.name}
                          wr_role={data?.waiterRole}
                          wr_lobbyAssigned={data?.lobbyAssigned}
                        />
                      )
                    }
                    className="h-6 w-6 mr-2 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DeleteItemJSX = ({
  slug,
  updateModalStatus,
  updateApiDoneStatus,
  apiDone,
}) => {
  const [status, setStatus] = useState({ loading: false, error: null });

  return (
    <div>
      <h1 className="text-xl font-bold py-2">Confirm to delete waiter.</h1>
      {status.loading ? (
        <button
          className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
          disabled={status.loading}
        >
          Deleting....
        </button>
      ) : (
        <div className="flex mt-2">
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={async () => {
              try {
                setStatus({ loading: true, error: null });
                await api.delete(`/deleteWaiters/${slug}`, {
                  withCredentials: true,
                });

                setStatus({
                  loading: false,
                  error: null,
                });
                updateModalStatus(false, null);
                updateApiDoneStatus(!apiDone);
              } catch (e) {
                console.log(e);
                setStatus({
                  loading: false,
                  error: "Error deleting the item.",
                });
              }
            }}
            disabled={status.loading}
          >
            Yes
          </button>
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4 mr-2"
            onClick={() => updateModalStatus(false, null)}
            disabled={status.loading}
          >
            No
          </button>
        </div>
      )}
      {status.error && <h1>{status.error}</h1>}
    </div>
  );
};
