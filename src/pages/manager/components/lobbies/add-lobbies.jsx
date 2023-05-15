import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { validation_schema_lobbies } from "../../../../utils/validation_schema";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { db } from "../../../../config/@firebase";
import { useCtx } from "../../../../context/Ctx";
export function ManagerAddLobbies() {
  const { updateModalStatus, authenticatedUser } = useCtx();
  const formik = useFormik({
    initialValues: {
      title: "",
      noOfTables: 0,
    },
    validationSchema: validation_schema_lobbies,
    onSubmit: onSubmit,
  });
  const [status, setStatus] = useState({ loading: false, error: null });
  async function onSubmit(values, actions) {
    const collection_ref = collection(db, COLLECTIONS.lobbies);
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const category_exist = await getDocs(
        query(
          collection(db, COLLECTIONS.lobbies),
          where("title", "==", values.title),
          where("branchId", "==", authenticatedUser.branchId)
        )
      );

      if (category_exist.docs.length >= 1) {
        setStatus({
          ...status,
          loading: false,
          error: "Lobby already exists.",
        });
        return;
      } else {
        await addDoc(collection_ref, {
          ...values,
          branchId: authenticatedUser.branchId,
          timestamp: serverTimestamp(),
        });
        updateModalStatus(false, null);
      }
    } catch (e) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error adding the item.`,
      }));
    } finally {
      reset(actions);
    }
  }
  const reset = (actions) => {
    actions.resetForm({ title: "", noOfTables: 0 });
  };
  //jsx
  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Add Lobbies</h1>
      <form onSubmit={formik.handleSubmit} className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Title
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.title && formik.errors.title ? (
                <p className="my-1 text-red-600">{formik.errors.title}</p>
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
