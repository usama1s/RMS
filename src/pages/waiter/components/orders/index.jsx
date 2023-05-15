import React, { useState, useEffect } from "react";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { formatCollectionData } from "../../../../utils/formatData";
import { db } from "../../../../config/@firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
//Components
import { ManagerOrderSlider } from "./slider";
import { ManagerOrderCards } from "./cards";
import { Loading } from "../../../../components/loading";
import { useCartCtx } from "../../../../context/CartCtx";
import { useCtx } from "../../../../context/Ctx";
export function WaiterOrder() {
  const { authenticatedUser } = useCtx();
  const [categories, loadingStatusCategories, errorStatusCategories] =
    useCollection(
      query(
        collection(db, COLLECTIONS.categories),
        where("branchId", "==", authenticatedUser.branchId)
      ),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );
  const [cardItems, setCardItems] = useState({
    loading: false,
    error: null,
    data: null,
  });
  const formattedData = formatCollectionData(categories);
  const [sliderData, setSliderData] = useState({
    categories: null,
    activeCategory: null,
  });
  useEffect(() => {
    let items = null;
    const getCardItems = async () => {
      setCardItems({ data: null, loading: true, error: null });
      try {
        const data = await getDocs(
          query(
            collection(db, COLLECTIONS.food_items),
            where("category", "==", sliderData.activeCategory),
            where("branchId", "==", authenticatedUser.branchId)
          )
        );
        items = data && formatCollectionData(data);
        if (items.length >= 1) {
          setCardItems({
            data: items,
            loading: false,
            error: null,
          });
        } else {
          setCardItems({
            data: null,
            loading: false,
            error: "No items right now",
          });
        }
      } catch (e) {
        setCardItems({
          data: null,
          loading: false,
          error: "Error fetching Items.",
        });
      }
    };

    getCardItems();
  }, [sliderData.activeCategory]);
  useEffect(() => {
    setSliderData({
      categories:
        formattedData &&
        formattedData.map((data, index) => ({
          ...data,
          active: index === 0 ? true : false,
        })),
      activeCategory: formattedData && formattedData?.[0]?.title,
    });
  }, [categories]);
  const updateSliderCategory = (title) => {
    const data = [...sliderData.categories].map((d) =>
      d.title === title ? { ...d, active: true } : { ...d, active: false }
    );
    setSliderData({ categories: data, activeCategory: title });
  };
  if (errorStatusCategories || formattedData?.length < 1)
    return formattedData?.length < 1 ? (
      <h1 className="font-semibold text-xl">
        No Categories. Add Categories to proceed.
      </h1>
    ) : (
      <h1 className="font-semibold text-xl">Error fetching categories..</h1>
    );
  if (loadingStatusCategories) return <Loading />;
  return (
    <>
      <ManagerOrderSlider
        data={sliderData}
        updateSliderCategory={updateSliderCategory}
      />
      <ManagerOrderCards items={cardItems} />
    </>
  );
}
