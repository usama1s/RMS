import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { validation_schema_food_items } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../../../../config/AxiosBase";

export function ManagerEditItem({
  itemId,
  title,
  slug,
  imageURL,
  description,
  price,
  category,
}) {
  const { updateModalStatus, apiDone, updateApiDoneStatus } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null });
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: {
      title: title,
      price: price,
      description: description,
      category: category,
    },
    validationSchema: validation_schema_food_items,
    onSubmit: onSubmit,
  });

  const getCategories = async () => {
    setLoading(true);
    const resp = await api.get(
      `/getAllCategories/${localStorage.getItem("managerId")}`,
      { withCredentials: true }
    );
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  async function onSubmit(values, actions) {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("category", values.category);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await api.patch("/editItem/" + itemId, formData, {
        withCredentials: true,
      });
      updateApiDoneStatus(!apiDone);
      setStatus({ error: null, loading: false });
      updateModalStatus(false, null);
    } catch (e) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error adding the item.`,
      }));
      updateModalStatus(null, false);
    }
  }

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
                placeholder="Price"
                type="number"
                name="price"
                onChange={formik.handleChange}
                value={formik.values.price}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price ? (
                <p className="my-2">{formik.errors.price}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-lg font-medium text-gray-900">
                Category
              </label>
            </div>
            <select
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              onBlur={formik.handleBlur}
            >
              <option disabled value="">
                Select a category
              </option>
              {formattedData?.map((item) => (
                <option key={item?.categoryName} value={item?.categoryName}>
                  {item?.categoryName}
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
            <div className="flex justify-center items-center gap-4">
              <div className="h-full overflow-hidden flex justify-between gap-4 w-full">
                <div className="flex items-center gap-5">
                  {photo ? (
                    <span>{photo?.name}</span>
                  ) : (
                    <span>Upload Image</span>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    className="opacity-0"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <FaCloudUploadAlt
                    className="w-8 h-8 text-gray-900 hover:scale-110 duration-200 cursor-pointer"
                    onClick={() => inputRef.current.click()}
                  />
                </div>

                {!photo ? (
                  <img
                    src={
                      imageURL
                        ? imageURL
                        : "https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg"
                    }
                    alt="no image found for this item"
                    className="w-[100px] rounded-md"
                  />
                ) : null}
              </div>
            </div>
          </div>
          {status.error && <p>{status.error}</p>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5  font-regular leading-7 text-white text-xl hover:cursor-pointer"
            >
              {status.loading ? "Updating..." : "Update item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return <div>{loading ? <h1>Loading...</h1> : formJSX}</div>;
}
