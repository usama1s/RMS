import React, { useState } from "react";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export function ManagerEditLobby({ lobbyId, lobbyName, numberOfTables }) {
  const [status, setStatus] = useState({ loading: false, error: null });
  const { updateApiDoneStatus, updateModalStatus, apiDone } = useCtx();
  const [title, setTitle] = useState(lobbyName);
  const [noOfTables, setNoOfTables] = useState(numberOfTables);

  async function onSubmit() {
    setStatus({ loading: true, error: null });
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await api.patch(
        `/editLobby/${lobbyId}`,
        { lobbyName: title, noOfTables: noOfTables },
        {
          withCredentials: true,
        }
      );

      setStatus({ error: null, loading: false });
      updateModalStatus(false, null);
      updateApiDoneStatus(!apiDone);
    } catch (e) {
      console.log(e);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error updating the item.`,
      }));
    }
  }

  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Add Lobbies</h1>
      <form className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-xl font-medium text-gray-900">
              Title
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-xl font-medium text-gray-900">
                Number of Tables
              </label>
            </div>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                placeholder="Number of Tables"
                type="number"
                name="noOfTables"
                onChange={(e) => setNoOfTables(e.target.value)}
                value={noOfTables}
              />
            </div>
          </div>

          <div>
            {status.error && <p>{status.error}</p>}
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
              onClick={() => {
                onSubmit();
              }}
            >
              {status.loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return formJSX;
}
