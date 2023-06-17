import { useState, useEffect } from "react";
import api from "../../../../config/AxiosBase";

export const PendingTakeawayOrders = () => {
  const [resp, setResp] = useState();

  const getTakeAwayPendingOrders = async () => {
    const resp = await api.get("/getTakeawayPendingOrders", {
      withCredentials: true,
    });
    setResp(resp.data.data);
  };

  useEffect(() => {
    getTakeAwayPendingOrders();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">Pending Takeaway Orders</h1>
      <div className="my-4">
        {resp?.map((item) => (
          <div key={item._id} className="w-40 flex flex-col gap-2">
            <div className="flex items-start p-4 rounded-xl shadow-lg bg-gray-300">
              <div>
                <h2 className="font-semibold">{item.Title}</h2>
                <div className="flex gap-4">
                  <p className="mt-2 text-sm text-gray-700 font-semibold">
                    Qty: {item.Qty}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 font-semibold">
                    Price: {item.Price}
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-black">
                  Total Price: {item.TotalPrice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default PendingTakeawayOrders;
