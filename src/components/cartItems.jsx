import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import { useCartCtx } from "../context/CartCtx";
import { useCtx } from "../context/Ctx";

export function CartItems({ item, slug, createdAt }) {
  const { onItemDelete, onCartItemAdd, onCartItemRemove, onApiItemDelete } =
    useCartCtx();
  const { updateModalStatus } = useCtx();

  function convertToReadable(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      // weekday: "long",
      // year: "numeric",
      // month: "long",
      // day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
    };
    return dateTime.toLocaleString(undefined, options);
  }

  return (
    <div className="flex flex-col my-2 ">
      <div className="flex flex-col w-full">
        {item?.map((i, index) => (
          <div key={index + 1}>
            {/* <p className="text-right">{convertToReadable(i.createdAt)}</p> */}
            <div className="flex justify-between bg-[#F3F4F6] p-1">
              <div className="w-full flex items-center justify-between gap-2">
                <h2 className="truncate break-words pb-1 text-xl font-bold">
                  {i.Title}
                </h2>
                <p className="truncate break-words text-base">
                  {i.Price} x {i.Qty} ={i.Price * i.Qty}
                </p>
              </div>
              {/* <div className="flex items-center gap-4">
                  <div className="flex space-x-2  py-2">
                    <MinusCircleIcon
                      onClick={() => onCartItemRemove({ slug })}
                      className="h-6 w-6 cursor-pointer"
                    />
                    <span className="text-sm font-normal">qty</span>
                    <PlusCircleIcon
                      onClick={() => onCartItemAdd({ slug })}
                      className="h-6 w-6 cursor-pointer"
                    />
                  </div>
                  <svg
                    onClick={() =>
                      updateModalStatus(
                        true,
                        <DeleteCartItemJSX
                          slug={slug}
                          onItemDelete={onItemDelete}
                          updateModalStatus={updateModalStatus}
                          onApiItemDelete={onApiItemDelete}
                        />
                      )
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div> */}
            </div>
            <div className="my-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteCartItemJSX({
  updateModalStatus,
  onItemDelete,
  onApiItemDelete,
  slug,
}) {
  return (
    <div>
      <h2 className="text-2xl text-center font-bold py-4">
        Confirm to delete...
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onItemDelete(slug);
            onApiItemDelete(slug);
            updateModalStatus(false, null);
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          Yes
        </button>
        <button
          onClick={() => {
            updateModalStatus(false, null);
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          No
        </button>
      </div>
    </div>
  );
}
