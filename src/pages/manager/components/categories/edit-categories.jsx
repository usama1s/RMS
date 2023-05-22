import React, { useState } from "react";
import { useFormik } from "formik";
import { validation_schema_food_categories } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import { formatCollectionData } from "../../../../utils/formatData";
import api from "../../../../config/AxiosBase";

export function ManagerEditCategory({ categoryId }) {
  const [status, setStatus] = useState({ loading: false, error: null });
  const { updateApiDoneStatus, updateModalStatus, apiDone } = useCtx();
  const [title, setTitle] = useState("");

  async function onSubmit() {
    setStatus({ loading: true, error: null });
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await api.patch(
        `/editCategory/${categoryId}`,
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

  return (
    <div>
      <h1 className="text-2xl font-bold">Update Category</h1>
      <form className="mt-2" onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-xl font-medium text-gray-900">
              Title
            </label>
            <div className="mt-1">
              <input
                className="flex w-full h-10 mb-2 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.title && formik.errors.title ? (
                <p className="my-2">{formik.errors.title}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          {status.error && <p className="text-red-500">{status.error}</p>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
            >
              {status.loading ? "Updating..." : "Update."}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
