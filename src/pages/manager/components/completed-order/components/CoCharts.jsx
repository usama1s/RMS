import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import api from "../../../../../config/AxiosBase";

const CoCharts = ({ id }) => {
  const [configLabels, setConfigLabels] = useState();
  const [configData, setConfigData] = useState();

  const getItemState = async () => {
    const resp = await api.get(`getSoldItemsQTY/${id}`, {
      withCredentials: "true",
    });

    if (resp) {
      const sortedQuantities = resp.data.quantities.sort(
        (a, b) => a.quantity - b.quantity
      );
      const labels = sortedQuantities.map((data) => data.quantity);
      const data = sortedQuantities.map((data) => data._id);
      setConfigLabels(labels);
      setConfigData(data);
    }
  };

  useEffect(() => {
    getItemState();
  }, [id]);

  const chartDummyData = {
    labels: configData,
    datasets: [
      {
        label: "Quantity",
        data: configLabels,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-4">
      <div className="w-[400px]">
        <LineChart chartData={chartDummyData} />
      </div>
    </div>
  );
};

export default CoCharts;
