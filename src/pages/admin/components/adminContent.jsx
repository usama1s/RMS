import { AdminHeader } from './adminHeader';
import { useCtx } from '../../../context/Ctx';
import { AdminManagerSection } from './managers';
import { Modal } from '../../../components/modal';

export function AdminContent() {
  const { activeAdminTab, modalStatus } = useCtx();

  const renderManagerContent = (slug) => {
    switch (slug) {
      case 'Branches':
        return <AdminManagerSection />;
      // case "Z":
      //   return <h2>z</h2>;
    }
  };

  return (
    <div className={'w-full px-4 lg:px-6 overflow-x-hidden'}>
      <AdminHeader />
      {renderManagerContent(activeAdminTab)}
      {modalStatus.status && <Modal />}
    </div>
  );
}
