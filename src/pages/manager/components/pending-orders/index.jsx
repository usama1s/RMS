import React, { useState, useEffect } from "react";
import { useCtx } from "../../../../context/Ctx";
import { useCartCtx } from "../../../../context/CartCtx";
import api from "../../../../config/AxiosBase";

export const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formattedData, setFormattedData] = useState(false);
  const [ordersList, setOrdersList] = useState();
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState({});
  const { apiDone, managerClocking } = useCtx();
  const { onItemAddFromAPI, updateCartStatus, addOrderData } = useCartCtx();

  const getLobbies = async () => {
    try {
      setIsLoading(true);
      const resp = await api.get(
        `/getLobbies/${localStorage.getItem("managerId")}`,
        {
          withCredentials: true,
        }
      );

      setFormattedData(resp.data.data);
      setIsOpen(resp.data.data?.lobbyName);
      setActive(resp.data.data?.lobbyName);
    } catch (err) {
      console.log(err.response.data.message);
      if (err.response.data.message === "No lobby found") {
        setError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    const resp = await api.get("/getAllOrdersByManager", {
      withCredentials: true,
    });

    setOrdersList(resp.data.data);
  };

  const getSingleOrders = async (lobbyName, tableNo, orderId) => {
    const resp = await api.get(
      `/getSingleOrder/${lobbyName}/${tableNo}/${orderId}`,
      {
        withCredentials: true,
      }
    );

    const transformObj = {
      slug: resp.data.data[0]._id,
      createdAt: resp.data.data[0].createdAt,
      lobby: resp.data.data[0].LobbyName,
      tableNo: resp.data.data[0].TableNo,
      item: resp.data.data[0].OrderItems,
      totalPrice: resp.data.data[0].TotalPrice,
    };

    updateCartStatus(true, null);
    onItemAddFromAPI(transformObj);
  };

  useEffect(() => {
    getLobbies();
    getOrders();
  }, [apiDone]);

  const handleItemClick = (lobbyName) => {
    setIsOpen((prevOpen) => (prevOpen === lobbyName ? "" : lobbyName));
    setActive(lobbyName);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>No Lobby Found.</p>;

  return (
    <>
      {managerClocking && managerClocking?.status !== false ? (
        <>
          {" "}
          <div className="mt-8">
            <h1 className="text-xl font-bold">Pending Dine In Orders</h1>
            <main className="p-5 bg-light-blue">
              <div className="flex justify-center items-start my-2">
                <div className="w-full my-1">
                  <ul className="flex flex-col">
                    {formattedData &&
                      formattedData.map((item) => (
                        <li
                          className="bg-white my-2 shadow-lg"
                          key={item.lobbyName}
                        >
                          <h2
                            onClick={() => handleItemClick(item.lobbyName)}
                            className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
                          >
                            <span>{item.lobbyName}</span>
                            <svg
                              className={`fill-current text-gray-700 h-6 w-6 transform transition-transform duration-500 ${
                                isOpen === item.lobbyName ? "rotate-180" : ""
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                            </svg>
                          </h2>
                          <div
                            className={`${
                              isOpen === item.lobbyName ? "relative" : "hidden"
                            } border-l-2 border-purple-600 duration-500 transition-all`}
                          >
                            <div className="p-3 mt-4 flex gap-4 flex-wrap">
                              {item.Tables.map((i, ind) => (
                                <p
                                  key={ind + 1}
                                  className={`${
                                    i?.isBooked !== true &&
                                    ordersList &&
                                    ordersList?.map(
                                      (j, index) => j.TableNo === i.tableNo
                                    )
                                      ? "bg-gray-400"
                                      : "bg-blue-500"
                                  } px-4 py-2 w-14 h-14 rounded-md hover:scale-110 duration-200 cursor-pointer flex items-center justify-center text-white`}
                                  onClick={() => {
                                    if (i?.isBooked === true) {
                                      {
                                        if (
                                          ordersList?.find(
                                            (order) =>
                                              order.TableNo === i.tableNumber
                                          )
                                        ) {
                                          const order = ordersList.find(
                                            (order) =>
                                              order.TableNo === i.tableNumber
                                          );
                                          localStorage.setItem(
                                            "orderId",
                                            order._id
                                          );
                                        }
                                      }
                                      localStorage.setItem(
                                        "seletedLobby",
                                        item.lobbyName
                                      );
                                      localStorage.setItem(
                                        "seletedTable",
                                        i.tableNumber
                                      );
                                      addOrderData(
                                        item.lobbyName,
                                        i.tableNumber
                                      );
                                      getSingleOrders(
                                        item.lobbyName,
                                        i.tableNumber,
                                        localStorage
                                          .getItem("orderId")
                                          ?.toString()
                                      );
                                    }
                                  }}
                                >
                                  {i.tableNumber}
                                </p>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </>
      ) : null}
    </>
  );
};
