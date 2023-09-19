import { useState, useEffect } from 'react';
import api from '../../../../../config/AxiosBase';
import { useCtx } from '../../../../../context/Ctx';
import { IoIosArrowForward } from 'react-icons/io';
import { ManagerItemsListingItems } from '../manager-items-listings-items';

const ItemPage = () => {
  const { updateModalStatus, apiDone } = useCtx();
  const [isOpen, setIsOpen] = useState({});
  const [formattedData, setFormattedData] = useState();
  const [items, setItems] = useState();
  const [active, setActive] = useState('');

  const getCategories = async () => {
    try {
      const resp = await api.get(
        `/getAllCategories/${localStorage.getItem('managerId')}`,
        { withCredentials: true }
      );

      setFormattedData(resp.data.data);
      setActive(resp.data.data[0]?._id);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getItemByCategory = async () => {
    if (active !== '') {
      try {
        const resp = await api.get('/getItemsById/' + active, {
          withCredentials: true,
        });

        setItems(resp.data.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, [apiDone]);

  useEffect(() => {
    getItemByCategory();
  }, [active]);

  const handleItemClick = (category) => {
    setIsOpen((prevOpen) =>
      prevOpen === category.categoryName ? '' : category.categoryName
    );
    setActive(category._id);
  };

  return (
    <main className="bg-light-blue">
      <div className="flex justify-center items-start my-2">
        <div className="w-full my-1">
          <ul className="flex flex-col">
            {formattedData ? (
              formattedData.map((item) => (
                <li className="bg-white my-2 shadow-lg" key={item.categoryName}>
                  <h2
                    onClick={() => handleItemClick(item)}
                    className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
                  >
                    <span>{item.categoryName}</span>
                    <IoIosArrowForward
                      className={`${
                        isOpen === item.categoryName
                          ? '-rotate-90'
                          : 'rotate-90'
                      }`}
                    />
                  </h2>
                  <div
                    className={`${
                      isOpen === item.categoryName ? 'relative' : 'hidden'
                    } border-l-2 border-purple-600 duration-500 transition-all`}
                  >
                    <div className="p-3 mt-4 flex gap-4 flex-wrap">
                      {items?.length >= 1 ? (
                        <ManagerItemsListingItems formattedD={items} />
                      ) : (
                        <p>No Item Found</p>
                      )}
                      {/* {item.Tables.map((i, ind) => (
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
                                    (order) => order.TableNo === i.tableNumber
                                  )
                                ) {
                                  const order = ordersList.find(
                                    (order) => order.TableNo === i.tableNumber
                                  );
                                  localStorage.setItem('orderId', order._id);
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
                      ))} */}
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
  );
};

export default ItemPage;
