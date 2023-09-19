import { useState } from 'react';
import { CartItems2 } from './cartItems2';
import { useCartCtx } from '../context/CartCtx';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { TakeawayCartItem } from './TakeawayCartItem';
import { TakeawayCart2Items } from './takeawayCart2Items';

export function ManagerTakeawayCart() {
  const [customerNote, setCustomerNote] = useState('');
  const [cartSwitch, setCartSwitch] = useState(false);
  const {
    itemsOfCart,
    apiItemsOfCart,
    onClearCart,
    resetApiCart,
    manTakeawayCartStatus,
    updateManTakeawayCartStatus,
  } = useCartCtx();

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains('card-shadow')) {
          updateManTakeawayCartStatus(false);
        }
      }}
      className={`card-shadow transition-all duration-75 ease-in-outs ${
        manTakeawayCartStatus
          ? 'opacity-1 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } fixed h-full top-0 right-0 w-full flex justify-end bg-[rgba(0,0,0,0.5)]`}
    >
      <div
        className={`bg-white w-[30rem] flex flex-col overflow-hidden px-2 transition-all duration-75 ease-in-outs ${
          !manTakeawayCartStatus ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between py-4">
          <p className="text-center font-semibold text-xl m-auto ">
            {apiItemsOfCart[0]?.CustomerName &&
              `${apiItemsOfCart[0]?.CustomerName} - ${apiItemsOfCart[0]?.PhoneNo}`}
          </p>
          <XMarkIcon
            onClick={() => {
              updateManTakeawayCartStatus(false);
              onClearCart();
              resetApiCart();
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
              <TakeawayCartItem data={apiItemsOfCart} />
            ) : null}
            {apiItemsOfCart.length !== 0 && <hr className="my-5" />}
            {itemsOfCart.length >= 1
              ? itemsOfCart.map((itemData) => (
                  <TakeawayCart2Items key={itemData.slug} {...itemData} />
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
            {apiItemsOfCart && apiItemsOfCart.length >= 1 ? (
              <TakeawayCart2Items data={apiItemsOfCart} />
            ) : null}
            {apiItemsOfCart.length !== 0 && <hr className="my-5" />}
            {itemsOfCart.length >= 1
              ? itemsOfCart.map((itemData) => (
                  <CartItems2 key={itemData.slug} {...itemData} />
                ))
              : null}
            {itemsOfCart.length >= 1 && (
              <textarea
                id="message"
                rows="4"
                className="mb-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write customer note if there is any..."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
              />
            )}
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
        </div>
      </div>
    </div>
  );
}
