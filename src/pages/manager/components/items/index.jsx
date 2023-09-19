import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useCtx } from '../../../../context/Ctx';
import { ManagerAddItem } from './add-items';
import { Loading } from '../../../../components/loading';
import { ManagerAddCategories } from '../categories/add-categories';
import ItemPage from './components/ItemPage';
import api from '../../../../config/AxiosBase';

export function ManagerItems() {
  const { updateModalStatus, apiDone } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const resp = await api.get('/getItems', {
        withCredentials: true,
      });

      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
      setFormattedData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [apiDone]);

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <div className="flex gap-4">
          <button
            onClick={() => updateModalStatus(true, <ManagerAddCategories />)}
            className="cursor-pointer flex items-center gap-2 text-sm font-semibold bg-gray-800 text-white px-2 py-1 rounded-md"
          >
            Category
            <PlusIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => updateModalStatus(true, <ManagerAddItem />)}
            className="cursor-pointer flex items-center gap-2 text-sm font-semibold bg-gray-800 text-white px-2 py-1 rounded-md"
          >
            Item
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <ItemPage />
      <div className="text-2xl flex flex-col gap-2">
        {!formattedData && error && (
          <div>
            <h1 className="font-bold text-xl">
              No Menu items right now. Add menu items to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
