import React, { useEffect, useState } from 'react';
import api from '../../../../../config/AxiosBase';

const NetPriceStats = ({ id }) => {
  const [netPrice, setNetPrice] = useState();

  const getNetPriceStats = async () => {
    const resp = await api.get(`/getNetPrice/${id}`, {
      withCredentials: true,
    });
    setNetPrice(resp.data);
  };

  useEffect(() => {
    getNetPriceStats();
  }, [id]);

  return (
    <section className="text-gray-100 my-4 mx-6">
      <h4 className="text-gray-900 font-semibold mb-0">Net Sales Statistics</h4>
      <div className="flex justify-between p-4 space-x-4 rounded-lg md:space-x-6 bg-gray-900 text-gray-100 col-span-1">
        <div className="flex gap-10">
          {netPrice?.netAmounts?.map((item, index) => (
            <div key={index + 1} className="flex gap-4">
              <p>{item._id}</p>
              <p className="flex justify-center px-2 align-middle rounded-lg bg-teal-400 group-hover:scale-105 duration-200 text-gray-900 font-semibold">
                {item.netAmount} TL
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <p>Net Price</p>
          <span className="flex justify-center px-2 align-middle rounded-lg bg-teal-400 group-hover:scale-105 duration-200 text-gray-900 font-semibold">
            {netPrice?.netTotal} TL
          </span>
        </div>
      </div>
    </section>
  );
};

export default NetPriceStats;
