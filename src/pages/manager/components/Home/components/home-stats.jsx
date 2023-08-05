import React, { useState, useEffect, useReducer } from "react";
import { useCtx } from "../../../../../context/Ctx";
import { BiStats } from "react-icons/bi";
import { ImStatsDots, ImStatsBars } from "react-icons/im";
import { BsInfoCircleFill } from "react-icons/bs";
import api from "../../../../../config/AxiosBase";

const fetchData = async (url) => {
  const resp = await api.get(url, {
    withCredentials: true,
  });
  return resp.data;
};

const initialState = {
  totalOrders: null,
  totalSales: null,
  totalExpense: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        totalOrders: action.payload.totalOrders,
        totalSales: action.payload.totalSales,
        totalExpense: action.payload.totalExpense,
      };
    default:
      return state;
  }
};

const HomeStats = () => {
  const [tabs, setTabs] = useState(1);
  const { updateOrderType, managerClocking } = useCtx();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { totalOrders, totalSales, totalExpense } = state;

  const getClockingsData = async () => {
    const resp = await api.get(
      `/getAllClockings/${localStorage.getItem("managerId")}`,
      {
        withCredentials: true,
      }
    );

    fetchDataAsync(resp.data.data[0].startDateTime);
  };

  useEffect(() => {
    getClockingsData();
  }, []);

  const fetchDataAsync = async (clockingData) => {
    try {
      const [orders, sales, expenses] = await Promise.all([
        fetchData(`/getOrderByClocking/${clockingData}`),
        fetchData(`/getSoldItemsSales/${clockingData}`),
        fetchData(`/getAllExpenses/${clockingData}`),
      ]);

      dispatch({
        type: "SET_DATA",
        payload: {
          totalOrders: orders,
          totalSales: sales,
          totalExpense: expenses,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {managerClocking?.status !== false ? (
        <section className="py-4 dark:text-gray-100">
          <div className="container flex flex-wrap gap-2 justify-between mx-auto">
            <div
              className="flex flex-1 p-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1 cursor-pointer group hover:bg-gray-800"
              onClick={() => {
                updateOrderType("PaymentDone");
                setTabs(1);
              }}
            >
              <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400 group-hover:scale-105 duration-200">
                <BiStats className="h-9 w-9 dark:text-gray-800" />
              </div>
              <div className="flex flex-col justify-center align-middle">
                <p className="text-3xl font-semibold leading">
                  {totalOrders?.completedOrderTotal}{" "}
                  <span className=" text-base">
                    ({totalSales?.paymentDone} TRY)
                  </span>
                </p>
                <p className="capitalize">Completed Orders</p>
              </div>
            </div>
            <div
              className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1 cursor-pointer group hover:bg-gray-800"
              onClick={() => {
                updateOrderType("cancelled");
                setTabs(2);
              }}
            >
              <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400 group-hover:scale-105 duration-200">
                <ImStatsDots className="h-9 w-9 dark:text-gray-800" />
              </div>
              <div className="flex flex-col justify-center align-middle">
                <p className="text-3xl font-semibold leadi">
                  {totalOrders?.canceledOrderTotal}{" "}
                  <span className=" text-base">
                    ({totalSales?.cancelled} TRY)
                  </span>
                </p>
                <p className="capitalize">Cancelled Orders</p>
              </div>
            </div>
            <div
              className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1 cursor-pointer group hover:bg-gray-800"
              onClick={() => {
                setTabs(3);
              }}
            >
              <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400 group-hover:scale-105 duration-200">
                <ImStatsBars className="h-9 w-9 dark:text-gray-800" />
              </div>
              <div className="flex flex-col justify-center align-middle">
                <p className="text-3xl font-semibold leadi">
                  {totalExpense?.expenseCountTotal}{" "}
                  <span className=" text-base">
                    ({totalExpense?.totalExpense} TRY)
                  </span>
                </p>
                <p className="capitalize">Expenses</p>
              </div>
            </div>
          </div>
          {/* <div className="mt-4 flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1">
        {totalOrders?.paymentCounts?.map((item, index) => (
          <div className="flex gap-4" key={index + 1}>
            <p>{item._id}</p>
            <p className="flex justify-center px-2 align-middle rounded-lg dark:bg-teal-400 group-hover:scale-105 duration-200 text-gray-900 font-semibold">
              {item.totalPriceSum} TL
            </p>
          </div>
        ))}
      </div> */}
          {/* Payment Methods Stats */}
          {tabs === 1 && (
            <div className="mt-4">
              <p className="text-gray-900 font-semibold mb-0">
                Branch Statistics
              </p>
              <div className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1">
                {totalOrders?.paymentCounts.map((item, index) => (
                  <div className="flex gap-4" key={index + 1}>
                    <p>{item._id}</p>
                    <p className="flex justify-center px-2 align-middle rounded-lg dark:bg-teal-400 group-hover:scale-105 duration-200 text-gray-900 font-semibold">
                      {item.totalPriceSum} TL
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tabs === 3 && (
            <div className="mt-4">
              <p className="text-gray-900 font-semibold mb-0">Expenses</p>
              <div className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1">
                {totalExpense?.paymentCounts.map((item, index) => (
                  <div className="flex gap-4" key={index + 1}>
                    <p>{item._id}</p>
                    <p className="flex justify-center px-2 align-middle rounded-lg dark:bg-teal-400 group-hover:scale-105 duration-200 text-gray-900 font-semibold">
                      {item.totalAmount} TL
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="rounded p-2 bg-yellow-500 mt-2 shadow-md">
          <p className="my-5 text-black text-base leading-7">
            Please <span className="font-semibold">Clock In</span> to start
            today’s session.
            <span className="flex items-center gap-2">
              <BsInfoCircleFill />
              Make sure you start the session only once in a day to avoid
              confusions later on in the stats and sales management.
            </span>
            <span className="flex items-center gap-2">
              <BsInfoCircleFill />
              <span className="font-semibold">Clock In</span> once you are going
              to start the sales in the morning and{" "}
              <span className="font-semibold">Clock Out</span> after you end
              your work day in the night.
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default HomeStats;
