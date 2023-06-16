import React, { useState } from "react";
import { CartItems } from "./cartItems";
import { CartItems2 } from "./cartItems2";
import { useCtx } from "../context/Ctx";
import { useCartCtx } from "../context/CartCtx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { WaiterOrder } from "../pages/waiter/components/orders";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Cart2Items } from "./cart2Items";
import api from "../config/AxiosBase";

export function Cart({ title }) {
  const {
    updatePaymentMethod,
    updateCartStatus,
    cartStatus,
    itemsOfCart,
    apiItemsOfCart,
    cartTotalPrice,
    TotalPriceOfCart,
    orderData,
    resetCart,
    onItemAddFromAPI,
    onClearCart,
    resetApiCart,
  } = useCartCtx();
  const {
    updateModalStatus,
    activeWaiterTab,
    updateApiDoneStatus,
    apiDone,
    modalStatus,
  } = useCtx();

  const [showTooltip, setShowTooltip] = useState(false);
  const [cartSwitch, setCartSwitch] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTooltipMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setShowTooltip(false);
  };

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

  const cancelOrderHandler = async () => {
    const payload = {
      LobbyName: apiItemsOfCart[0]?.lobby,
      TableNo: apiItemsOfCart[0]?.tableNo,
    };

    console.log({ payload });
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
      TableNo: localStorage.getItem("seletedTable") * 1,
      items: newArray,
      slug: apiItemsOfCart[0]?.slug,
    };

    const resp = await api.post("/makeDineInOrderPending", payload, {
      withCredentials: true,
    });

    localStorage.setItem("orderId", resp?.data._id);
    onClearCart();
    updateApiDoneStatus(!apiDone);
  };

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
          {apiItemsOfCart.length !== 0 ? (
            <button
              onClick={() => {
                cancelOrderHandler();
              }}
              disabled={apiItemsOfCart.length <= 0}
              className={`w-fit items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
            >
              Cancel Order
            </button>
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
                <button
                  className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  onClick={() => {
                    updateModalStatus(true, <UpdateStatusJSX />);
                  }}
                >
                  <PlusCircleIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:scale-110 duration-200" />
                </button>
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
            {apiItemsOfCart.length >= 1 ? (
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
                <button
                  className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  onClick={() => {
                    updateModalStatus(true, <UpdateStatusJSX />);
                  }}
                >
                  <PlusCircleIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:scale-110 duration-200" />
                </button>
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
          className="items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white w-fit"
          onClick={() => {
            setCartSwitch(!cartSwitch);
          }}
        >
          Detailed Cart
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
                disabled={itemsOfCart.length <= 0 && apiItemsOfCart.length <= 0}
                className="items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Close Order
              </button>
              {showTooltip && (
                <div
                  className="absolute -top-10 -left-[6rem] p-2 bg-gray-800 text-white text-sm rounded-md shadow-md"
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  Clear items from the cart
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
    const resp = await api.get("/getPaymentMethods", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setResp(resp.data.data.doc);
    setLoading(false);
  };

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const placeOrder = async () => {
    const payload = {
      LobbyName: orderData.lobby || localStorage.getItem("seletedLobby"),
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
    updateApiDoneStatus(!apiDone);
    updateModalStatus(false);
    updateCartStatus(false);
  };

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
