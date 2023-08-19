import { ManagerHeader } from './managerHeader';
import { useCtx } from '../../../context/Ctx';
import { Modal } from '../../../components/modal';
import { Home } from './Home';
import { Lobbies } from './lobbies';
import { ManagerCategory } from './categories';
import { ManagerItems } from './items';
import { ManagersWaiterSection } from './waiters';
import { PaymentMethods } from './payment-methods';
import { CompletedOrder } from './completed-order';
import { Expenses } from './expenses';

export function ManagerContent() {
  const { activeTab, modalStatus } = useCtx();

  const renderManagerContent = (slug) => {
    switch (slug) {
      case 'Home':
        return <Home />;
      case 'Lobbies':
        return <Lobbies />;
      case 'Categories':
        return <ManagerCategory />;
      case 'Menu Items':
        return <ManagerItems />;
      case 'Waiters':
        return <ManagersWaiterSection />;
      case 'Payment Methods':
        return <PaymentMethods />;
      case 'Branch Statistics':
        return <CompletedOrder />;
      case 'Manage Expenses':
        return <Expenses />;
    }
  };

  return (
    <div className={'w-full px-4 lg:px-6 overflow-x-hidden'}>
      <ManagerHeader />
      {renderManagerContent(activeTab)}
      {modalStatus.status && <Modal />}
    </div>
  );
}
