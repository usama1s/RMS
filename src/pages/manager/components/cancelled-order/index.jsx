import React, { useState, useEffect } from "react";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export const CancelledOrder = () => {
  const { updateModalStatus, apiDone } = useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();

  const getCompletedOrders = async () => {
    setLoading(true);
    const resp = await api.get("/getAllOrders", {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
    setLoading(false);
  };

  useEffect(() => {
    getCompletedOrders();
  }, [apiDone]);

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Cancelled Orders</h1>
      <div className="relative overflow-x-auto mt-4">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                No.
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Date and Time
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                PaymentMethod
              </th>
            </tr>
          </thead>
          <tbody>
            {formattedData
              ?.filter((item) => item.Status === "cancelled")
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((item, index) => (
                <tr key={index + 1} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item?.Title}</td>
                  <td className="px-6 py-4">
                    {convertTimestamp(item?.createdAt)}
                  </td>
                  <td className="px-6 py-4">{item?.TotalPrice}</td>
                  <td className="px-6 py-4">{item?.PaymentMethod}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
