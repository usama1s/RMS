import { WaiterContent } from './components/waiterContent';
import { WaiterLayout } from './components/waiterLayout';
import { CartModal } from '../../components/cartModal';
import { useCartCtx } from '../../context/CartCtx';
import { Cart } from '../../components/cart';
import { TakeawayCartModal } from '../../components/takeawayCartModal';
import { TakeawayCart } from '../../components/takeawayCart';

export function Waiter() {
  const {
    cartModalStatus,
    cartStatus,
    takeawayCartModalStatus,
    takeawayCartStatus,
  } = useCartCtx();

  return (
    <WaiterLayout>
      <WaiterContent />
      {/* dine in cart */}
      {cartModalStatus.open && <CartModal />}
      {cartStatus && <Cart />}
      {/* takeaway cart */}
      {takeawayCartModalStatus.open && <TakeawayCartModal />}
      {takeawayCartStatus && <TakeawayCart />}
    </WaiterLayout>
  );
}
