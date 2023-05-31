import React, { useState, useEffect } from "react";
import api from "../../../../config/AxiosBase";
import { useCtx } from "../../../../context/Ctx";
import { useCartCtx } from "../../../../context/CartCtx";
import { WaiterOrder } from "../orders";

const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formattedData, setFormattedData] = useState(false);
  const [ordersList, setOrdersList] = useState();
  const [active, setActive] = useState("");
  const [toggleDetail, setToggleDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [isOpen, setIsOpen] = useState({});
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const {
    updateCartModalStatus,
    itemsOfCart,
    onItemAdd,
    updateCartStatus,
    addOrderData,
  } = useCartCtx();

  const getLobbies = async () => {
    setIsLoading(true);
    const resp = await api.get("/getLobbies", {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }

    setFormattedData(resp.data.data.doc);
    setIsOpen(resp.data.data.doc[0]?.lobbyName);
    setActive(resp.data.data.doc[0]?.lobbyName);
    setIsLoading(false);
  };

  const getOrders = async () => {
    const resp = await api.get("/getAllOrders", {
      withCredentials: true,
    });

    setOrdersList(resp.data.data.doc);
  };

  const getSingleOrders = async (lobbyName, tableNo) => {
    const resp = await api.get(`/getSingleOrder/${lobbyName}/${tableNo}`, {
      withCredentials: true,
    });

    const transformObj = {
      price: resp?.data.data[0].Price,
      qty: resp?.data.data[0].Qty,
      slug: resp?.data.data[0]._id,
      title: resp?.data.data[0].Title,
    };

    onItemAdd(transformObj);
  };
  useEffect(() => {
    getLobbies();
    getOrders();
  }, [apiDone]);

  // function filterByLobby(lobbyName) {
  //   return ordersList.filter((obj) => obj.LobbyName === lobbyName);
  // }

  const handleItemClick = (lobbyName) => {
    setIsOpen((prevOpen) => (prevOpen === lobbyName ? "" : lobbyName));
    setActive(lobbyName);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something goes wrong.</p>;

  return (
    <div>
      <main className="p-5 bg-light-blue">
        <div className="flex justify-center items-start my-2">
          <div className="w-full my-1">
            <ul className="flex flex-col">
              {formattedData &&
                formattedData.map((item) => (
                  <li className="bg-white my-2 shadow-lg" key={item.lobbyName}>
                    <h2
                      onClick={() => handleItemClick(item.lobbyName)}
                      className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
                    >
                      <span>{item.lobbyName}</span>
                      <svg
                        className={`fill-current text-purple-700 h-6 w-6 transform transition-transform duration-500 ${
                          isOpen === item.lobbyName ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                      </svg>
                    </h2>
                    <div
                      className={`${
                        isOpen === item.lobbyName ? "relative" : "hidden"
                      } border-l-2 border-purple-600 duration-500 transition-all`}
                    >
                      <div className="p-3 mt-4 flex gap-4 flex-wrap">
                        {item.Tables.map((i, ind) => (
                          <p
                            key={ind + 1}
                            className={`${
                              i?.isBooked !== true
                                ? "bg-gray-400"
                                : "bg-blue-500"
                            } px-4 py-2 w-14 h-14 rounded-md hover:scale-110 duration-200 cursor-pointer flex items-center justify-center text-white`}
                            onClick={() => {
                              if (i?.isBooked !== true) {
                                addOrderData(item.lobbyName, i.tableNumber);
                                updateModalStatus(
                                  true,
                                  <UpdateStatusJSX
                                    slug={orderDetail?._id}
                                    updateModalStatus={updateModalStatus}
                                    updateApiDoneStatus={updateApiDoneStatus}
                                    apiDone={apiDone}
                                    updateCartStatus={updateCartStatus}
                                  />
                                );
                              } else {
                                getSingleOrders(item.lobbyName, i.tableNumber);
                              }
                            }}
                          >
                            {i.tableNumber}
                          </p>
                        ))}
                        {/* {ordersList &&
                          filterByLobby(active)?.map((item, index) => (
                            <p
                              key={index + 1}
                              className={`${
                                item?.Status === "Pending"
                                  ? "bg-gray-400"
                                  : "bg-blue-500"
                              } px-4 py-2 w-14 h-14 rounded-md hover:scale-110 duration-200 cursor-pointer flex items-center justify-center`}
                              onClick={() => {
                                setToggleDetail(true);
                                setOrderDetail(item);
                              }}
                            >
                              {item.TableNo}
                            </p>
                          ))} */}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
      {/* <div className="w-full flex flex-wrap gap-4 mt-4">
        <select
          onChange={handleSelectChange}
          className="cursor-pointer rounded-full w-40 p-5 bg-[#F3F4F6] text-gray-900"
        >
          <option value="" disabled selected>
            Select Lobby
          </option>
          {formattedData &&
            formattedData.map((item) => (
              <option
                key={item._id}
                value={item.lobbyName}
                className="active:bg-gray-900"
              >
                {item.lobbyName}
              </option>
            ))}
        </select>
      </div> */}

      {toggleDetail && (
        <div className="mt-4 bg-blue-500 p-4 rounded-2xl text-white">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-2">Order Detail</h1>
            <span
              className="font-bold cursor-pointer"
              onClick={() => setToggleDetail(false)}
            >
              X
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <h2 className="font-semibold">Customer Name:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Name}
              </h2>
            </div>
            <div className="flex gap-4">
              <h2 className="font-semibold">Table No:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.TableNo}
              </h2>
            </div>
          </div>
          <div className="border-t-2 border-b-2 py-2 my-2 ">
            <div className="flex gap-4">
              <h2 className="font-semibold">Title:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Title}
              </h2>
            </div>

            <div className="flex gap-4">
              <h2 className="font-semibold">Quantity:</h2>
              <h2 className="text-gray-900 font-semibold">{orderDetail.Qty}</h2>
            </div>
            <div className="flex gap-4">
              <h2 className="font-semibold">Price:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Price}
              </h2>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Total Price</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.TotalPrice}
                </h2>
              </div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Payment Method:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.PaymentMethod}
                </h2>
              </div>
            </div>
            <div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Type:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.Type}
                </h2>
              </div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Status:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.Status}
                </h2>
              </div>
              {orderDetail.Status !== "Delivered" && (
                <button
                  className="bg-gray-900 py-1 px-2 rounded-md hover:underline hover:scale-105 duration-200"
                  onClick={async () =>
                    updateModalStatus(
                      true,
                      <UpdateStatusJSX
                        slug={orderDetail?._id}
                        updateModalStatus={updateModalStatus}
                        updateApiDoneStatus={updateApiDoneStatus}
                        apiDone={apiDone}
                      />
                    )
                  }
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;

const UpdateStatusJSX = ({
  slug,
  updateModalStatus,
  updateApiDoneStatus,
  apiDone,
  updateCartStatus,
}) => {
  const [status, setStatus] = useState({ loading: false, error: null });

  return (
    // <div>
    //   <h1 className="text-xl font-bold py-2">Confirm to Update status.</h1>
    //   {status.loading ? (
    //     <button
    //       className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
    //       disabled={status.loading}
    //     >
    //       Updating....
    //     </button>
    //   ) : (
    //     <div className="flex mt-2">
    //       <button
    //         className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
    //         onClick={async () => {
    //           try {
    //             setStatus({ loading: true, error: null });
    //             await api.patch(`/updateOrderById/${slug}`, {
    //               withCredentials: true,
    //             });

    //             setStatus({
    //               loading: false,
    //               error: null,
    //             });
    //             updateModalStatus(false, null);
    //             updateApiDoneStatus(!apiDone);
    //           } catch (e) {
    //             console.log(e);
    //             setStatus({
    //               loading: false,
    //               error: "Error updating the status.",
    //             });
    //           }
    //         }}
    //         disabled={status.loading}
    //       >
    //         Yes
    //       </button>
    //       <button
    //         className="bg-black text-base font-semibold text-white rounded-md py-2 px-4 mr-2"
    //         onClick={() => updateModalStatus(false, null)}
    //         disabled={status.loading}
    //       >
    //         No
    //       </button>
    //     </div>
    //   )}

    //   {status.error && <h1>{status.error}</h1>}
    // </div>
    <div>
      <WaiterOrder />
      {/* <div className="flex justify-end">
        <button
          onClick={() => updateCartStatus(true)}
          className="bg-gray-900 hover:scale-105 duration-200 text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
        >
          Proceed to cart
        </button>
      </div> */}
    </div>
  );
};