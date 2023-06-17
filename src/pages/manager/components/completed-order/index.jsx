import React, { useState, useEffect } from "react";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";
import DataTable from "react-data-table-component";
import CoCharts from "./components/CoCharts";
import CoStats from "./components/CoStats";
import ItemPriceChart from "./components/ItemPriceChart";

export const CompletedOrder = () => {
  const { apiDone } = useCtx();
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();
  const [clockingData, setClockingData] = useState();
  const [selectedClocking, setSelectedClocking] = useState("all");

  const getClockingsData = async () => {
    const resp = await api.get("/getAllClockings", {
      withCredentials: true,
    });
    setClockingData(resp.data.data);
  };

  const getOrderByClockingsData = async () => {
    const resp = await api.get(`/getOrderByClocking/${selectedClocking}`, {
      withCredentials: true,
    });
    setFormattedData(resp.data.data);
  };

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  const column = [
    {
      name: "Testing ID",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Date and Time",
      selector: (row) => convertTimestamp(row.createdAt),
      sortable: true,
    },
    {
      name: "Total Price",
      selector: (row) => row.TotalPrice,
      sortable: true,
    },
    {
      name: "PaymentMethod",
      selector: (row) => row.PaymentMethod,
      sortable: true,
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div className="bg-gray-200 rounded-lg shadow-md p-4 my-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Order Detail</h1>
      <div className="flex gap-8 font-semibold text-sm">
        <p className="w-[100px]">Lobby Name</p>
        <p className="text-gray-600 mb-2 ">{data.LobbyName}</p>
      </div>
      <div className="flex gap-8 font-semibold text-sm">
        <p className="w-[100px]">Table No.</p>
        <p className="text-gray-600 mb-2 ">{data.TableNo}</p>
      </div>
      <div className="flex gap-8 font-semibold text-sm">
        <p className="w-[100px]">Order Type</p>
        <p className="text-gray-600 mb-2 ">{data.Type}</p>
      </div>

      {data.OrderItems.map((i, index) => (
        <div key={index} className="mb-4">
          <p className="text-gray-600 text-right text-sm font-semibold italic">
            {convertTimestamp(i.createdAt)}
          </p>
          {i.items.map((j, jIndex) => (
            <div
              key={jIndex}
              className="flex justify-between items-center mb-2 text-sm"
            >
              <p className="w-[130px]">{j.Title}</p>
              <p className="text-gray-600 ml-2 ">Qty: {j.Qty}</p>
              <p className="text-gray-600 ml-2">Price: {j.Price}</p>
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-8 font-semibold text-sm">
        <p>Payment Method</p>
        <p className="text-gray-600 mb-2 ">{data.PaymentMethod}</p>
      </div>
      <div className="flex gap-8 font-semibold text-sm">
        <p>Total Price</p>
        <p className="text-gray-600 mb-2 ">{data.TotalPrice}</p>
      </div>
      <div className="flex gap-8 font-semibold text-sm">
        <p>Order Status</p>
        <p className="text-gray-600 mb-2 ">{data.Status}</p>
      </div>
    </div>
  );

  useEffect(() => {
    getOrderByClockingsData();
    getClockingsData();
  }, [apiDone]);

  useEffect(() => {
    getOrderByClockingsData();
  }, [selectedClocking]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Completed Orders</h1>
      <div className="flex justify-end">
        <select
          onChange={(e) => setSelectedClocking(e.target.value)}
          className="bg-gray-900 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1"
        >
          <option value="all">All</option>
          {clockingData &&
            clockingData?.map((item, index) => (
              <option key={index + 1} value={item?.startDateTime}>
                {convertTimestamp(item?.startDateTime)}
              </option>
            ))}
        </select>
      </div>
      <CoStats id={selectedClocking} />
      <div className="flex">
        <CoCharts id={selectedClocking} />
        <ItemPriceChart id={selectedClocking} />
      </div>
      <DataTable
        columns={column}
        data={formattedData
          ?.filter((item) => item.Status === "PaymentDone")
          .sort((a, b) => a.createdAt - b.createdAt)}
        pagination
        fixedHeader
        highlightOnHover
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        loading={loading}
      />
    </div>
  );
};
