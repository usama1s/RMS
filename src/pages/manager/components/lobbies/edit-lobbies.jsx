import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { formatCollectionData } from "../../../../utils/formatData";
import { validation_schema_lobbies } from "../../../../utils/validation_schema";
import {
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { db } from "../../../../config/@firebase";
import { useCtx } from "../../../../context/Ctx";
export function ManagerEditLobby() {
  const {
    editedLobbyValue,
    updateModalStatus,
    updateLobbyValue,
    authenticatedUser,
  } = useCtx();

  const formik = useFormik({
    initialValues: {
      title: editedLobbyValue.title,
      noOfTables: editedLobbyValue.noOfTables,
    },
    validationSchema: validation_schema_lobbies,
    onSubmit: onSubmit,
  });
  const [status, setStatus] = useState({ loading: false, error: null });
  async function onSubmit(values, actions) {
    const collection_ref = doc(db, COLLECTIONS.lobbies, editedLobbyValue.slug);
    setStatus((prev) => ({ ...prev, loading: true }));
    const documents = await getDocs(
      query(
        collection(db, COLLECTIONS.lobbies)
        // where("branchId", "==", authenticatedUser.branchId)
      )
    );
    const formattedDocs = formatCollectionData(documents);
    // console.log(
    //   formattedDocs
    //     .filter(
    //       (d) =>
    //         d.title !== editedLobbyValue.title &&
    //         d.branchId === authenticatedUser.branchId
    //     )
    //     .map((d) => d.title)
    // );
    const filteredFormattedDocs = formattedDocs
      .filter(
        (d) =>
          d.title !== editedLobbyValue.title &&
          d.branchId === authenticatedUser.branchId
      )
      .map((d) => d.title);

    if (filteredFormattedDocs.includes(values.title)) {
      setStatus({ loading: false, error: `Lobby already exist.` });
      return;
    }
    try {
      await updateDoc(collection_ref, {
        ...values,
        timestamp: serverTimestamp(),
      });
      updateModalStatus(false, null);
    } catch (e) {
      console.log(e);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error updating the item.`,
      }));
    } finally {
      reset(actions);
    }
  }
  const reset = (actions) => {
    actions.resetForm({ title: "" });
    updateLobbyValue(null);
  };
  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Add Lobbies</h1>
      <form onSubmit={formik.handleSubmit} className="mt-2">
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
              <label htmlFor="" className="text-xl font-medium text-gray-900">
                Number of Tables
              </label>
            </div>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                //   type="password"
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
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
            >
              {status.loading ? "Editing..." : "Edit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return formJSX;
}
