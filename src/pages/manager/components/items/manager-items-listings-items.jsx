import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { db } from "../../../../config/@firebase";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { doc, deleteDoc } from "firebase/firestore";
import { useCtx } from "../../../../context/Ctx";
import { ManagerEditItem } from "./edit-items";
import { Loading } from "../../../../components/loading";
const { food_items } = COLLECTIONS;
export function ManagerItemsListingItems({
  title,
  imageURL,
  price,
  slug,
  description,
  category,
}) {
  const { updateItemValue, updateModalStatus, modalStatus } = useCtx();
  // const [status, setStatus] = useState({ loading: false, error: null });

  const updateItemHandler = async () => {
    updateModalStatus(true, <ManagerEditItem />);
    updateItemValue({ title, slug, imageURL, description, price, category });
  };

  return (
    <div className="flex  bg-[#FBFBFB] shadow-md w-full rounded-md my-2 relative">
      <div className=" w-40 h-40">
        <img
          className="w-full h-full object-cover rounded-md mr-4"
          src={imageURL}
        />
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between w-full ">
          <h3 className="font-bold text-xl p-1 ">{title}</h3>
          <div className="flex ">
            <TrashIcon
              onClick={async () => {
                updateModalStatus(
                  true,
                  <DeleteItemJSX
                    slug={slug}
                    updateModalStatus={updateModalStatus}
                  />
                );
              }}
              className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
            />
            <PencilIcon
              onClick={updateItemHandler}
              className="h-6 w-6 mr-2 text-gray-900 cursor-pointer hover:scale-110 duration-200"
            />
          </div>
        </div>
        <p className="pt-2 text-sm truncate break-words">
          <span className="font-semibold text-base mr-1"> Category:</span>
          {category}
        </p>
        <p className="text-sm truncate break-words">
          <span className="font-semibold text-base mr-1"> Description:</span>
          {description}
        </p>
        <p className="pt-2 text-sm">
          <span className="font-semibold text-base mr-1"> Price:</span>{" "}
          <span className="py-1 bg-green-500 rounded-md text-white px-2 font-semibold">
            ${price}
          </span>
        </p>
      </div>
    </div>
  );
}
function DeleteItemJSX({ slug, updateModalStatus }) {
  const [status, setStatus] = useState({ loading: false, error: null });
  return (
    <div>
      <h1 className="text-xl font-bold py-2">Confirm to delete item.</h1>
      {status.loading ? (
        <button className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2">
          Deleting...
        </button>
      ) : (
        <div className="flex">
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={async () => {
              setStatus({ loading: true, error: null });
              await deleteDoc(doc(db, food_items, slug));
              updateModalStatus(false, null);
              setStatus({
                loading: false,
                error: null,
              });
            }}
            disabled={status.loading}
          >
            Yes
          </button>
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={() => updateModalStatus(false, null)}
            disabled={status.loading}
          >
            No
          </button>
        </div>
      )}
      {status.error && <h1>{status.error}</h1>}
    </div>
  );
}
