import { useEffect, useState } from 'react';
import { BsClock } from 'react-icons/bs';
import { useCtx } from '../../../../context/Ctx';
import { ClockIn } from './components/clockin';
import { ClockOut } from './components/clockout';
import { PendingOrders } from '../pending-orders';
import { AddExpense } from '../expenses/add-expenses';
import { convertDateTime } from '../../../../utils/formatData';
import api, { url } from '../../../../config/AxiosBase';
import ClockinMessage from '../../../../components/ClockinMessage';
import HomeStats from './components/home-stats';

export const Home = () => {
  const { updateModalStatus, updateManagerClocking, managerClocking } =
    useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });
  const [formattedData, setFormattedData] = useState();
  const [clockingData, setClockingData] = useState();

  const getClockingsData = async () => {
    try {
      const resp = await api.get(
        `/getAllClockings/${localStorage.getItem('managerId')}`,
        {
          withCredentials: true,
        }
      );
      updateManagerClocking(resp.data.data[0]);
      setClockingData(resp.data.data[0]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Bad Request Error:', error.response.data);
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  const clockIn = async () => {
    setStatus({ loading: true, error: null });
    try {
      const response = await fetch(`${url}/checkIn`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.message !== 'Check-in successful!') {
        setStatus({ loading: false, error: 'Error updating the status.' });
      } else {
        setFormattedData(data);
        setStatus({ loading: false, error: null });
      }
    } catch (error) {
      setStatus({ loading: false, error: 'Error updating the status.' });
    }
  };

  const clockOut = async () => {
    setStatus({ loading: true, error: null });
    try {
      url;
      const response = await fetch(`${url}/checkOut/` + clockingData?._id, {
        method: 'PATCH',
        credentials: 'include',
      });
      await response.json();
      setFormattedData(null);
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error: 'Error updating the status.' });
    }
  };

  useEffect(() => {
    getClockingsData();
  }, [formattedData]);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-1/2 rounded shadow-md overflow-hidden max-w-xl relative bg-gray-900 text-gray-100">
          <div className="self-stretch flex items-center px-3 flex-shrink-0 bg-gray-700 text-teal-400">
            <BsClock className="h-8 w-8" />
          </div>
          <div className="p-4 flex justify-between w-full">
            {clockingData?.endDateTime !== null ? (
              <button
                type="button"
                className="px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800"
                onClick={() => {
                  updateModalStatus(
                    true,
                    <ClockIn
                      clockIn={clockIn}
                      disabled={status.loading}
                      loading={status.loading}
                    />
                  );
                }}
              >
                Clock In
              </button>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-bold">Clocked In at</h3>
                  <p className="text-sm dark:text-gray-400">
                    {convertDateTime(clockingData?.startDateTime)}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800"
                  onClick={() => {
                    updateModalStatus(
                      true,
                      <ClockOut
                        clockOut={clockOut}
                        disabled={status.loading}
                        loading={status.loading}
                      />
                    );
                  }}
                >
                  Clock Out
                </button>
              </>
            )}
          </div>
        </div>
        <button
          className="px-8 py-3 font-semibold rounded bg-gray-100 text-gray-800 shadow-md hover:bg-gray-200"
          onClick={() => updateModalStatus(true, <AddExpense />)}
        >
          Add Expense
        </button>
      </div>
      {managerClocking !== undefined ? (
        <>
          <HomeStats />
          <PendingOrders />
        </>
      ) : (
        <ClockinMessage />
      )}
    </div>
  );
};
