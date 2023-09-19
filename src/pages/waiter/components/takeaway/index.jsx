import { useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { MenuCategories } from './Components/MenuCategories';
import { useCtx } from '../../../../context/Ctx';
import api from '../../../../config/AxiosBase';
import ItemCard from './Components/ItemCard';

export function TakeAway() {
  const { updateModalStatus, apiDone } = useCtx();
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

  return (
    <>
      <div className="flex justify-between py-4">
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
        <button
          onClick={() => {
            updateModalStatus(true, <MenuCategories />);
          }}
          className="inline-flex gap-2 items-center justify-center rounded-md bg-gray-800 hover:bg-gray-950 px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          <PlusCircleIcon className="h-6 w-6 cursor-pointer hover:scale-110 duration-200" />{' '}
          Make Order
        </button>
      </div>

      <div className="flex gap-6 flex-wrap mt-4">
        {data?.map((i) => (
          <ItemCard item={i} key={i._id} />
        ))}
      </div>
    </>
  );
}
