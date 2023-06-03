import React, { useState, useEffect } from "react";
import { CartItems } from "./cartItems";
import { CartItems2 } from "./cartItems2";
import { useCtx } from "../context/Ctx";
import { useCartCtx } from "../context/CartCtx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { WaiterOrder } from "../pages/waiter/components/orders";
// import { PlaceOrderTakeaway } from "../pages/waiter/components/takeaway/placeorder";
// import { PlaceOrderDinein } from "../pages/waiter/components/dinein/placeorder";
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
  } = useCartCtx();
  const { updateModalStatus, activeWaiterTab, updateApiDoneStatus, apiDone } =
    useCtx();

  // const [paymentMethod, setPaymentMethod] = useState("");

  // const placeOrder = async () => {
  //   const payload = {
  //     LobbyName: orderData.lobby,
  //     TableNo: orderData.table,
  //     Qty: itemsOfCart[0].qty,
  //     PaymentMethod: paymentMethod,
  //     Price: itemsOfCart[0].price,
  //     Title: itemsOfCart[0].title,
  //   };

  //   if (activeWaiterTab === "Take away") {
  //     const resp = await api.post("/makeTakeAwayOrder", payload, {
  //       withCredentials: true,
  //     });
  //     console.log(resp);
  //   } else {
  //     const resp = await api.post("/makeDineInOrder", payload, {
  //       withCredentials: true,
  //     });
  //     console.log(resp);
  //   }

  //   resetCart();
  // };

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

    if (resp) {
      alert("order cancelled");
    }

    updateApiDoneStatus(!apiDone);
  };

  const makeOrderPending = async () => {
    const payload = {
      LobbyName: orderData.lobby,
      TableNo: orderData.table,
      Qty: itemsOfCart[0].qty,
      PaymentMethod: selectedItem,
      Price: selectedAmount,
      Title: itemsOfCart[0].title,
    };

    const resp = await api.post("/makeDineInOrder", payload, {
      withCredentials: true,
    });
    alert("order placed");

    resetCart();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains("card-shadow")) {
          updateCartStatus(false);
        }
      }}
      className={`card-shadow z-[1000] transition-all duration-75 ease-in-outs ${
        cartStatus
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } fixed h-full top-0 right-0 w-full flex justify-end bg-[rgba(0,0,0,0.5)]`}
    >
      <div
        className={`bg-white w-[30rem] flex flex-col overflow-hidden px-2 transition-all duration-75 ease-in-outs ${
          !cartStatus ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold leading-2 ">{title}</h1>
          <XMarkIcon
            onClick={() => updateCartStatus(false)}
            className="h-6 w-6 cursor-pointer"
          />
        </div>
        <div className="h-[90vh] overflow-y-scroll pr-2 ">
          <span className="flex justify-end">
            {apiItemsOfCart.length !== 0 &&
              convertToReadable(apiItemsOfCart[0]?.createdAt)}
          </span>
          {apiItemsOfCart.length >= 1
            ? apiItemsOfCart.map((itemData) => (
                <CartItems key={itemData.slug} {...itemData} />
              ))
            : null}
          {apiItemsOfCart.length !== 0 && <hr className="my-8" />}
          {itemsOfCart.length >= 1
            ? itemsOfCart.map((itemData) => (
                <div>
                  <p>{convertToReadable(itemData.date)}</p>
                  <CartItems2 key={itemData.slug} {...itemData} />
                </div>
              ))
            : null}
          <hr className="my-4" />
          <div className="flex gap-4">
            <button
              className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
              onClick={() => {
                updateModalStatus(true, <UpdateStatusJSX />);
              }}
            >
              Add More Items
            </button>
            {itemsOfCart.length !== 0 && (
              <button
                className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                onClick={() => {
                  updateModalStatus(true, <UpdateStatusJSX />);
                }}
              >
                Make Order
              </button>
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-4 px-2 m-1">
          <button
            className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
            onClick={() => {
              updateModalStatus(true, <UpdateStatusJSX />);
            }}
          >
            Add More Items
          </button>
        </div> */}
        <div className="flex items-center justify-between px-2 m-1">
          <h1 className="text-base font-regular">
            Total:
            <span className="text-gray-900 ml-1 font-bold">
              TRY {TotalPriceOfCart}
            </span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                updateModalStatus(
                  true,
                  <PlaceOrderJSX
                    apiDone={apiDone}
                    TotalPriceOfCart={TotalPriceOfCart}
                    itemsOfCart={itemsOfCart}
                    orderData={orderData}
                    resetCart={resetCart}
                  />
                );
              }}
              disabled={itemsOfCart.length <= 0}
              className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
            >
              Complete Order
            </button>
            {apiItemsOfCart.length !== 0 ? (
              <button
                onClick={() => {
                  cancelOrderHandler();
                }}
                disabled={apiItemsOfCart.length <= 0}
                className={`items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
              >
                Cancel Order
              </button>
            ) : (
              ""
            )}
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
}) => {
  const [resp, setResp] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(TotalPriceOfCart);

  const getPaymentMethods = async () => {
    setLoading(true);
    const resp = await api.get("/getPaymentMethods", { withCredentials: true });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setResp(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getPaymentMethods();
  }, [apiDone]);

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const placeOrder = async () => {
    const payload = {
      LobbyName: orderData.lobby,
      TableNo: orderData.table,
      Qty: itemsOfCart[0].qty,
      PaymentMethod: selectedItem,
      Price: selectedAmount,
      Title: itemsOfCart[0].title,
    };

    const resp = await api.post("/makeDineInOrder", payload, {
      withCredentials: true,
    });
    alert("order placed");

    resetCart();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Place Order</h1>
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
          {resp?.map((item) => (
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
        Place order
      </button>
    </div>
  );
};
