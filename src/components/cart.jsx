import React, { useEffect, useState } from "react";
import { CartItems } from "./cartItems";
import { CartItems2 } from "./cartItems2";
import { useCtx } from "../context/Ctx";
import { useCartCtx } from "../context/CartCtx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { WaiterOrder } from "../pages/waiter/components/orders";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Cart2Items } from "./cart2Items";
import api from "../config/AxiosBase";
import printJS from "print-js";

export function Cart({ title }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [cartSwitch, setCartSwitch] = useState(false);

  const {
    updateCartStatus,
    cartStatus,
    itemsOfCart,
    apiItemsOfCart,
    orderData,
    resetCart,
    onClearCart,
    resetApiCart,
  } = useCartCtx();
  const { updateModalStatus, updateApiDoneStatus, apiDone, modalStatus } =
    useCtx();

  const handleTooltipMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setShowTooltip(false);
  };

  function convertToReadable(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return dateTime.toLocaleString(undefined, options);
  }

  const cancelOrderHandler = async () => {
    const payload = {
      LobbyId: localStorage.getItem("selectedLobbyId")?.toString(),
      TableNo: apiItemsOfCart[0]?.tableNo,
    };

    const resp = await api.patch(
      `/cancelOrder/${apiItemsOfCart[0].slug}`,
      payload,
      { withCredentials: true }
    );

    localStorage.removeItem("seletedTable");
    localStorage.removeItem("seletedLobby");
    resetApiCart();
    updateApiDoneStatus(!apiDone);
    updateCartStatus(false);
  };

  const makeOrderPending = async () => {
    const newArray = itemsOfCart.map((item) => {
      const { title, price, qty } = item;
      return {
        Qty: qty,
        Price: price,
        Title: title,
      };
    });

    const payload = {
      LobbyName: localStorage.getItem("seletedLobby")?.toString(),
      LobbyId: localStorage.getItem("selectedLobbyId")?.toString(),
      TableNo: localStorage.getItem("seletedTable") * 1,
      items: newArray,
      slug: apiItemsOfCart[0]?.slug,
      managerId: localStorage.getItem("managerId"),
    };

    const resp = await api.post("/makeDineInOrderPending", payload, {
      withCredentials: true,
    });

    const currentTime = Date.now();
    const date = new Date(currentTime);
    const readableDate = date.toLocaleString();

    const printableData = `
      <html>
        <head>
          <style>
            body {margin: 0px;}
            .logo {width: 200px;}
            .header {display: flex; flex-direction: column; align-items: center; margin-bottom: -20px;}
            .branch-name {font-size: 20px; font-weight: bold;}
            h2 { font-size: 20px; font-weight: bold; margin-top: -10px; }
            h2 { font-size: 20px; font-weight: bold; }
            p { font-size: 18px; margin-top: 0px; margin-bottom: 0px; }
            .item-div {display: flex; gap: 10px; justify-content: space-between;}
            .item-div p {min-width: max-content; max-width: max-content; text-align: left; font-size: 18px;}
            span {border-top-style: dotted; margin-top: 15px; display: block; display: flex; justify-content: end;}
            .bottom-text {display: flex; flex-direction: column; align-items: center; margin-top: 30px;}
            .bottom-text p {font-size: 16px;}
            .main-data {
              display: flex;
              gap: 10px;
              text-align: left;
            }
            .left-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 105px;
              text-align: right;
            }
            .right-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 100px;
            }
            </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.png" class="logo"/>
            <p class="branch-name">${localStorage.getItem("branchName")}</p>
          </div>
          <h2>Order Details</h2>
            <div class="main-data">
              <p class="left-side">Bölüm:</p>
              <p class="right-side">${payload.LobbyName}</p>
            </div>
            <div class="main-data">
              <p class="left-side">Masa:</p>
              <p class="right-side">${payload.TableNo}</p>
            </div>
            <div class="main-data">
              <p class="left-side">sipariş verildi:</p>
              <p class="right-side">${readableDate}</p>
            </div>
          <h3>Items</h3>
          ${payload.items
            .map(
              (item) =>
                `<div class="item-div"> <p>${item.Qty}</p><p style="margin-right:auto;">${item.Title}</div>`
            )
            .join("")}
            <div class="bottom-text">
              <p style={max-width: fit-content; font-size: 15px;}>^TEŞEKKÜRLER^</p>
              <p style={max-width: fit-content; font-size: 15px;}>* FİNANSAL DEĞERİ YOKTUR *</p>
            </div>
        </body>
      </html>
    `;

    const printOptions = {
      printable: printableData,
      type: "raw-html",
      silent: true,
    };

    printJS(printOptions);

    // const printWindow = window.open("", "_blank");
    // printWindow.document.open();
    // printWindow.document.write(printableData);
    // printWindow.document.close();

    localStorage.setItem("orderId", resp?.data._id);
    onClearCart();
    updateApiDoneStatus(!apiDone);
  };

  // const handleOrderPrint = () => {
  //   // printing code
  //   const printableData = `
  //     <html>
  //       <head>
  //         <style>
  //           body {margin: 0px;}
  //           .logo {width: 200px;}
  //           .header {display: flex; flex-direction: column; align-items: center;}
  //           h2 { font-size: 18px; font-weight: bold; margin-top: -10px; }
  //           h2 { font-size: 18px; font-weight: bold; }
  //           p { font-size: 14px; margin-top: 0px; margin-bottom: 0px; }
  //           .item-div {display: flex; justify-content: space-between;}
  //           .item-div p {min-width: 24px; max-width: 105px;text-align: left;}
  //           span {border-top-style: dotted; margin-top: 15px; display: block; display: flex; justify-content: end;}
  //           .bottom-text {display: flex; flex-direction: column; align-items: center; margin-top: 30px;}
  //           .main-data {
  //           display: flex;
  //           gap: 10px;
  //           text-align: left;
  //           }
  //           .left-side {
  //             margin-top: 0px;
  //             margin-bottom: 0px;
  //             min-width: 80px;
  //             text-align: right;
  //           }
  //           .right-side {
  //             margin-top: 0px;
  //             margin-bottom: 0px;
  //             min-width: 100px;
  //           }
  //           </style>
  //       </head>
  //       <body>
  //         <div class="header">
  //           <img src="./public/logo.png" class="logo"/>
  //         </div>
  //         <h2>Order Details</h2>
  //           <div class="main-data">
  //             <p class="left-side">Bölüm:</p>
  //             <p class="right-side">${apiItemsOfCart[0].lobby}</p>
  //           </div>
  //           <div class="main-data">
  //             <p class="left-side">Masa:</p>
  //             <p class="right-side">${apiItemsOfCart[0].tableNo}</p>
  //           </div>
  //           <div class="main-data">
  //             <p class="left-side">sipariş verildi:</p>
  //             <p class="right-side">${convertToReadable(
  //               apiItemsOfCart[0].createdAt
  //             )}</p>
  //           </div>
  //         <h3>Items</h3>
  //         ${apiItemsOfCart[0].item
  //           .flatMap((orderItem) =>
  //             orderItem.items.map(
  //               (item) =>
  //                 `<div class="item-div"> <p>${item.Qty}</p><p style="margin-right:auto;">${item.Title}</p>  <p>${item.Price}</p></div>`
  //             )
  //           )
  //           .join("")}
  //           <span>Genel Toplam: ${apiItemsOfCart[0].totalPrice}</span>
  //           <div class="bottom-text">
  //             <p>^TEŞEKKÜRLER^</p>
  //             <p>* FİNANSAL DEĞERİ YOKTUR *</p>
  //           </div>
  //       </body>
  //     </html>
  //   `;

  //   const printOptions = {
  //     printable: printableData,
  //     type: "raw-html",
  //     silent: true,
  //   };

  //   printJS(printOptions);

  //   // const printWindow = window.open("", "_blank");
  //   // printWindow.document.open();
  //   // printWindow.document.write(printableData);
  //   // printWindow.document.close();

  //   // printWindow.onload = () => {
  //   //   printWindow.print();
  //   //   printWindow.close();
  //   //   silent: true;
  //   // };

  //   // printing code
  // };

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains("card-shadow")) {
          updateCartStatus(false);
        }
      }}
      className={`card-shadow transition-all duration-75 ease-in-outs ${
        cartStatus
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } fixed h-full top-0 right-0 w-full flex justify-end bg-[rgba(0,0,0,0.5)] `}
    >
      <div
        className={`bg-white w-[30rem] flex flex-col overflow-hidden px-2 transition-all duration-75 ease-in-outs ${
          !cartStatus ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between py-4">
          {localStorage.getItem("SubRole") === "Head Waiter" ? (
            apiItemsOfCart.length !== 0 ? (
              <button
                onClick={() => {
                  cancelOrderHandler();
                }}
                disabled={apiItemsOfCart.length <= 0}
                className={`w-fit items-center justify-center rounded-md bg-red-500 hover:bg-red-700 px-2.5 py-2 text-base font-semibold leading-7 text-white`}
              >
                Cancel Order
              </button>
            ) : null
          ) : null}
          <p className="text-center font-semibold text-xl m-auto ">
            {localStorage.getItem("seletedLobby")} -{" "}
            {localStorage.getItem("seletedTable")}
          </p>
          <XMarkIcon
            onClick={() => {
              updateCartStatus(false);
              onClearCart();
            }}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        {cartSwitch === true ? (
          <div className="h-[90vh] overflow-y-scroll customScrollbar pr-2 ">
            <div className="flex justify-end gap-4 font-semibold">
              <span className="font-semibold bg-blue-400 text-white py-1 px-2 rounded-md">
                TRY
              </span>
            </div>
            {apiItemsOfCart && apiItemsOfCart.length >= 1 ? (
              <CartItems data={apiItemsOfCart} />
            ) : null}
            {apiItemsOfCart.length !== 0 && <hr className="my-5" />}
            {itemsOfCart.length >= 1
              ? itemsOfCart.map((itemData) => (
                  <div>
                    <CartItems2 key={itemData.slug} {...itemData} />
                  </div>
                ))
              : null}
            <div className="flex justify-center gap-4">
              {modalStatus.status === false ? (
                <div>
                  <button
                    className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                    onClick={() => {
                      updateModalStatus(true, <UpdateStatusJSX />);
                    }}
                  >
                    <PlusCircleIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:scale-110 duration-200" />
                  </button>
                </div>
              ) : null}
              {itemsOfCart.length !== 0 && (
                <button
                  className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  onClick={() => {
                    makeOrderPending();
                  }}
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[90vh] overflow-y-scroll customScrollbar pr-2 ">
            <div className="flex justify-end gap-4 font-semibold">
              <span className="font-semibold bg-blue-400 text-white py-1 px-2 rounded-md">
                TRY
              </span>
            </div>
            {apiItemsOfCart && apiItemsOfCart.length >= 1 ? (
              <Cart2Items data={apiItemsOfCart} />
            ) : null}
            {apiItemsOfCart.length !== 0 && <hr className="my-5" />}
            {itemsOfCart.length >= 1
              ? itemsOfCart.map((itemData) => (
                  <CartItems2 key={itemData.slug} {...itemData} />
                ))
              : null}
            <div className="flex justify-center gap-4">
              {modalStatus.status === false ? (
                <div className="flex gap-3">
                  <button
                    className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                    onClick={() => {
                      updateModalStatus(true, <UpdateStatusJSX />);
                    }}
                  >
                    <PlusCircleIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:scale-110 duration-200" />
                  </button>
                </div>
              ) : null}
              {itemsOfCart.length !== 0 && (
                <button
                  className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  onClick={() => {
                    makeOrderPending();
                  }}
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        )}
        <button
          className="items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white w-fit hover:scale-105 duration-200"
          onClick={() => {
            setCartSwitch(!cartSwitch);
          }}
        >
          <HiOutlineSwitchHorizontal
            onClick={() => {
              setCartSwitch(!cartSwitch);
            }}
          />
        </button>
        <div className="flex items-center justify-between px-2 m-1">
          <h1 className="text-base font-regular">
            Total TRY:
            <span className="text-gray-900 ml-1 font-bold">
              {apiItemsOfCart[0]?.totalPrice}
            </span>
          </h1>
          <div className="flex gap-2">
            <div className="relative inline-block">
              {localStorage.getItem("SubRole") === "Head Waiter" ? (
                <button
                  onClick={() => {
                    updateModalStatus(
                      true,
                      <PlaceOrderJSX
                        apiDone={apiDone}
                        TotalPriceOfCart={apiItemsOfCart[0]?.totalPrice}
                        itemsOfCart={itemsOfCart}
                        orderData={orderData}
                        resetCart={resetCart}
                        updateApiDoneStatus={updateApiDoneStatus}
                        updateModalStatus={updateModalStatus}
                        updateCartStatus={updateCartStatus}
                        resetApiCart={resetApiCart}
                      />
                    );
                  }}
                  disabled={apiItemsOfCart.length === 0}
                  className={`${
                    apiItemsOfCart.length === 0
                      ? "bg-green-300 hover:bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-700"
                  } items-center justify-center rounded-md px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                >
                  Complete Order
                </button>
              ) : null}
              {showTooltip && (
                <div
                  className="absolute -top-10 -left-[6rem] p-2 bg-gray-800 text-white text-sm rounded-md shadow-md"
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  Proceed to checkout
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UpdateStatusJSX = () => {
  return (
    <div>
      <WaiterOrder />
    </div>
  );
};

const PlaceOrderJSX = ({
  apiDone,
  TotalPriceOfCart,
  itemsOfCart,
  orderData,
  resetCart,
  updateApiDoneStatus,
  updateModalStatus,
  updateCartStatus,
  resetApiCart,
}) => {
  const [resp, setResp] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Cash");
  const [selectedAmount, setSelectedAmount] = useState(TotalPriceOfCart);
  const LobbyName = localStorage.getItem("seletedLobby");
  const TableNo = localStorage.getItem("seletedTable");

  const getPaymentMethods = async () => {
    setLoading(true);
    const resp = await api.get(
      `/getPaymentMethods/${localStorage.getItem("managerId")}`,
      { withCredentials: true }
    );
    if (resp.data.status !== "success") {
      setError(true);
    }

    setResp(resp.data.data);
    setLoading(false);
  };

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  function convertToReadable(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
    };
    return dateTime.toLocaleString(undefined, options);
  }

  const placeOrder = async () => {
    const payload = {
      LobbyName: orderData.lobby || localStorage.getItem("seletedLobby"),
      LobbyId: localStorage.getItem("selectedLobbyId")?.toString(),
      TableNo: orderData.table || localStorage.getItem("seletedTable") * 1,
      PaymentMethod: selectedItem,
      Price: selectedAmount,
      orderId: localStorage.getItem("orderId")?.toString(),
    };

    const resp = await api.patch("/makeDineInOrder", payload, {
      withCredentials: true,
    });

    localStorage.removeItem("seletedTable");
    localStorage.removeItem("seletedLobby");
    resetCart();
    resetApiCart();

    // printing code
    const printableData = `
      <html>
        <head>
          <style>
            body {margin: 0px;}
            .logo {width: 200px;}
            .header {display: flex; flex-direction: column; align-items: center;}
            h2 { font-size: 20px; font-weight: bold; margin-top: -10px; }
            h2 { font-size: 20px; font-weight: bold; }
            p { font-size: 16px; margin-top: 0px; margin-bottom: 0px; }
            .item-div {display: flex; justify-content: space-between;}
            .item-div p {min-width: 24px; max-width: 105px;text-align: left; font-size: 16px;}
            span {border-top-style: dotted; margin-top: 15px; display: block; display: flex; justify-content: end;}
            .bottom-text {display: flex; flex-direction: column; align-items: center; margin-top: 30px;}
            .main-data {
            display: flex;
            gap: 10px;
            text-align: left;
            }
            .left-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 80px;
              text-align: right;
            }
            .right-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 100px;
            }
            </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.png" class="logo"/>
          </div>
          <h2>Order Details</h2>
            <div class="main-data">
              <p class="left-side">Bölüm:</p>
              <p class="right-side">${resp.data.LobbyName}</p>
            </div>
            <div class="main-data">
              <p class="left-side">Masa:</p>
              <p class="right-side">${resp.data.TableNo}</p>
            </div>
            <div class="main-data">
              <p class="left-side">sipariş verildi:</p>
              <p class="right-side">${convertToReadable(
                resp.data.OrderItems[0].createdAt
              )}</p>
            </div>
          <h3>Items</h3>
          ${resp.data.OrderItems.flatMap((orderItem) =>
            orderItem.items.map(
              (item) =>
                `<div class="item-div"> <p>${item.Qty}</p><p style="margin-right:auto;">${item.Title}</p>  <p>${item.Price}</p></div>`
            )
          ).join("")}
            <span>Genel Toplam: ${resp.data.TotalPrice}</span>
            <div class="bottom-text">
              <p>^TEŞEKKÜRLER^</p>
              <p>* FİNANSAL DEĞERİ YOKTUR *</p>
            </div>
        </body>
      </html>
    `;

    const printOptions = {
      printable: printableData,
      type: "raw-html",
      silent: true,
    };

    printJS(printOptions);

    // const printWindow = window.open("", "_blank");
    // printWindow.document.open();
    // printWindow.document.write(printableData);
    // printWindow.document.close();

    // printWindow.onload = () => {
    //   printWindow.print();
    //   printWindow.close();
    //   silent: true;
    // };

    // printing code

    updateApiDoneStatus(!apiDone);
    updateModalStatus(false);
    updateCartStatus(false);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Receive Payment</h1>
        <p>
          {LobbyName} - {TableNo}
        </p>
        <span />
      </div>
      <div>
        <label className="mr-4 font-semibold">Total Bill</label>
        <input
          className="border px-2 py-1 rounded-md"
          type="number"
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(e.target.value)}
        />
      </div>
      <div>
        <label className="mr-4 font-semibold">Choose a payment method:</label>
        <select
          value={selectedItem}
          onChange={handleSelectChange}
          className="border px-2 py-1 rounded-md"
        >
          {resp
            ?.sort((a, b) => {
              if (a.title === "Cash") {
                return -1;
              } else if (b.title === "Cash") {
                return 1;
              } else {
                return a.title.localeCompare(b.title);
              }
            })
            .map((item) => (
              <option key={item._id} value={item.title}>
                {item.title}
              </option>
            ))}
        </select>
      </div>
      <button
        className={`w-[200px] items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
        onClick={() => {
          placeOrder();
        }}
      >
        Receive Payment
      </button>
    </div>
  );
};
