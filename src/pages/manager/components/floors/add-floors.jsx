import { useState } from "react";
import { useFormik } from "formik";
import { validation_schema_lobbies } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export function ManagerAddFloors() {
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });
  const formik = useFormik({
    initialValues: {
      title: "",
      noOfTables: 0,
    },
    validationSchema: validation_schema_lobbies,
    onSubmit: onSubmit,
  });

  async function onSubmit(values, actions) {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let data = {
        lobbyName: values.number,
        noOfTables: values.noOfTables,
      };

      await api.post("/addLobby", data, {
        withCredentials: true,
      });
      setStatus({ error: null, loading: false });
      updateModalStatus(false, null);
      updateApiDoneStatus(!apiDone);
    } catch (e) {
      console.log(e);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error adding the item.`,
      }));
    }
  }

  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Add Floors</h1>
      <form onSubmit={formik.handleSubmit} className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Floor Number
            </label>
            <div className="mt-1">
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                name="number"
                onChange={formik.handleChange}
                value={formik.values.number}
                onBlur={formik.handleBlur}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              {formik.touched.number && formik.errors.number ? (
                <p className="my-1 text-red-600">{formik.errors.number}</p>
              ) : (
                ""
              )}
            </div>

          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-lg font-medium text-gray-900">
                Number of Tables
              </label>
            </div>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                placeholder="Number of Tables"
                type="number"
                name="noOfTables"
                onChange={formik.handleChange}
                value={formik.values.noOfTables}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.noOfTables && formik.errors.noOfTables ? (
                <p className="my-2 text-red-500">{formik.errors.noOfTables}</p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div>
            {status.error && <p>{status.error}</p>}
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
              onClick={() => {
                onSubmit();
              }}
            >
              {status.loading ? "Adding..." : "Add a Lobby"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return formJSX;
}
