import { useState } from 'react';
import { CartItems2 } from './cartItems2';
import { useCtx } from '../context/Ctx';
import { useCartCtx } from '../context/CartCtx';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { MenuCategories } from '../pages/waiter/components/takeaway/Components/MenuCategories';
import { UpdatePlacedOrder } from '../pages/waiter/components/takeaway/Components/UpdatePlacedOrder';
import CancelTakeawayOrder from '../pages/waiter/components/orders/cancel-takeawayOrder';
import { TakeawayCartItem } from './TakeawayCartItem';
import { TakeawayCart2Items } from './takeawayCart2Items';
import { SendToDelivery } from '../pages/waiter/components/takeaway/Components/SendToDelivery';
import api from '../config/AxiosBase';

export function TakeawayCart() {
  const [customerNote, setCustomerNote] = useState('');
  const [cartSwitch, setCartSwitch] = useState(false);
  const {
    updateTakeawayCartStatus,
    takeawayCartStatus,
    itemsOfCart,
    apiItemsOfCart,
    orderData,
    resetCart,
    onClearCart,
    resetApiCart,
    onItemAddFromAPI,
  } = useCartCtx();
  const { updateModalStatus, updateApiDoneStatus, apiDone, modalStatus } =
    useCtx();

  const getSingleOrders = async (orderId) => {
    const resp = await api.get(`/getSingleTakeawayOrder/${orderId}`, {
      withCredentials: true,
    });

    const transformObj = {
      slug: resp?.data.data[0]._id,
      createdAt: resp?.data.data[0].createdAt,
      item: resp?.data.data[0].OrderItems,
      totalPrice: resp?.data.data[0].TotalPrice,
      customerCount: resp?.data.data[0].CustomerCount,
    };

    onItemAddFromAPI(transformObj);
    updateTakeawayCartStatus(true);
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
      items: newArray,
      customerNote,
      managerId: localStorage.getItem('managerId'),
      slug: apiItemsOfCart[0]?.slug,
    };

    const resp = await api.post('/makeTakeawayOrderPending', payload, {
      withCredentials: true,
    });

    setCustomerNote('');

    localStorage.setItem('orderId', resp?.data._id);
    onClearCart();
    getSingleOrders(resp?.data._id);
    updateApiDoneStatus(!apiDone);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains('card-shadow')) {
          updateTakeawayCartStatus(false);
        }
      }}
      className={`card-shadow transition-all duration-75 ease-in-outs ${
        takeawayCartStatus
          ? 'opacity-1 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } fixed h-full top-0 right-0 w-full flex justify-end bg-[rgba(0,0,0,0.5)]`}
    >
      <div
        className={`bg-white w-[30rem] flex flex-col overflow-hidden px-2 transition-all duration-75 ease-in-outs ${
          !takeawayCartStatus ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between py-4">
          {localStorage.getItem('SubRole') === 'Head Waiter' ? (
            apiItemsOfCart.length !== 0 ? (
              <button
                onClick={() => updateModalStatus(true, <CancelTakeawayOrder />)}
                disabled={apiItemsOfCart.length <= 0}
                className={`w-fit items-center justify-center rounded-md bg-red-500 hover:bg-red-700 px-2.5 py-2 text-base font-semibold leading-7 text-white`}
              >
                Cancel Order
              </button>
            ) : null
          ) : null}
          <p className="text-center font-semibold text-xl m-auto ">
            {apiItemsOfCart[0]?.CustomerName &&
              `${apiItemsOfCart[0]?.CustomerName} - ${apiItemsOfCart[0]?.PhoneNo}`}
          </p>
          <XMarkIcon
            onClick={() => {
              updateTakeawayCartStatus(false);
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
            <div className="flex justify-center gap-4">
              {modalStatus.status === false ? (
                <button
                  className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  onClick={() => {
                    updateModalStatus(true, <MenuCategories />);
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
            <div className="flex justify-center gap-4">
              {modalStatus.status === false ? (
                <div className="flex gap-3">
                  <button
                    className={`items-center justify-center rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                    onClick={() => {
                      updateModalStatus(true, <MenuCategories />);
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
              {localStorage.getItem('SubRole') === 'Head Waiter' ? (
                apiItemsOfCart[0]?.Status === 'Send to delivery' ? (
                  <button
                    onClick={() => {
                      updateModalStatus(
                        true,
                        <UpdatePlacedOrder
                          apiDone={apiDone}
                          TotalPriceOfCart={apiItemsOfCart[0]?.totalPrice}
                          itemsOfCart={itemsOfCart}
                          orderData={orderData}
                          resetCart={resetCart}
                          updateApiDoneStatus={updateApiDoneStatus}
                          updateModalStatus={updateModalStatus}
                          updateTakeawayCartStatus={updateTakeawayCartStatus}
                          resetApiCart={resetApiCart}
                        />
                      );
                    }}
                    disabled={apiItemsOfCart.length === 0}
                    className={`${
                      apiItemsOfCart.length === 0
                        ? 'bg-green-300 hover:bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-700'
                    } items-center justify-center rounded-md px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  >
                    Complete Order
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateModalStatus(
                        true,
                        <SendToDelivery
                          apiDone={apiDone}
                          TotalPriceOfCart={apiItemsOfCart[0]?.totalPrice}
                          itemsOfCart={itemsOfCart}
                          orderData={orderData}
                          resetCart={resetCart}
                          updateApiDoneStatus={updateApiDoneStatus}
                          updateModalStatus={updateModalStatus}
                          updateTakeawayCartStatus={updateTakeawayCartStatus}
                          resetApiCart={resetApiCart}
                        />
                      );
                    }}
                    disabled={apiItemsOfCart.length === 0}
                    className={`${
                      apiItemsOfCart.length === 0
                        ? 'bg-green-300 hover:bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-700'
                    } items-center justify-center rounded-md px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  >
                    Send to delivery
                  </button>
                )
              ) : null}
              {localStorage.getItem('SubRole') === 'Regular Waiter' ? (
                apiItemsOfCart[0]?.Status === 'Send to delivery' ? null : (
                  <button
                    onClick={() => {
                      updateModalStatus(
                        true,
                        <SendToDelivery
                          apiDone={apiDone}
                          TotalPriceOfCart={apiItemsOfCart[0]?.totalPrice}
                          itemsOfCart={itemsOfCart}
                          orderData={orderData}
                          resetCart={resetCart}
                          updateApiDoneStatus={updateApiDoneStatus}
                          updateModalStatus={updateModalStatus}
                          updateTakeawayCartStatus={updateTakeawayCartStatus}
                          resetApiCart={resetApiCart}
                        />
                      );
                    }}
                    disabled={apiItemsOfCart.length === 0}
                    className={`${
                      apiItemsOfCart.length === 0
                        ? 'bg-green-300 hover:bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-700'
                    } items-center justify-center rounded-md px-2.5 py-2 text-base font-semibold leading-7 text-white`}
                  >
                    Send to delivery
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
