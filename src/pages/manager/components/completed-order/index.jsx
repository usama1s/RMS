import React, { useState, useEffect } from 'react';
import { useCtx } from '../../../../context/Ctx';
import api from '../../../../config/AxiosBase';
import DataTable from 'react-data-table-component';
import CoCharts from './components/CoCharts';
import CoStats from './components/CoStats';
import ItemPriceChart from './components/ItemPriceChart';
import ItemSoldByTime from './components/ItemSoldByTime';
import NetPriceStats from './components/NetPriceStats';
import StatisticsSelection from './components/StatisticsSelection';

export const CompletedOrder = () => {
  const { apiDone, selectedOrderType } = useCtx();
  const [formattedData, setFormattedData] = useState();
  const [expenseData, setExpenseData] = useState();
  const [clockingData, setClockingData] = useState();
  const [selectedClocking, setSelectedClocking] = useState('all');
  const [showOrderTable, setShowOrderTable] = useState(true);
  const [showExpenseTable, setShowExpenseTable] = useState(false);
  const [selectedClockingPeriod, setSelectedClockingPeriod] = useState('');
  const [statisticsState, setStatisticsState] = useState('all');

  const handleStatisticsSelection = (data) => {
    setStatisticsState(data);
  };

  const getClockingsData = async () => {
    const resp = await api.get(
      `/getAllClockings/${localStorage.getItem('managerId')}`,
      {
        withCredentials: true,
      }
    );
    setClockingData(resp.data.data);
  };

  const getOrderByClockingsData = async () => {
    const resp = await api.get(
      `/getOrderByClocking/${statisticsState}/${selectedClocking}`,
      {
        withCredentials: true,
      }
    );
    setFormattedData(resp.data.data);
  };

  const getExpenses = async () => {
    const resp = await api.get(`/getAllExpenses/${selectedClocking}`, {
      withCredentials: true,
    });
    setExpenseData(resp.data.data);
  };

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  }

  const column = [
    {
      name: 'Id',
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: 'Date and Time',
      selector: (row) => convertTimestamp(row.createdAt),
      sortable: true,
    },
    {
      name: 'Total Price',
      selector: (row) => row.TotalPrice,
      sortable: true,
    },
    {
      name: 'PaymentMethod',
      selector: (row) => row.PaymentMethod,
      sortable: true,
    },
  ];

  const expenseColumn = [
    {
      name: 'Id',
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: 'Date and Time',
      selector: (row) => convertTimestamp(row.createdAt),
      sortable: true,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: 'PaymentMethod',
      selector: (row) => row.paymentMethod,
      sortable: true,
    },
  ];

  const expenseExpandedComponent = ({ data }) => (
    <div className="flex items-center  bg-gray-200 shadow-md w-[50%] p-4 rounded-md my-4 relative mx-auto">
      <div>
        <h3 className="font-bold text-xl">Expense Detail</h3>
        <div className="flex gap-8 font-semibold text-sm">
          <p className="w-[100px]">Item Title</p>
          <p className="text-gray-600 mb-2 ">{data?.title}</p>
        </div>
        <div className="flex gap-8 font-semibold text-sm">
          <p className="w-[100px]">Amount</p>
          <p className="text-gray-600 mb-2 ">{data?.amount} TRY</p>
        </div>
        <div className="flex gap-8 font-semibold text-sm">
          <p className="w-[100px]">Payment Method</p>
          <p className="text-gray-600 mb-2 ">{data?.paymentMethod}</p>
        </div>
        <div className="flex gap-8 font-semibold text-sm">
          <p className="w-[100px]">Created At: </p>
          <p className="text-gray-600 mb-2 ">
            {convertTimestamp(data?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );

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
        <p className="text-gray-600 mb-2 ">{data.TotalPrice} TL</p>
      </div>
    </div>
  );

  useEffect(() => {
    getOrderByClockingsData();
    getExpenses();
    getClockingsData();
  }, [apiDone, statisticsState]);

  useEffect(() => {
    getOrderByClockingsData();
    getExpenses();
  }, [selectedClocking]);

  const handleClockingSelection = (e) => {
    setSelectedClocking(e.target.value.split(',')[0]);
    setSelectedClockingPeriod(e.target.value);
  };

  return (
    <div className="mt-2">
      <StatisticsSelection
        handleStatisticsSelection={handleStatisticsSelection}
      />
      <h1 className="text-2xl font-bold">Branch Statistics</h1>
      <div className="flex justify-between items-center">
        {selectedClockingPeriod === '' || selectedClockingPeriod === 'all' ? (
          <span className="bg-gray-600 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1">
            All
          </span>
        ) : (
          <span className="bg-gray-600 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1">
            {convertTimestamp(selectedClockingPeriod.split(',')[0])} to{' '}
            {convertTimestamp(selectedClockingPeriod.split(',')[1])}
          </span>
        )}
        <select
          onChange={(e) => handleClockingSelection(e)}
          className="bg-gray-900 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1"
        >
          <option value="all">All</option>
          {clockingData &&
            clockingData?.map((item, index) => (
              <option
                key={index + 1}
                value={`${item?.startDateTime},${item?.endDateTime}`}
              >
                {convertTimestamp(item?.startDateTime)}
              </option>
            ))}
        </select>
      </div>

      <NetPriceStats id={selectedClocking} />
      <CoStats
        type={statisticsState}
        id={selectedClocking}
        setShowExpenseTable={setShowExpenseTable}
        setShowOrderTable={setShowOrderTable}
      />

      <div className="flex justify-center mb-12 mx-6">
        <div className="flex justify-between gap-4">
          <CoCharts type={statisticsState} id={selectedClocking} />
          <ItemPriceChart type={statisticsState} id={selectedClocking} />
          <ItemSoldByTime type={statisticsState} id={selectedClocking} />
        </div>
      </div>
      {showExpenseTable && (
        <DataTable
          columns={expenseColumn}
          data={expenseData?.sort((a, b) => a.createdAt - b.createdAt)}
          pagination
          fixedHeader
          highlightOnHover
          expandableRows
          expandableRowsComponent={expenseExpandedComponent}
        />
      )}
      {showOrderTable && (
        <DataTable
          columns={column}
          data={formattedData
            ?.filter((item) => item.Status === selectedOrderType)
            .sort((a, b) => a.createdAt - b.createdAt)}
          pagination
          fixedHeader
          highlightOnHover
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      )}
    </div>
  );
};
