import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { validation_schema_food_items } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../../../../config/AxiosBase";

export function ManagerAddItem() {
  const inputRef = useRef();
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [noPhotoFound, setNoPhotoFound] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      price: 0,
      description: "",
      category: "",
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
    const categoryValue = values.category;
    const delimiterIndex = categoryValue.indexOf(":");
    const categoryName = categoryValue.slice(0, delimiterIndex);
    const categoryId = categoryValue.slice(delimiterIndex + 1);

    setStatus((prev) => ({ ...prev, loading: true, error: null }));
    if (photo) {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", categoryName);
      formData.append("photo", photo);
      formData.append("categoryId", categoryId);

      try {
        await api.post("/addItems", formData, {
          "Content-Type": "multipart/form-data",
          withCredentials: true,
        });
        updateApiDoneStatus(!apiDone);
        setStatus({ error: null, loading: false });
        updateModalStatus(false, null);
      } catch (e) {
        console.log(e);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error adding the item.`,
        }));
        updateModalStatus(null, false);
      }
    } else {
      setNoPhotoFound(true);
      setStatus({ error: null, loading: false });
      console.log("No file found");
    }
  }

  const formJSX = (
    <div>
      <h1 className="text-2xl font-bold">Add Item</h1>
      <form onSubmit={formik.handleSubmit} className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Title
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.title && formik.errors.title ? (
                <p className="my-1 text-red-500">{formik.errors.title}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Description
            </label>
            <div className="mt-1">
              <textarea
                className="flex h-16 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
                rows={17}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <p className="my-1 text-red-500">{formik.errors.description}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-lg font-medium text-gray-900">
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
              ></input>
              {formik.touched.price && formik.errors.price ? (
                <p className="my-1 text-red-500">{formik.errors.price}</p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Category
            </label>
          </div>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
            name="category"
            value={formik.values.category}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          >
            <option value="" disabled selected>
              Select a category
            </option>
            {formattedData?.map((item) => (
              <option
                key={item?.categoryName}
                value={`${item?.categoryName}:${item?._id}`}
              >
                {item?.categoryName}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category ? (
            <p className="my-1 text-red-500">{formik.errors.category}</p>
          ) : (
            ""
          )}

          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-4">
              {photo ? <span>{photo?.name}</span> : <span>Upload Image</span>}
              <div className="w-8 h-8 relative overflow-hidden ">
                <input
                  ref={inputRef}
                  type="file"
                  className="absolute top-0 left-0 opacity-0"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                    const file = e.target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setNoPhotoFound(false);
                  }}
                />
                <FaCloudUploadAlt className="pointer-events-none w-full h-full text-gray-900 hover:scale-110 duration-200 cursor-pointer" />
              </div>
              {selectedImage && (
                <img
                  className="max-w-[120px] max-h-[180px]"
                  src={selectedImage}
                  alt="Selected"
                />
              )}
            </div>
          </div>
          {noPhotoFound ? (
            <p className="my-1 text-red-500">Select an Image</p>
          ) : (
            ""
          )}
          {status.error && <p>{status.error}</p>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5  font-regular leading-7 text-white  text-xl hover:cursor-pointer"
            >
              {status.loading ? "Adding..." : "Add an item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return <div>{loading ? <h1>Loading...</h1> : formJSX}</div>;
}
