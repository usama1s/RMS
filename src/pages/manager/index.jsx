import { ManagerLayout } from './components/managerLayout';
import { ManagerContent } from './components/managerContent';
import { CartModal } from '../../components/cartModal';
import { useCartCtx } from '../../context/CartCtx';
import { ManCart } from '../../components/manCart';
// import ManagerTakeawayCart from '../../components/managerTakeawayCart';
import { ManagerTakeawayCart } from '../../components/managerTakeawayCart';

export function Manager() {
  const { cartModalStatus, cartStatus, manTakeawayCartStatus } = useCartCtx();

  return (
    <ManagerLayout>
      {<ManagerContent />}
      {cartModalStatus.open && <CartModal />}
      {cartStatus && <ManCart />}
      {manTakeawayCartStatus && <ManagerTakeawayCart />}
    </ManagerLayout>
  );
}
