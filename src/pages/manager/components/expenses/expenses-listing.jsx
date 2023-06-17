import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { EditExpenses } from "./edit-expenses";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export const ExpensesListingsItems = ({ formattedD }) => {
  const {
    updateModalStatus,
    updateCategoryValue,
    updateApiDoneStatus,
    editedCategoryValue,
    apiDone,
  } = useCtx();

  const updateItemHandler = async (slug, title, amount) => {
    await updateCategoryValue({ slug, title, amount });
    updateModalStatus(true, <EditExpenses />);
  };

  return (
    <>
      {formattedD?.map((item, index) => (
        <div
          key={index + 1}
          className="flex items-center  bg-[#FBFBFB] shadow-md w-full p-4 rounded-md my-4 relative"
        >
          <div>
            <h3 className="font-bold text-xl">{item?.title}</h3>
            <p className="text-sm font-semibold">Amount: {item?.amount}</p>
          </div>
          <div className="absolute right-4 flex">
            <TrashIcon
              onClick={async () =>
                updateModalStatus(
                  true,
                  <DeleteItemJSX
                    slug={item?._id}
                    updateModalStatus={updateModalStatus}
                    updateApiDoneStatus={updateApiDoneStatus}
                    apiDone={apiDone}
                  />
                )
              }
              className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
            />
            <PencilIcon
              onClick={() => {
                updateItemHandler(item?._id, item?.title, item?.amount);
              }}
              className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
            />
          </div>
        </div>
      ))}
    </>
  );
};

const DeleteItemJSX = ({
  slug,
  updateModalStatus,
  updateApiDoneStatus,
  apiDone,
}) => {
  const [status, setStatus] = useState({ loading: false, error: null });

  return (
    <div>
      <h1 className="text-xl font-bold py-2">Confirm to delete Expense.</h1>
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
                await api.delete(`/removeExpense/${slug}`, {
                  withCredentials: true,
                });

                setStatus({
                  loading: false,
                  error: null,
                });
                updateModalStatus(false, null);
                updateApiDoneStatus(!apiDone);
              } catch (e) {
                console.log(e);
                setStatus({
                  loading: false,
                  error: "Error deleting the item.",
                });
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