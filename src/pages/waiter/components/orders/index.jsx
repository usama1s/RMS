import React, { useState, useEffect } from "react";
// import { COLLECTIONS } from "../../../../utils/firestore-collections";
// import { formatCollectionData } from "../../../../utils/formatData";
// import { db } from "../../../../config/@firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useCollection } from "react-firebase-hooks/firestore";
//Components
import { ManagerOrderSlider } from "./slider";
import { ManagerOrderCards } from "./cards";
import { Loading } from "../../../../components/loading";
// import { useCartCtx } from "../../../../context/CartCtx";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export function WaiterOrder() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();
  const [items, setItems] = useState();
  const { apiDone } = useCtx;
  const [sliderData, setSliderData] = useState({
    categories: null,
    activeCategory: null,
  });
  const [active, setActive] = useState("");

  const getCategories = async () => {
    setLoading(true);
    const resp = await api.get("/getAllCategories", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  const getItemByCategory = async () => {
    const resp = await api.get("/getItemsById/" + active, {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setItems(resp.data.data);
  };

  useEffect(() => {
    getItemByCategory();
  }, [active]);

  console.log(items);

  useEffect(() => {
    getItemByCategory();
  }, []);

  if (formattedData?.length < 1)
    return formattedData?.length < 1 ? (
      <h1 className="font-semibold text-xl">
        No Categories. Add Categories to proceed.
      </h1>
    ) : (
      <h1 className="font-semibold text-xl">Error fetching categories..</h1>
    );

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full flex flex-wrap gap-4 mt-4">
        {formattedData?.map((item, index) => (
          <div
            key={index + 1}
            onClick={() => setActive(item?._id)}
            className={`cursor-pointer
          ${
            item._id === active
              ? "bg-gray-900 text-white"
              : "bg-[#F3F4F6] text-gray-900"
          } rounded-full w-40 h-5 p-5 flex items-center justify-center`}
          >
            <p>{item.categoryName}</p>
          </div>
        ))}
      </div>

      <ManagerOrderCards items={items} />
    </>
  );
}
