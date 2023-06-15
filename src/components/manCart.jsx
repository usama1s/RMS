import React, { useState } from "react";
import { CartItems } from "./cartItems";
import { CartItems2 } from "./cartItems2";
import { useCartCtx } from "../context/CartCtx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Cart2Items } from "./cart2Items";

export function ManCart({ title }) {
  const {
    updateCartStatus,
    cartStatus,
    itemsOfCart,
    apiItemsOfCart,
    orderData,
    onClearCart,
  } = useCartCtx();

  const [cartSwitch, setCartSwitch] = useState(false);

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
            {apiItemsOfCart.length >= 1 ? (
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
          </div>
        ) : (
          <div className="h-[90vh] overflow-y-scroll customScrollbar pr-2 ">
            <div className="flex justify-end gap-4 font-semibold">
              <span className="font-semibold bg-blue-400 text-white py-1 px-2 rounded-md">
                TRY
              </span>
            </div>
            {apiItemsOfCart.length >= 1 &&
            apiItemsOfCart[0].lobby === orderData.lobby &&
            apiItemsOfCart[0].tableNo === orderData.table ? (
              <Cart2Items data={apiItemsOfCart} />
            ) : null}
            {apiItemsOfCart.length !== 0 && <hr className="my-5" />}
            {itemsOfCart.length >= 1
              ? itemsOfCart.map((itemData) => (
                  <div>
                    <CartItems2 key={itemData.slug} {...itemData} />
                  </div>
                ))
              : null}
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
        </div>
      </div>
    </div>
  );
}
