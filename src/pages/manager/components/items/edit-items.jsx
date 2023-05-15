import React, { useRef, useState, useEffect } from "react";

import { useFormik } from "formik";
import { validation_schema_food_items } from "../../../../utils/validation_schema";
import {
  collection,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { food_items_storage_path } from "../../../../utils/storage-refs";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { db, storage } from "../../../../config/@firebase";
import { useCtx } from "../../../../context/Ctx";
import { useCollection } from "react-firebase-hooks/firestore";
import { formatCollectionData } from "../../../../utils/formatData";
import { Loading } from "../../../../components/loading";
import { FaCloudUploadAlt } from "react-icons/fa";
export function ManagerEditItem() {
  const {
    editedItemValue,
    updateItemValue,
    updateModalStatus,
    authenticatedUser,
  } = useCtx();
  const [value, loading, error] = useCollection(
    query(
      collection(db, COLLECTIONS.categories),
      where("branchId", "==", authenticatedUser.branchId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const formattedData = value
    ? [{ title: "" }, ...formatCollectionData(value)]
    : null;
  const [status, setStatus] = useState({ loading: false, error: null });
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const inputRef = useRef();
  const [fileChanged, setFileChanged] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: editedItemValue.title,
      price: editedItemValue.price,
      description: editedItemValue.description,
      category: editedItemValue.category,
    },
    validationSchema: validation_schema_food_items,
    onSubmit: onSubmit,
  });
  const [showForm, setShowForm] = useState(false);
  React.useEffect(() => {
    const fetchCategories = async () => {
      const category_exist = await getDocs(
        query(
          collection(db, COLLECTIONS.categories),
          where("branchId", "==", authenticatedUser.branchId)
        )
      );

      if (category_exist.docs.length >= 1) {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    setFileUploadError(null);
    setFileDataURL(editedItemValue.imageURL);
    setFileChanged(false);
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
          setFileChanged(true);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  //fns
  async function onSubmit(values, actions) {
    const collection_ref = doc(
      db,
      COLLECTIONS.food_items,
      editedItemValue.slug
    );
    setFileUploadError(null);
    setStatus((prev) => ({ ...prev, loading: true }));
    const documents = await getDocs(
      query(
        collection(db, COLLECTIONS.food_items)
        // where("branchId", "==", authenticatedUser.branchId)
      )
    );
    const formattedDocs = formatCollectionData(documents);

    const filteredFormattedDocs = formattedDocs
      .filter(
        (d) =>
          d.title !== editedItemValue.title &&
          d.branchId === authenticatedUser.branchId
      )
      .map((d) => d.title);

    if (filteredFormattedDocs.includes(values.title)) {
      setStatus({ loading: false, error: `Item already exist.` });
      return;
    }

    if (!fileChanged) {
      await updateDoc(collection_ref, {
        // ...editedItemValue,
        ...values,
        timestamp: serverTimestamp(),
      });
      updateModalStatus(null, false);
      updateItemValue(null);
      reset(actions);
      return;
    }
    if (!file) {
      setStatus((prev) => ({ ...prev, loading: false }));
      setFileUploadError(`File is required.`);
      return;
    }
    try {
      const foodItemStorageRef = ref(
        storage,
        food_items_storage_path(file.name)
      );
      await uploadBytes(foodItemStorageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await updateDoc(collection_ref, {
            ...values,
            timestamp: serverTimestamp(),
            imageURL: downloadURL,
          });
        });
      });
      updateModalStatus(null, false);
      updateItemValue(null);
      // setStatus(prev=>({...prev,loading:false,error:null}))
    } catch (e) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error adding the item.`,
      }));
      updateModalStatus(null, false);
    } finally {
      reset(actions);
    }
  }
  const setImage = (e) => {
    setFile(e.target.files[0]);
  };
  const reset = (actions) => {
    setFile(null);
    setFileUploadError(null);
    setFileDataURL(null);
    actions.resetForm({ title: "", price: 0, description: "", category: "" });
    setCategoryError(null);
    updateItemValue(null);
  };
  //jsx
  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Update Item</h1>
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
                <p className="my-2">{formik.errors.title}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-xl font-medium text-gray-900">
              Description
            </label>
            <div className="mt-1">
              <textarea
                className="flex  h-16 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <p className="my-2">{formik.errors.description}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-xl font-medium text-gray-900">
                Price
              </label>
            </div>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                //   type="password"
                placeholder="Price"
                type="number"
                name="price"
                onChange={formik.handleChange}
                value={formik.values.price}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.price && formik.errors.price ? (
                <p className="my-2">{formik.errors.price}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-xl font-medium text-gray-900">
                Category
              </label>
            </div>
            <select
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              onBlur={formik.handleBlur}
              className="px-2 outline-none cursor-pointer"
            >
              {formattedData?.map(({ title }) => (
                <option className="cursor-pointer" key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category ? (
              <p className="my-2">{formik.errors.category}</p>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col">
            <div>
              <label
                htmlFor="imageInput"
                className="w-[80px] flex items-center text-xl font-medium text-gray-900 cursor-pointer"
              >
                <input
                  id="imageInput"
                  ref={inputRef}
                  accept="image/*"
                  type="file"
                  onChange={setImage}
                  className="hidden"
                />
                <div className="relative">
                  <FaCloudUploadAlt className="w-8 h-8 text-gray-900 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 hover:scale-110 duration-200" />

                  <img
                    className="w-[80px] h-full object-cover"
                    src={fileDataURL ? fileDataURL : ""}
                  />
                </div>
              </label>
            </div>
            {!fileDataURL && (
              <div
                //   // onClick={()=>{
                //   // setFileDataURL(null)
                //   // setFile(null)
                //   // }}
                className="flex justify-center items-center gap-4"
              >
                <span>No Image Uploaded</span>
                <FaCloudUploadAlt className="w-8 h-8 text-gray-900 hover:scale-110 duration-200 cursor-pointer" />
              </div>
            )}
          </div>
          {fileUploadError && <p>{fileUploadError}</p>}
          {status.error && <p>{status.error}</p>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5  font-regular leading-7 text-white text-xl"
            >
              {status.loading ? "Updating..." : "Update item."}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {" "}
      {loading ? (
        <div className="h-[60vh]">
          <Loading />
        </div>
      ) : !showForm ? (
        <h1>Please enter categories to add a item</h1>
      ) : (
        formJSX
      )}
    </div>
  );
}
