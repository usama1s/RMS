import { useState, useEffect } from 'react';
import api from '../../../../config/AxiosBase';
import { useCtx } from '../../../../context/Ctx';
import { useCartCtx } from '../../../../context/CartCtx';
import { WaiterOrder } from '../orders';
import { IoIosArrowForward } from 'react-icons/io';

const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formattedData, setFormattedData] = useState();
  const [ordersList, setOrdersList] = useState();
  const [noLobbyError, setNoLobbyError] = useState('');
  const [active, setActive] = useState('');
  const [orderDetail, setOrderDetail] = useState();
  const [isOpen, setIsOpen] = useState({});
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const { onItemAddFromAPI, updateCartStatus, addOrderData, resetApiCart } =
    useCartCtx();

  const getLobbies = async () => {
    try {
      setIsLoading(true);
      let lobbyIds = [];

      const subRole = localStorage.getItem('SubRole');

      const profile = await api.get('me', {
        withCredentials: true,
      });

      if (subRole === 'Regular Waiter') {
        lobbyIds = profile.data.data.doc.assignedLobbies?.map(
          (item) => item.value
        );
      }

      const lobbyIdsString = lobbyIds.join(',');

      const managerId = localStorage.getItem('managerId');

      let resp;
      if (subRole === 'Regular Waiter') {
        resp = await api.get(`/getLobbiesByWaiter/${managerId}`, {
          withCredentials: true,
          params: { lobbyIds: lobbyIdsString },
        });
      } else {
        resp = await api.get(`/getLobbies/${managerId}`, {
          withCredentials: true,
        });
      }

      setFormattedData(resp?.data.data);
      setIsOpen(resp?.data?.data?.lobbyName);
      setActive(resp?.data?.data?.lobbyName);
    } catch (err) {
      setNoLobbyError(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    const resp = await api.get(
      `/getAllOrdersByManager/${localStorage.getItem('managerId')}`,
      {
        withCredentials: true,
      }
    );

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
      slug: resp?.data.data[0]._id,
      createdAt: resp?.data.data[0].createdAt,
      lobby: resp?.data.data[0].LobbyName,
      tableNo: resp?.data.data[0].TableNo,
      item: resp?.data.data[0].OrderItems,
      totalPrice: resp?.data.data[0].TotalPrice,
      customerCount: resp?.data.data[0].CustomerCount,
    };

    onItemAddFromAPI(transformObj);
    updateCartStatus(true);
  };

  useEffect(() => {
    // getMe();
    getLobbies();
    getOrders();
  }, [apiDone]);

  function filterArrayByValues(arr1, arr2) {
    // Create a set of values from the first array for efficient lookup
    const valuesToFilterBy = new Set(arr1?.map((item) => item.value));

    // Use filter to create a new array containing only the items with matching values
    const filteredArray = arr2?.filter((item) =>
      valuesToFilterBy.has(item._id)
    );

    return filteredArray;
  }

  // console.log('testing ', filterArrayByValues(profile, formattedData));

  const handleItemClick = (lobbyName) => {
    setIsOpen((prevOpen) => (prevOpen === lobbyName ? '' : lobbyName));
    setActive(lobbyName);
  };

  const handleTableClick = (item, table) => {
    if (!table.isBooked) {
      localStorage.setItem('seletedLobby', item.lobbyName);
      localStorage.setItem('seletedTable', table.tableNumber);
      localStorage.setItem('selectedLobbyId', item._id);
      localStorage.removeItem('orderId');
      resetApiCart();

      addOrderData(item.lobbyName, table.tableNumber);

      updateModalStatus(
        true,
        <UpdateStatusJSX
          slug={orderDetail?._id}
          updateModalStatus={updateModalStatus}
          updateApiDoneStatus={updateApiDoneStatus}
          apiDone={apiDone}
          updateCartStatus={updateCartStatus}
        />
      );
    } else {
      const existingOrder = ordersList.filter(
        (order) =>
          order.TableNo === table.tableNumber && order.Status === 'Pending'
      );

      localStorage.setItem('orderId', existingOrder[0]._id);

      if (existingOrder) {
        localStorage.setItem('seletedLobby', item.lobbyName);
        localStorage.setItem('seletedTable', table.tableNumber);
        localStorage.setItem('selectedLobbyId', item._id);
        resetApiCart();
        addOrderData(item.lobbyName, table.tableNumber);

        getSingleOrders(
          item.lobbyName,
          table.tableNumber,
          existingOrder[0]._id
        );
      }
    }
  };

  if (error) return <p>Something went wrong.</p>;
  if (noLobbyError) return <p>No Lobbies Found</p>;

  return (
    <>
      <main className="p-5 bg-light-blue">
        <div className="flex justify-center items-start my-2">
          <div className="w-full my-1">
            <ul className="flex flex-col">
              {formattedData &&
                formattedData?.map((item) => (
                  <li className="bg-white my-2 shadow-lg" key={item.lobbyName}>
                    <h2
                      onClick={() => handleItemClick(item.lobbyName)}
                      className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
                    >
                      <span>{item.lobbyName}</span>
                      <IoIosArrowForward
                        className={`${
                          isOpen === item.lobbyName ? '-rotate-90' : 'rotate-90'
                        }`}
                      />
                    </h2>
                    <div
                      className={`${
                        isOpen === item.lobbyName ? 'relative' : 'hidden'
                      } border-l-2 border-gray-900 duration-500 transition-all`}
                    >
                      <div className="p-3 mt-4 flex gap-4 flex-wrap">
                        {item.Tables?.map((i, ind) => (
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
                              handleTableClick(item, i);
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
      {/* {toggleDetail && (
        <div className="mt-4 bg-blue-500 p-4 rounded-2xl text-white">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-2">Order Detail</h1>
            <span
              className="font-bold cursor-pointer"
              onClick={() => setToggleDetail(false)}
            >
              X
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <h2 className="font-semibold">Customer Name:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Name}
              </h2>
            </div>
            <div className="flex gap-4">
              <h2 className="font-semibold">Table No:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.TableNo}
              </h2>
            </div>
          </div>
          <div className="border-t-2 border-b-2 py-2 my-2 ">
            <div className="flex gap-4">
              <h2 className="font-semibold">Title:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Title}
              </h2>
            </div>

            <div className="flex gap-4">
              <h2 className="font-semibold">Quantity:</h2>
              <h2 className="text-gray-900 font-semibold">{orderDetail.Qty}</h2>
            </div>
            <div className="flex gap-4">
              <h2 className="font-semibold">Price:</h2>
              <h2 className="text-gray-900 font-semibold">
                {orderDetail.Price}
              </h2>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Total Price</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.TotalPrice}
                </h2>
              </div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Payment Method:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.PaymentMethod}
                </h2>
              </div>
            </div>
            <div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Type:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.Type}
                </h2>
              </div>
              <div className="flex gap-4">
                <h2 className="font-semibold">Status:</h2>
                <h2 className="text-gray-900 font-semibold">
                  {orderDetail.Status}
                </h2>
              </div>
              {orderDetail.Status !== 'Delivered' && (
                <button
                  className="bg-gray-900 py-1 px-2 rounded-md hover:underline hover:scale-105 duration-200"
                  onClick={async () =>
                    updateModalStatus(
                      true,
                      <UpdateStatusJSX
                        slug={orderDetail?._id}
                        updateModalStatus={updateModalStatus}
                        updateApiDoneStatus={updateApiDoneStatus}
                        apiDone={apiDone}
                      />
                    )
                  }
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default PendingOrders;

const UpdateStatusJSX = () => {
  return <WaiterOrder />;
};
