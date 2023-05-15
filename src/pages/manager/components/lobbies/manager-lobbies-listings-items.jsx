import React from "react";
import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { db } from "../../../../config/@firebase";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { doc, deleteDoc } from "firebase/firestore";
import { ManagerEditLobby } from "./edit-lobbies";
import { useCtx } from "../../../../context/Ctx";
const { lobbies } = COLLECTIONS;
export function ManagerLobbiesListingsItems({ title, slug, noOfTables }) {
  const { updateModalStatus, updateLobbyValue } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });

  const updateItemHandler = async () => {
    updateLobbyValue({ slug, title, noOfTables });
    updateModalStatus(true, <ManagerEditLobby />);
  };
  return (
    <div className="flex items-center  bg-[#FBFBFB] shadow-md w-full p-4 rounded-md my-4 relative">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-base font-normal">
          <span className="font-bold">Number of Rooms:</span>{" "}
          <span className="bg-green-500 py-1 px-2 text-xs rounded-md text-white">
            {noOfTables}
          </span>
        </p>
      </div>
      <div className="absolute right-4 flex">
        <TrashIcon
          onClick={async () =>
            updateModalStatus(
              true,
              <DeleteItemJSX
                slug={slug}
                updateModalStatus={updateModalStatus}
              />
            )
          }
          className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
        />
        <PencilIcon
          onClick={updateItemHandler}
          className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
        />
      </div>
    </div>
  );
}
const DeleteItemJSX = ({ slug, updateModalStatus }) => {
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
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={async () => {
              try {
                setStatus({ loading: true, error: null });
                await deleteDoc(doc(db, lobbies, slug));
                setStatus({
                  loading: false,
                  error: null,
                });
                updateModalStatus(false, null);
              } catch (e) {
                // setStatus({
                //   loading: false,
                //   error: "Error deleting the item.",
                // });
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
