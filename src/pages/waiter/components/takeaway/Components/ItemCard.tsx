import React from 'react';
import { useCartCtx } from '../../../../../context/CartCtx';

export default function ItemCard({ item }) {
  const { onItemAddFromAPI, updateTakeawayCartStatus } = useCartCtx();

  const transformObj = {
    slug: item?._id,
    createdAt: item?.createdAt,
    item: item?.OrderItems,
    totalPrice: item?.TotalPrice,
    customerCount: item?.CustomerCount,
    CustomerName: item?.CustomerName,
    PhoneNo: item?.PhoneNo,
    Address: item?.Address,
    Status: item?.Status,
  };

  const filterCondition = (filter1) => {
    if (filter1 === 'Pending') return 'bg-yellow-500';
    if (filter1 === 'Send to delivery') return 'bg-green-500';

    return 'bg-black';
  };

  return (
    <div
      className={`${filterCondition(
        item?.Status
      )} text-xs font-semibold px-4 py-2 w-28 h-28 rounded-md hover:scale-110 duration-200 cursor-pointer flex flex-col items-center justify-center text-white`}
      onClick={() => {
        onItemAddFromAPI(transformObj);
        updateTakeawayCartStatus(true);
        localStorage.setItem('orderId', item._id);
      }}
    >
      <p>{item?.TotalPrice} TL</p>
    </div>
  );
}
