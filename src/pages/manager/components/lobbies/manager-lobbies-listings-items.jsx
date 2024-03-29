import React, { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { ManagerEditLobby } from "./edit-lobbies";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export function ManagerLobbiesListingsItems({ formattedD }) {
  const { updateModalStatus, updateApiDoneStatus, apiDone, managerClocking } =
    useCtx();
  const [propData, setPropData] = useState(formattedD);

  return (
    <>
      {propData?.map((item, index) => (
        <div
          key={index + 1}
          className="flex items-center  bg-[#FBFBFB] shadow-md w-full p-4 rounded-md my-4 relative"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl">{item?.lobbyName}</h3>
            <p className="text-base font-normal">
              <span className="font-bold">Number of Tables:</span>{" "}
              <span className="bg-green-500 py-1 px-2 text-xs rounded-md text-white">
                {item?.noOfTables}
              </span>
            </p>
          </div>
          {(managerClocking?.managerId._id ===
            localStorage.getItem("managerId") &&
            managerClocking === undefined) ||
          managerClocking?.status !== true ? (
            <div className="absolute right-4 flex">
              <TrashIcon
                onClick={async () =>
                  updateModalStatus(
                    true,
                    <DeleteItemJSX
                      slug={item?._id}
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
                    <ManagerEditLobby
                      lobbyId={item?._id}
                      lobbyName={item.lobbyName}
                      numberOfTables={item?.noOfTables}
                    />
                  )
                }
                className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
              />
            </div>
          ) : null}
        </div>
      ))}
    </>
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
      <h1 className="text-xl font-bold py-2">Confirm to delete item.</h1>
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
            className="bg-red-600 text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={async () => {
              try {
                setStatus({ loading: true, error: null });
                await api.delete(`/deleteLobbies/${slug}`, {
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
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
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
