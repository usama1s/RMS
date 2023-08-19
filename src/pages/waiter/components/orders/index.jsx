import React, { useState, useEffect } from 'react';
import { ManagerOrderCards } from './cards';
import { Loading } from '../../../../components/loading';
import { useCtx } from '../../../../context/Ctx';
import api from '../../../../config/AxiosBase';

export function WaiterOrder() {
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();
  const [items, setItems] = useState();
  const [active, setActive] = useState('');
  const { apiDone } = useCtx;
  const [categoryError, setCategoryError] = useState('');

  const getCategories = async () => {
    try {
      setLoading(true);
      const resp = await api.get(
        `/getAllCategories/${localStorage.getItem('managerId')}`,
        { withCredentials: true }
      );

      setFormattedData(resp.data.data);
      setActive(resp.data.data[0]?._id);

      setLoading(false);
    } catch (err) {
      setCategoryError(err.response.data.message);
      setLoading(false);
    }
  };

  const getItemByCategory = async () => {
    try {
      const resp = await api.get('/getItemsById/' + active, {
        withCredentials: true,
      });

      setItems(resp.data.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  useEffect(() => {
    getItemByCategory();
  }, [active]);

  useEffect(() => {
    getItemByCategory();
  }, []);

  if (formattedData?.length < 1) {
    return formattedData?.length < 1 ? (
      <h1 className="font-semibold text-xl">
        No Categories. Add Categories to proceed.
      </h1>
    ) : (
      <h1 className="font-semibold text-xl">Error fetching categories..</h1>
    );
  }

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full flex flex-wrap gap-4 mt-4">
        {formattedData ? (
          formattedData?.map((item, index) => (
            <div
              key={index + 1}
              onClick={() => setActive(item?._id)}
              className={`cursor-pointer
          ${
            item._id === active
              ? 'bg-gray-900 text-white'
              : 'bg-[#F3F4F6] text-gray-900'
          } rounded-full w-40 h-5 p-5 flex items-center justify-center`}
            >
              <p>{item.categoryName}</p>
            </div>
          ))
        ) : (
          <p>{categoryError}</p>
        )}
      </div>

      <ManagerOrderCards items={items} />
    </>
  );
}
