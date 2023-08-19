import React, { useState, useEffect } from 'react';
import { useCartCtx } from '../../../../context/CartCtx';

export function ManagerOrderCards({ items }) {
  const { updateCartModalStatus, itemsOfCart, onItemAdd } = useCartCtx();
  const [currDate, setCurrDate] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  console.log({ items });

  return (
    <div className={`flex flex-wrap gap-2 overflow-x-hidden mt-4`}>
      {items && items.length !== 0 ? (
        items?.map((data) => (
          <div
            onClick={() => {
              updateCartModalStatus(true, {
                price: data.price,
                slug: data._id,
                title: data.title,
                date: Date.now(),
              });
            }}
            key={data._id}
            className={`cursor-pointer pb-0 w-[200px] h-[200px] rounded-lg overflow-hidden my-2 relative border border-[#F3F4F6] shadow-lg`}
          >
            <div className="w-full h-full">
              <img
                src={data.photo}
                alt="item img not working"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h1 className="p-2 text-white z-10 uppercase absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 truncate break-words text-base text-center font-semibold">
              {data.title}
            </h1>

            <div className="bg-[rgba(0,0,0,0.4)] absolute h-full w-full top-0 left-0 pointer-events-none" />
          </div>
        ))
      ) : (
        <p>No item found</p>
      )}
    </div>
  );
}
