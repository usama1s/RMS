import { useEffect, useState } from 'react';
import { useCtx } from '../../../../../context/Ctx';
import { useCartCtx } from '../../../../../context/CartCtx';
import api from '../../../../../config/AxiosBase';

export default function TakeawayOrders() {
  const { apiDone } = useCtx();
  const { updateManTakeawayCartStatus, onItemAddFromAPI } = useCartCtx();
  const [data, setData] = useState();

  const getTakeawayOrders = async () => {
    try {
      const resp = await api.get(
        `/getTakeawayOrders/${localStorage.getItem('managerId')}`,
        {
          withCredentials: true,
        }
      );
      setData(resp.data.data);
    } catch (err) {
      console.log(err.resp.data.message);
    }
  };

  useEffect(() => {
    getTakeawayOrders();
  }, [apiDone]);

  const filterCondition = (filter1) => {
    if (filter1 === 'Pending') return 'bg-yellow-500';
    if (filter1 === 'Send to delivery') return 'bg-green-500';

    return 'bg-black';
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div>
        <div className="flex gap-2 items-center">
          <p className="h-5 w-5 bg-yellow-500 rounded-full"></p>
          <p>Pending</p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="h-5 w-5 bg-green-500 rounded-full"></p>
          <p>Send to delivery</p>
        </div>
      </div>
      <div className="flex gap-6 flex-wrap ">
        {data?.map((i) => (
          <div
            key={i._id}
            className={`${filterCondition(
              i?.Status
            )} text-xs font-semibold px-4 py-2 w-28 h-28 rounded-md hover:scale-110 duration-200 cursor-pointer flex flex-col items-center justify-center text-white`}
            onClick={() => {
              updateManTakeawayCartStatus(true);
              onItemAddFromAPI({
                slug: i?._id,
                createdAt: i?.createdAt,
                item: i?.OrderItems,
                totalPrice: i?.TotalPrice,
                customerCount: i?.CustomerCount,
                CustomerName: i?.CustomerName,
                PhoneNo: i?.PhoneNo,
                Address: i?.Address,
                Status: i?.Status,
              });
              localStorage.setItem('orderId', i._id);
            }}
          >
            <p>{i?.TotalPrice} TL</p>
          </div>
        ))}
      </div>
    </div>
  );
}
