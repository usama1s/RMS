import React, { useEffect, useState } from 'react';
import { useCtx } from '../../../../context/Ctx';
import { ClockIn } from './components/clockin';
import { ClockOut } from './components/clockout';
import { Loading } from '../../../../components/loading';

export function ClockingSystem() {
  const { updateModalStatus } = useCtx();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [formattedData, setFormattedData] = useState('');
  const [date, setDate] = useState('');
  const [dateId, setDateId] = useState('');

  const handleClockIn = async () => {
    setStatus({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/checkIn', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.message !== 'Check-in successful!') {
        setStatus({ loading: false, error: 'Error updating the status.' });
      } else {
        const { startDateTime, _id } = data.newClocking;
        setFormattedData(startDateTime);
        localStorage.setItem('ClockInDate', startDateTime);
        localStorage.setItem('ClockInId', _id);
        setDate(startDateTime); // Update the date when clocked in
        setStatus({ loading: false, error: null });
      }
    } catch (error) {
      setStatus({ loading: false, error: 'Error updating the status.' });
    }
  };

  const handleClockOut = async () => {
    setStatus({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/checkOut/${dateId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      await response.json();
      setFormattedData('');
      localStorage.removeItem('ClockInDate');
      localStorage.removeItem('ClockInId');
      setDate(''); // Update the date when clocked out
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error: 'Error updating the status.' });
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('ClockInDate');
    const storedId = localStorage.getItem('ClockInId');
    setDate(storedData);
    setDateId(storedId);
  }, []);

  const convertDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(); // Use the browser's locale for formatting
  };

  return (
    <div>
      {!date ? (
        <div className="flex items-center justify-between">
          <h1>Clock in</h1>
          <button
            className="bg-black text-white"
            onClick={() => {
              updateModalStatus(
                true,
                <ClockIn
                  clockIn={handleClockIn}
                  disabled={status.loading || date}
                  loading={status.loading}
                />
              );
            }}
          >
            Clock in
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p>
            Clocked-In at <span>{convertDateTime(date)}</span>
          </p>
          <button
            className="bg-black text-white"
            onClick={() => {
              updateModalStatus(
                true,
                <ClockOut
                  clockOut={handleClockOut}
                  disabled={status.loading || !date}
                  loading={status.loading}
                />
              );
            }}
          >
            Clock Out
          </button>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center h-[20vh]">
          <Loading />
        </div>
      )}
      {error && (
        <h1>{error?.message ? error?.message : 'Error right now..'}</h1>
      )}
    </div>
  );
}
