import { useState, useEffect } from 'react';
import { useCtx } from '../../../../context/Ctx';
import { useCartCtx } from '../../../../context/CartCtx';
import { IoIosArrowForward } from 'react-icons/io';
import api from '../../../../config/AxiosBase';

export const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formattedData, setFormattedData] = useState(false);
  const [ordersList, setOrdersList] = useState();
  const [active, setActive] = useState('');
  const [isOpen, setIsOpen] = useState({});
  const { apiDone, managerClocking } = useCtx();
  const { onItemAddFromAPI, updateCartStatus, addOrderData } = useCartCtx();

  const getLobbies = async () => {
    try {
      setIsLoading(true);
      const resp = await api.get(
        `/getLobbies/${localStorage.getItem('managerId')}`,
        {
          withCredentials: true,
        }
      );

      setFormattedData(resp.data.data);
      setIsOpen(resp.data.data?.lobbyName);
      setActive(resp.data.data?.lobbyName);
    } catch (err) {
      console.log(err.response.data.message);
      if (err.response.data.message === 'No lobby found') {
        setError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    try {
      const resp = await api.get(
        `/getAllOrdersByManager/${localStorage.getItem('managerId')}`,
        {
          withCredentials: true,
        }
      );

      setOrdersList(resp.data.data);
    } catch (e) {
      console.log(e);
    }
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
      customerCount: resp.data.data[0].CustomerCount,
    };

    updateCartStatus(true, null);
    onItemAddFromAPI(transformObj);
  };

  useEffect(() => {
    getLobbies();
    getOrders();
  }, [apiDone]);

  const handleItemClick = (lobbyName) => {
    setIsOpen((prevOpen) => (prevOpen === lobbyName ? '' : lobbyName));
    setActive(lobbyName);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>No Lobby Found.</p>;

  return (
    <>
      {managerClocking && managerClocking?.status !== false ? (
        <main className="bg-light-blue">
          <div className="flex justify-center items-start mb-3">
            <div className="w-full">
              <ul className="flex flex-col">
                {formattedData ? (
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
                        <IoIosArrowForward
                          className={`${
                            isOpen === item.lobbyName
                              ? '-rotate-90'
                              : 'rotate-90'
                          }`}
                        />
                      </h2>
                      <div
                        className={`${
                          isOpen === item.lobbyName ? 'relative' : 'hidden'
                        } border-l-2 border-purple-600 duration-500 transition-all`}
                      >
                        <div className="p-3 mt-4 flex gap-4 flex-wrap">
                          {item.Tables.map((i, ind) => (
                            <p
                              key={ind + 1}
                              className={`${
                                i?.isBooked !== true &&
                                ordersList &&
                                ordersList?.map((j) => j.TableNo === i.tableNo)
                                  ? 'bg-gray-400'
                                  : 'bg-blue-500'
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
                                        'orderId',
                                        order._id
                                      );
                                    }
                                  }
                                  localStorage.setItem(
                                    'seletedLobby',
                                    item.lobbyName
                                  );
                                  localStorage.setItem(
                                    'seletedTable',
                                    i.tableNumber
                                  );
                                  addOrderData(item.lobbyName, i.tableNumber);
                                  getSingleOrders(
                                    item.lobbyName,
                                    i.tableNumber,
                                    localStorage.getItem('orderId')?.toString()
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
                  ))
                ) : (
                  <p>No Pending Orders Found</p>
                )}
              </ul>
            </div>
          </div>
        </main>
      ) : null}
    </>
  );
};
