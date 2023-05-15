import React from "react";
import { Loading } from "../../../../components/loading";
import { useCartCtx } from "../../../../context/CartCtx";
export function ManagerOrderCards({ items }) {
  const { updateCartModalStatus, itemsOfCart, onItemAdd } = useCartCtx();
  if (items.loading)
    return (
      <div className="h-[40vh] flex items-center justify-center">
        <Loading></Loading>
      </div>
    );
  return (
    <div className={`flex flex-wrap gap-2 overflow-x-hidden mt-4`}>
      {items.error && <h2 className="font-semibold text-xl">{items.error}</h2>}
      {items.data &&
        items.data?.map((data) => (
          <div
            onClick={() => {
              updateCartModalStatus(true, data);
            }}
            key={data.slug}
            className={`cursor-pointer pb-0 w-[200px] h-[200px] rounded-lg overflow-hidden my-2 relative border-[1px] border-[#F3F4F6] shadow-lg`}
          >
            <div className="w-full h-full">
              <img
                src={data.imageURL}
                alt={data.imageURL}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h1 className="p-2 text-white z-10 uppercase absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 truncate break-words text-base text-center font-semibold">
              {data.title}
            </h1>

            <div className="bg-[rgba(0,0,0,0.4)] absolute h-full w-full top-0 left-0 pointer-events-none" />
          </div>
        ))}
    </div>
  );
}
