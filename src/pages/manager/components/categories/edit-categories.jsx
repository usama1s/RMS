import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { validation_schema_food_categories } from "../../../../utils/validation_schema";
import {
  collection,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { db } from "../../../../config/@firebase";
import { useCtx } from "../../../../context/Ctx";
import { formatCollectionData } from "../../../../utils/formatData";
export function ManagerEditCategory() {
  const {
    editedCategoryValue,
    updateModalStatus,
    updateCategoryValue,
    authenticatedUser,
  } = useCtx();

  const formik = useFormik({
    initialValues: {
      title: editedCategoryValue.title,
    },
    validationSchema: validation_schema_food_categories,
    onSubmit: onSubmit,
  });
  const [status, setStatus] = useState({ loading: false, error: null });
  async function onSubmit(values, actions) {
    const collection_ref = doc(
      db,
      COLLECTIONS.categories,
      editedCategoryValue.slug
    );
    setStatus((prev) => ({ ...prev, loading: true }));
    const documents = await getDocs(collection(db, COLLECTIONS.categories));
    const formattedDocs = formatCollectionData(documents);
    console.log(
      formattedDocs
        .filter((d) => d.title !== editedCategoryValue.title)
        .map((d) => d.title)
    );
    const filteredFormattedDocs = formattedDocs
      .filter(
        (d) =>
          d.title !== editedCategoryValue.title &&
          d.branchId === authenticatedUser.branchId
      )
      .map((d) => d.title);

    if (filteredFormattedDocs.includes(values.title)) {
      setStatus({ loading: false, error: `Category already exist.` });
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
        error: `Error adding the item.`,
      }));
    } finally {
      reset(actions);
    }
  }
  const reset = (actions) => {
    actions.resetForm({ title: "" });
    updateCategoryValue(null);
  };
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
