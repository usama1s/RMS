import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { db } from "../../../../config/@firebase";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { doc, deleteDoc } from "firebase/firestore";
import { ManagerEditCategory } from "./edit-categories";
import { useCtx } from "../../../../context/Ctx";
const { categories } = COLLECTIONS;
export function ManagerCategoriesListingsItems({ slug, title }) {
  const { updateModalStatus, updateCategoryValue } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });

  const updateItemHandler = async () => {
    updateCategoryValue({ slug, title });
    updateModalStatus(true, <ManagerEditCategory />);
  };
  return (
    <div className="flex items-center  bg-[#FBFBFB] shadow-md w-full p-4 rounded-md my-4 relative">
      <div>
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <div className="absolute right-4 flex">
        <TrashIcon
          onClick={async () =>
            updateModalStatus(
              true,
              <DeleteItemJSX
                slug={slug}
                updateModalStatus={updateModalStatus}
              />
            )
          }
          className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
        />
        <PencilIcon
          onClick={updateItemHandler}
          className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
        />
      </div>
    </div>
  );
}
const DeleteItemJSX = ({ slug, updateModalStatus }) => {
  const [status, setStatus] = useState({ loading: false, error: null });
  return (
    <div>
      <h1 className="text-xl font-bold py-2">Confirm to delete item.</h1>
      {status.loading ? (
        <button
          className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
          disabled={status.loading}
        >
          Deleting....
        </button>
      ) : (
        <div className="flex mt-2">
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
            onClick={async () => {
              try {
                setStatus({ loading: true, error: null });
                await deleteDoc(doc(db, categories, slug));
                setStatus({
                  loading: false,
                  error: null,
                });
                updateModalStatus(false, null);
              } catch (e) {
                // setStatus({
                //   loading: false,
                //   error: "Error deleting the item.",
                // });
              }
            }}
            disabled={status.loading}
          >
            Yes
          </button>
          <button
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4 mr-2"
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
};
