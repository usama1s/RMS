import { useCtx } from '../context/Ctx';
import api from '../config/AxiosBase';

export function CartItems(props) {
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();

  function convertToReadable(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return dateTime.toLocaleString(undefined, options);
  }

  return (
    <>
      {props &&
        props?.data.map((pItem, pIndex) => (
          <div key={pIndex + 1} className="flex flex-col my-2 ">
            {pItem?.item?.map((j, index) => (
              <div key={index + 1} className="flex flex-col w-full">
                <div className="">
                  <p className="text-right font-semibold ">{`Order Placed At ${convertToReadable(
                    j.createdAt
                  )}`}</p>
                  <hr className="mb-2" />
                </div>
                {j.items?.map((i, index) => (
                  <div key={index + 1}>
                    <div className="flex justify-between p-1">
                      <div className="w-full flex items-center justify-between gap-2">
                        <h2 className="truncate break-words pb-1 text-md font-bold">
                          {i.Title}
                        </h2>
                        <p className="truncate break-words text-base">
                          {i.Price} x {i.Qty} ={i.Price * i.Qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {localStorage.getItem('ADMIN') !== 'MANAGER' && (
                          <svg
                            onClick={() =>
                              updateModalStatus(
                                true,
                                <DeleteCartItemJSX
                                  orderId={pItem.slug}
                                  itemId={i._id}
                                  updateModalStatus={updateModalStatus}
                                  updateApiDoneStatus={updateApiDoneStatus}
                                  apiDone={apiDone}
                                />
                              )
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 ml-3 hover:scale-110 duration-200 cursor-pointer text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {j.customerNote ? (
                  <>
                    <h5 className="font-semibold text-sm text-gray-500 underline">
                      Customer Note
                    </h5>
                    <p className="text-sm">{j.customerNote}</p>
                  </>
                ) : null}

                <div className="mb-3" />
              </div>
            ))}
          </div>
        ))}
    </>
  );
}

function DeleteCartItemJSX({
  orderId,
  itemId,
  updateModalStatus,
  updateApiDoneStatus,
  apiDone,
}) {
  const deleteItem = async () => {
    await api.patch(`/deleteItemBy/${orderId}/${itemId}`, {
      withCredentials: true,
    });

    updateApiDoneStatus(!apiDone);
    updateModalStatus(false, null);
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold py-4">
        Confirm to delete item...
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => {
            deleteItem();
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
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
