import React, { useEffect, useState } from 'react';
import api from '../../../../../config/AxiosBase';
import BarChart from '../../../../../components/BarChart';

const ItemSoldByTime = ({ type, id }) => {
  const [configLabels, setConfigLabels] = useState();
  const [configData, setConfigData] = useState();

  const getItemState = async () => {
    const resp = await api.get(`getSoldItemsPriceByClocking/${type}/${id}`, {
      withCredentials: 'true',
    });

    if (resp) {
      const sortedQuantities = resp.data.quantities.sort(
        (a, b) => a._id - b._id
      );
      const labels = sortedQuantities.map((data) => data._id);
      const data = sortedQuantities.map((data) => data.totalPrice);
      setConfigLabels(data);
      setConfigData(labels);
    }
  };

  useEffect(() => {
    getItemState();
  }, [type, id]);

  const chartDummyData = {
    labels: configData,
    datasets: [
      {
        label: 'Item Sold By Time',
        data: configLabels,
        backgroundColor: [
          'rgba(75,192,192,1)',
          '#ecf0f1',
          '#50AF95',
          '#f3ba2f',
          '#2a71d0',
        ],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-4 w-[300px] 2xl:w-[400px]">
      <BarChart chartData={chartDummyData} />
    </div>
  );
};

export default ItemSoldByTime;
