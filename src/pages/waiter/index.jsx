import { WaiterContent } from "./components/waiterContent";
import { WaiterLayout } from "./components/waiterLayout";
import { CartModal } from "../../components/cartModal";
import { useCartCtx } from "../../context/CartCtx";
import { Cart } from "../../components/cart";
export function Waiter() {
  const { cartModalStatus, cartStatus } = useCartCtx();
  return (
    <WaiterLayout>
      <WaiterContent />
      {cartModalStatus.open && <CartModal />}
      {cartStatus && <Cart />}
    </WaiterLayout>
  );
}
