import React, { useEffect, useState } from 'react';

export const TakeawayCart2Items = (props) => {
  const [combinedData, setCombinedData] = useState();
  const { data } = props;

  useEffect(() => {
    const combinedItems = data[0].item.reduce((acc, curr) => {
      curr.items.forEach((item) => {
        const existingItemIndex = acc.findIndex(
          (combined) => combined.Title === item.Title
        );
        if (existingItemIndex !== -1) {
          acc[existingItemIndex].Qty += item.Qty;
          acc[existingItemIndex].Price;
        } else {
          acc.push({ ...item });
        }
      });
      return acc;
    }, []);

    setCombinedData({
      ...data[0],
      item: combinedItems,
    });
  }, [data]);

  return (
    <div>
      {combinedData?.item.map((item, index) => (
        <div key={index + 1}>
          <div className="flex justify-between p-1">
            <div className="w-full flex items-center justify-between gap-2">
              <h2 className="truncate break-words pb-1 text-md font-bold">
                {item.Title}
              </h2>
              <p className="truncate break-words text-base">
                {item.Price} x {item.Qty} = {item.Price * item.Qty}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
