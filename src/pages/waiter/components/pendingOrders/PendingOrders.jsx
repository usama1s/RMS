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
  const { onItemAddFromAPI, updateCartStatus, addOrderData } = useCartCtx();

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

  const getSingleOrders = async (lobbyName, tableNo, orderId) => {
    const resp = await api.get(
      `/getSingleOrder/${lobbyName}/${tableNo}/${orderId}`,
      {
        withCredentials: true,
      }
    );

    const transformObj = {
      slug: resp.data.data[0]._id,
      createdAt: resp.data.data[0].createdAt,
      lobby: resp.data.data[0].LobbyName,
      tableNo: resp.data.data[0].TableNo,
      item: resp.data.data[0].OrderItems,
      totalPrice: resp.data.data[0].TotalPrice,
    };

    onItemAddFromAPI(transformObj);
    updateCartStatus(true);
  };

  useEffect(() => {
    getLobbies();
    getOrders();
  }, [apiDone]);

  useEffect(() => {
    const tableNo = localStorage.getItem("seletedTable") * 1;
    const lobbyNam = localStorage.getItem("seletedLobby")?.toString();
    const orderId = localStorage.getItem("orderId")?.toString();

    if ((tableNo, lobbyNam, orderId)) {
      getSingleOrders(lobbyNam, tableNo, orderId);
    }
  }, [apiDone]);

  const handleItemClick = (lobbyName) => {
    setIsOpen((prevOpen) => (prevOpen === lobbyName ? "" : lobbyName));
    setActive(lobbyName);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something goes wrong.</p>;

  // const data = [
  //   {
  //     items: [
  //       {
  //         Title: "dal soup",
  //         Qty: 2,
  //         Price: 85,
  //         _id: "6492fc55c94f374162a0dc6c",
  //       },
  //       {
  //         Title: "Lamb",
  //         Qty: 2,
  //         Price: 250,
  //         _id: "6492fc55c94f374162a0dc6d",
  //       },
  //       {
  //         Title: "Haidrabadi Biryai",
  //         Qty: 2,
  //         Price: 450,
  //         _id: "6492fc55c94f374162a0dc6e",
  //       },
  //     ],
  //     createdAt: "2023-06-21T13:34:13.116Z",
  //     _id: "6492fc55c94f374162a0dc6b",
  //   },
  // ];
  // const handlePrint = () => {
  //   const printableData = `
  //     <html>
  //       <head>
  //         <style>
  //           .logo {width: 50px; height: 50px;}
  //           .header {display: flex; flex-direction: column; align-items: center;}
  //           h2 { font-size: 18px; font-weight: bold; }
  //           h2 { font-size: 18px; font-weight: bold; }
  //           p { font-size: 14px; }
  //           .item-div {display: flex; justify-content: space-between;}
  //           .item-div p {min-width: 50px; max-width:50px}
  //         </style>
  //       </head>
  //       <body>
  //         <div class="header">
  //           <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="logo" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"></path></svg>
  //           <h2>India Gate</h2>
  //         </div>
  //         <h2>Order Details</h2>
  //         <p>Order Placed At:<br/> ${data[0].createdAt}</p>
  //         <h2>Items</h2>
  //         ${data[0].items
  //           .map(
  //             (item) =>
  //               `<div class="item-div"><p>${item.Title}</p>  <p>${item.Qty}</p> <p>${item.Price}</p></div>`
  //           )
  //           .join("")}
  //       </body>
  //     </html>
  //   `;

  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.open();
  //   printWindow.document.write(printableData);
  //   printWindow.document.close();

  //   printWindow.onload = () => {
  //     printWindow.print();
  //     printWindow.close();
  //   };
  // };

  return (
    <div>
      {/* <button className="bg-red-500" onClick={() => handlePrint()}>
        Print
      </button> */}
      <main className="p-5 bg-light-blue">
        <div className="flex justify-center items-start my-2">
          <div className="w-full my-1">
            <ul className="flex flex-col">
              {formattedData &&
                formattedData?.map((item) => (
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
                        {item.Tables?.map((i, ind) => (
                          <p
                            key={ind + 1}
                            className={`${
                              i?.isBooked !== true &&
                              ordersList?.map(
                                (j, index) => j.TableNo === i.tableNo
                              )
                                ? "bg-gray-400"
                                : "bg-blue-500"
                            } px-4 py-2 w-14 h-14 rounded-md hover:scale-110 duration-200 cursor-pointer flex items-center justify-center text-white`}
                            onClick={() => {
                              if (i?.isBooked !== true) {
                                localStorage.setItem(
                                  "seletedLobby",
                                  item.lobbyName
                                );
                                localStorage.setItem(
                                  "seletedTable",
                                  i.tableNumber
                                );
                                localStorage.removeItem("orderId");
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
                                {
                                  if (
                                    ordersList?.find(
                                      (order) => order.TableNo === i.tableNumber
                                    )
                                  ) {
                                    const order = ordersList.find(
                                      (order) => order.TableNo === i.tableNumber
                                    );
                                    localStorage.setItem("orderId", order._id);
                                  }
                                }
                                localStorage.setItem(
                                  "seletedLobby",
                                  item.lobbyName
                                );
                                localStorage.setItem(
                                  "seletedTable",
                                  i.tableNumber
                                );
                                addOrderData(item.lobbyName, i.tableNumber);
                                getSingleOrders(
                                  item.lobbyName,
                                  i.tableNumber,
                                  localStorage.getItem("orderId")?.toString()
                                );
                              }
                            }}
                          >
                            {i.tableNumber}
                          </p>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
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

const UpdateStatusJSX = () => {
  return (
    <div>
      <WaiterOrder />
    </div>
  );
};
