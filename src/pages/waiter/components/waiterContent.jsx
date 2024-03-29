import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/modal';
import { TakeAway } from './takeaway/index.jsx';
import { AiFillWarning } from 'react-icons/ai';
import { useCtx } from '../../../context/Ctx';
import { WaiterHeader } from './waiterHeader';
import PendingOrders from './pendingOrders/PendingOrders';
import api from '../../../config/AxiosBase';

export function WaiterContent() {
  const { activeWaiterTab, modalStatus } = useCtx();
  const [clockInData, setClockInData] = useState('');
  const [subRole, setSubRole] = useState('');

  const getClockIn = async () => {
    const resp = await api.get(
      `/getAllClockings/${localStorage.getItem('managerId')}`,
      {
        withCredentials: true,
      }
    );
    setClockInData(resp.data.data[0]);
  };

  useEffect(() => {
    const role = localStorage.getItem('SubRole');
    setSubRole(role);
    getClockIn();
  }, []);

  const renderWaiterContentHead = (slug) => {
    switch (slug) {
      case 'Dine in':
        return <PendingOrders />;
      case 'Take away':
        return <TakeAway />;
      default:
        <h1>Abc</h1>;
    }
  };

  const renderWaiterContentNormal = (slug) => {
    switch (slug) {
      case 'Dine in':
        return <PendingOrders />;
      case 'Take away':
        return <TakeAway />;
      default:
        <h1>Abc</h1>;
    }
  };

  const renderWaiterContentChef = (slug) => {
    switch (slug) {
      case 'Pending Orders':
        return <h1>Pending Orders for Chef</h1>;
      default:
        <h1>Abc</h1>;
    }
  };

  return (
    <div className={'w-full px-4 lg:px-6 overflow-x-hidden'}>
      <WaiterHeader />
      {clockInData.managerId?._id === localStorage.getItem('managerId') &&
      clockInData.status != true ? (
        <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
            <AiFillWarning className="w-5 h-5" />
            <span className="sr-only">Warning icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            Ask manager to <span className="font-semibold">clock in</span>.
          </div>
        </div>
      ) : subRole && subRole === 'Regular Waiter' ? (
        renderWaiterContentNormal(activeWaiterTab)
      ) : subRole && subRole === 'Chef' ? (
        renderWaiterContentChef(activeWaiterTab)
      ) : subRole && subRole == 'Head Waiter' ? (
        renderWaiterContentHead(activeWaiterTab)
      ) : (
        ''
      )}
      {modalStatus.status && <Modal />}
    </div>
  );
}
