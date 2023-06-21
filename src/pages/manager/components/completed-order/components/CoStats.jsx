import React, { useEffect, useState } from "react";
import { BiStats } from "react-icons/bi";
import { ImStatsDots, ImStatsBars } from "react-icons/im";
import api from "../../../../../config/AxiosBase";
import { useCtx } from "../../../../../context/Ctx";

const CoStats = ({ id }) => {
  const { selectedOrderType } = useCtx();
  const [totalOrders, setTotalOrders] = useState();
  const [totalSales, setTotalSales] = useState();
  const [totalExpense, setTotalExpense] = useState();

  const getTotalOrders = async () => {
    const resp = await api.get(`/getOrderByClocking/${id}`, {
      withCredentials: true,
    });
    setTotalOrders(resp.data);
  };

  const getTotalSales = async () => {
    const resp = await api.get(`/getSoldItemsSales/${id}`, {
      withCredentials: true,
    });
    setTotalSales(resp.data);
  };

  const getTotalExpenses = async () => {
    const resp = await api.get(`/getAllExpenses/${id}`, {
      withCredentials: true,
    });
    setTotalExpense(resp.data);
  };

  useEffect(() => {
    getTotalOrders();
    getTotalSales();
    getTotalExpenses();
  }, [id]);

  console.log(totalExpense);

  return (
    <section className="p-6 my-6 dark:text-gray-100">
      <div className="container flex flex-wrap gap-2 justify-between mx-auto ">
        <div
          className="flex flex-1 p-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1 cursor-pointer"
          onClick={() => {
            updateOrderType("PaymentDone");
          }}
        >
          <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400">
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
          className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1 cursor-pointer"
          onClick={() => {
            updateOrderType("PaymentDone");
          }}
        >
          <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400">
            <ImStatsDots className="h-9 w-9 dark:text-gray-800" />
          </div>
          <div className="flex flex-col justify-center align-middle">
            <p className="text-3xl font-semibold leadi">
              {totalOrders?.canceledOrderTotal}{" "}
              <span className=" text-base">({totalSales?.cancelled} TRY)</span>
            </p>
            <p className="capitalize">Cancelled Orders</p>
          </div>
        </div>
        <div className="flex flex-1 p-4 space-x-4 rounded-lg md:space-x-6 dark:bg-gray-900 dark:text-gray-100 col-span-1">
          <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 dark:bg-teal-400">
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
    </section>
  );
};

export default CoStats;
