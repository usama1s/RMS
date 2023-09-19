import React, { useEffect, useState } from 'react';
import BarChart from '../../../../../components/BarChart';
import api from '../../../../../config/AxiosBase';

const ItemPriceChart = ({ type, id }) => {
  const [configLabels, setConfigLabels] = useState();
  const [configData, setConfigData] = useState();

  const getItemState = async () => {
    const resp = await api.get(`getSoldItemsPrice/${type}/${id}`, {
      withCredentials: 'true',
    });

    if (resp) {
      const sortedQuantities = resp.data.quantities.sort(
        (a, b) => a.price - b.price
      );
      const labels = sortedQuantities.map((data) => data.price);
      const data = sortedQuantities.map((data) => data._id);
      setConfigLabels(labels);
      setConfigData(data);
    }
  };

  useEffect(() => {
    getItemState();
  }, [id, type]);

  const chartDummyData = {
    labels: configData,
    datasets: [
      {
        label: 'Specific Item Sale',
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

export default ItemPriceChart;
