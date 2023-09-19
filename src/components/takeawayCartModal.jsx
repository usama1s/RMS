import React, { useState } from 'react';
import { useCartCtx } from '../context/CartCtx';
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

export function TakeawayCartModal() {
  const {
    updateTakeawayCartModalStatus,
    updateTakeawayCartStatus,
    onItemAdd,
    takeawayCartModalStatus,
  } = useCartCtx();
  const [qty, setQty] = useState(1);
  const add = (value) => () => {
    if (qty + value <= 0) {
      setQty(1);
      return;
    }
    setQty((prev) => prev + value);
  };
  const addItemToCart = () => {
    const { title, price, slug, date } = takeawayCartModalStatus.value;
    onItemAdd({ title, price, slug, qty, date });
    updateTakeawayCartModalStatus(false, null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains('cart-modal-shadow')) {
          updateTakeawayCartModalStatus(false, null);
        }
      }}
      className="z-10 cart-modal-shadow bg-[rgba(0,0,0,0.5)] flex items-center justify-center fixed top-0 left-0 w-full h-full"
    >
      <div className="rounded-md bg-white w-80 flex flex-col p-1">
        <div className="p-2">
          <div className="w-fit float-right ml-auto">
            <XMarkIcon
              className="h-8 w-8 cursor-pointer"
              onClick={() => updateTakeawayCartModalStatus(false, null)}
            />
          </div>
          <h2 className="text-lg font-bold">
            {takeawayCartModalStatus.value.title}
          </h2>
        </div>
        <div className="flex items-center py-2 gap-2 justify-center">
          <MinusCircleIcon
            onClick={add(-1)}
            className="w-8 h-8 text-gray-900/100 cursor-pointer"
          />
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-16 h-8 text-center border rounded hide-arrows"
          />
          <PlusCircleIcon
            onClick={add(+1)}
            className="w-8 h-8 text-gray-900/100 cursor-pointer"
          />
        </div>
        <button
          onClick={() => {
            addItemToCart();
            updateTakeawayCartStatus(true);
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
