import React, { useState, useEffect } from "react";
import api from "../../../../config/AxiosBase";
import { useCtx } from "../../../../context/Ctx";

const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formattedData, setFormattedData] = useState(false);
  const [ordersList, setOrdersList] = useState();
  const [active, setActive] = useState("");
  const { apiDone } = useCtx;

  const getLobbies = async () => {
    setIsLoading(true);
    const resp = await api.get("/getLobbies", {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }
    console.log("resp ", resp);
    setFormattedData(resp.data.data.doc);
    setIsLoading(false);
  };

  const getOrders = async () => {
    const resp = await api.get("/getAllOrders", {
      withCredentials: true,
    });
    console.log("resp ", resp);
    setOrdersList(resp.data.data.doc);
  };

  console.log(ordersList);

  useEffect(() => {
    getLobbies();
    getOrders();
  }, [apiDone]);

  console.log(formattedData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something goes wrong.</p>;

  const handleSelectChange = (event) => {
    setActive(event.target.value);
  };

  function filterByLobby(lobbyName) {
    return ordersList.filter((obj) => obj.LobbyName === lobbyName);
  }

  return (
    <div>
      <div className="w-full flex flex-wrap gap-4 mt-4">
        <select
          onChange={handleSelectChange}
          className="cursor-pointer rounded-full w-40 p-5 bg-[#F3F4F6] text-gray-900"
        >
          <option value="" disabled selected>
            Select Lobby
          </option>
          {formattedData &&
            formattedData.map((item) => (
              <option
                key={item._id}
                value={item.lobbyName}
                className="active:bg-gray-900"
              >
                {item.lobbyName}
              </option>
            ))}
        </select>
      </div>

      <div className="mt-4 flex gap-4 text-white">
        {ordersList &&
          filterByLobby(active)?.map((item, index) => (
            <p
              key={index + 1}
              className={`${
                item?.Status === "Pending" ? "bg-gray-400" : "bg-blue-500"
              } px-4 py-2 w-fit rounded-md hover:scale-110 duration-200 cursor-pointer`}
            >
              {item.TableNo} {item?.Status}
            </p>
          ))}
      </div>
    </div>
  );
};

export default PendingOrders;
